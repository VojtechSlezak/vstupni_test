const express = require("express");
const dotenv = require("dotenv");
const { getJson } = require("serpapi");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(express.json());

app.post("/search", (req, res) => {
    const query = req.body.query;
    if (!query) return res.status(400).json({ error: "Dotaz je prázdný" });

    getJson(
        { api_key: apiKey, q: query, engine: "google", gl: "cz" },
        (json) => {
            res.json(json);
        }
    );
});

app.use(express.static(path.join(__dirname)));

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server běží na http://localhost:${port}`);
    });
}

module.exports = app;
