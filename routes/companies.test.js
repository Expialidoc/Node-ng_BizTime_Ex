// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testCo;

beforeEach(async function() {
    let result = await db.query(
      `INSERT INTO
        companies (code, name, description) VALUES ('TestCo', 'TestingCompany', 'Use for testing')
        RETURNING code, name, description`);
      //  INSERT INTO
      //   industries (code, industry) VALUES ('TST', 'TESTING') RETURNING code, industry
      //   INSERT INTO
      //   co_indu (co_id, indu_code) VALUES ('TestCo','TST') `);
    testCo = result.rows[0];                          console.log(testCo);
  });

  afterEach(async function() {
    await db.query("DELETE FROM companies");
  });
  
  afterAll(async function() {
    await db.end();// close db connection
  });

  describe("GET /companies", function() {
    test("Gets a list of companie", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
                                                           // console.log(response.body);
      expect(response.body).toEqual({
        companies: [testCo]         });
    });
  });

  describe("GET /companies/:code", function() {
    test("Gets a company by code", async function() {
      const response = await request(app).get(`/companies/${testCo.code}`);
                                                                console.log(response.body);
      testCo.industry = null; testCo.invoices = [];
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({company: testCo});
    });
  
    test("Responds with 404 if can't find", async function() {
      const response = await request(app).get(`/companies/0`);
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST /companies", () => {
    test("Creates a company", async () => {
      const res = await request(app).post('/companies').send({ code: 'TestCo2', name: 'TestingCompany2', description: 'Use for 2d testing'});
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        company: { code: 'TestCo2', name: 'TestingCompany2', description: 'Use for 2d testing'}
      })
    })
  })
  