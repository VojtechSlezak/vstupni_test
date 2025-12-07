const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const request = require('supertest');
const app = require('./index'); 

jest.mock('serpapi', () => ({
    getJson: jest.fn((options, callback) => {
        const mockResponseData = {
            search_metadata: { status: "OK" },
            organic_results: [
                { title: "Výsledek 1", link: "http://link1.cz" },
                { title: "Výsledek 2", link: "http://link2.cz" }
            ],
            other_data: 'some_other_info'
        };

        callback(mockResponseData);
    }),
}));

const { getJson } = require('serpapi');


describe('POST /search Endpoint', () => {

    test('1. Mel by vrátit chybu 400, pokud je dotaz prázdný', async () => {
        const response = await request(app)
            .post('/search')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Dotaz je prázdný" });
        expect(getJson).not.toHaveBeenCalled();
    });

    test('2. Mel by vrátit výsledky vyhledávání při platném dotazu', async () => {
        const testQuery = "testovací dotaz";

        const response = await request(app)
            .post('/search')
            .send({ query: testQuery })
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);

        expect(getJson).toHaveBeenCalledWith(
            expect.objectContaining({
                api_key: expect.any(String),
                q: testQuery, 
                engine: 'google',
                gl: 'cz',
            }),
            expect.any(Function) 
        );

        expect(response.body).toHaveProperty('organic_results');
        expect(response.body.organic_results.length).toBeGreaterThan(0);
        
        expect(response.body.organic_results[0].title).toBe("Výsledek 1");
        expect(response.body.organic_results[1].link).toBe("http://link2.cz");
    });
});

