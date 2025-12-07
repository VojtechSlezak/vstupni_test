function generateCsvContent(results) {
    let csvContent = "data:text/csv;charset=utf-8,title,link\n";
    results.forEach(r => {
        const title = `"${r.title.replace(/"/g, '""')}"`;
        const link = `"${r.link}"`;
        csvContent += `${title},${link}\n`;
    });
    return csvContent;
}

function initializeListeners() {
    const input = document.getElementById("slovoInput");
    const odeslatBtn = document.getElementById("odeslatBtn");
    const ulozitBtn = document.getElementById("ulozitBtn");
    const vysledky = document.getElementById("vysledky");

    let currentResults = [];

    odeslatBtn.addEventListener("click", async () => {
        const query = input.value.trim();
        if (!query) {
            vysledky.innerHTML = "<p>Zadej nějaké slovo.</p>";
            return;
        }

        vysledky.innerHTML = "<p>Načítám výsledky...</p>";

        try {
            const response = await fetch("/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (!data.organic_results || data.organic_results.length === 0) {
                vysledky.innerHTML = "<p>Žádné výsledky nenalezeny.</p>";
                currentResults = [];
                return;
            }

            currentResults = data.organic_results.map(r => ({
                title: r.title,
                link: r.link
            }));

            vysledky.innerHTML = "<h3>Výsledky hledání:</h3>";
            currentResults.forEach(r => {
                const item = document.createElement("div");
                item.innerHTML = `<p><strong>${r.title}</strong><br><a href="${r.link}" target="_blank">${r.link}</a></p>`;
                vysledky.appendChild(item);
            });

        } catch (err) {
            vysledky.innerHTML = "<p>Chyba při načítání výsledků.</p>";
            console.error(err);
        }
    });

    ulozitBtn.addEventListener("click", () => {
        if (!currentResults.length) {
            alert("Nejsou žádné výsledky k uložení.");
            return;
        }

        const csvContent = generateCsvContent(currentResults);
        try {
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "vysledky.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert("Výsledky byly úspěšně staženy do souboru 'vysledky.csv'."); // Zpětná vazba
        } catch (e) {
            console.error("Chyba při stahování CSV:", e);
            alert("Nastala chyba při pokusu o stažení výsledků.");
        }
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    initializeListeners();
}

module.exports = { generateCsvContent, initializeListeners };