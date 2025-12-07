const fs = require('fs'); 
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

let generateCsvContent;
let initializeListeners;

describe('CSV Generator', () => {

    beforeEach(() => {
        jest.resetModules(); 
        
        document.documentElement.innerHTML = html.toString();

        const scriptModule = require('./script');
        
        generateCsvContent = scriptModule.generateCsvContent;
        initializeListeners = scriptModule.initializeListeners;

        initializeListeners(); 
    });

    test('1. Mel by generovat CSV řetězec se záhlavím pro prázdná data', () => {
        const results = [];
        const expectedCsv = "data:text/csv;charset=utf-8,title,link\n";
        
        expect(generateCsvContent(results)).toBe(expectedCsv);
    });

    test('2. Mel by generovat CSV řetězec pro standardní výsledky', () => {
        const results = [
            { title: "Testovací článek", link: "https://test.cz/clanek" },
            { title: "Druhý odkaz", link: "https://druhy.com/page" }
        ];
        const expectedCsv = 
            'data:text/csv;charset=utf-8,title,link\n' +
            '"Testovací článek","https://test.cz/clanek"\n' +
            '"Druhý odkaz","https://druhy.com/page"\n';

        expect(generateCsvContent(results)).toBe(expectedCsv);
    });

    test('3. Mel by správně escapovat uvozovky v názvu', () => {
        const results = [
            { title: 'Titul s "uvozovkami"', link: "https://link.cz" }
        ];
        const expectedCsv = 
            'data:text/csv;charset=utf-8,title,link\n' +
            '"Titul s ""uvozovkami""","https://link.cz"\n';

        expect(generateCsvContent(results)).toBe(expectedCsv);
    });
});