"use strict";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u4Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



describe("POST /jobs", function () {

  test("ok for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({  
              title: "J1New", 
              salary: 10, 
              equity: .1, 
              company_handle: "c1", 
              _token: u4Token,
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
        job: {
        id: expect.any(Number),
        title: "J1New",
        salary: 10,
        equity: .1,
        company_handle: "c1", 
      },
    });
  });

  test("non-admin cannot post new job", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "J1New",
        salary: 10,
        equity: .1,
        company_handle: "c1",
        _token: u1Token,
      });
    expect(resp.statusCode).toEqual(401);
  });

  test( "anon cannot post new job", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "J1New",
        salary: 10,
        equity: .1,
        company_handle: "c1"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("fails with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        salary: 10,
        equity: .1,
        _token: u4Token,
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("fails with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "J1New",
        salary: 'the',
        equity: 'the',
        company_handle: "c1",
        _token: u4Token,
      });
    expect(resp.statusCode).toEqual(400);
  });
});


//Need to add more tests