"use strict"

const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//TODO. NEED TO CONVERT EQUITY INTO INTEGER IN TEST
describe("findAll", function() {
  test("successfully findAll without filtering", async function() {
  let jobs = await Job.findAll()
  console.log("this is jobs", jobs)
    expect(jobs).toEqual([
      { id: expect.any(Number), title: "J1", salary: 1, equity: "0.1"},
      { id: expect.any(Number), title: "J2", salary: 2, equity: "0.2" },
      { id: expect.any(Number), title: "J3", salary: 3, equity: "0.3" },
    ]);
  })
})