"use strict";

//import sql.js
const { _unsafe_SqlForPartialUpdate} = require("./sql");
const sql = require("./sql");


/** Take in data to update, like {name, num_employees, description, logo_url}
 *
 * Return {setCols: "", values: [..."datatoUpdate"]}
 * 
 * Example:
 * _unsafe_SqlForPartialUpdate({ name: "the", num_employees: 4 })
 * Return { setCols: 'name=$1, num_employees=$2', values: ['the', 4] }
 * 
 */

// TODO: Use beforeEach in all the test, and refactor name
let fakeUpdateData;

beforeAll(function () { //run once
  fakeUpdateData = [
    { name: "apply", num_employees: 23, description: "", logo_url: "" },
    { name: "imby" },
    {},
  ]

});

afterAll(function () {
})


describe("_unsafe_SqlForPartialUpdate test", function () {
  const fakeUpdateData = [
    { name: "apply", num_employees: 23, description: "new desc" },
    { name: "imby", logo_url: "" },
    {},
  ]

  test("3 fields update success", function () {
    const fakeData = fakeUpdateData[0];
    //change fakeData = fakeUpdateData[0];
    const companyUpdate = _unsafe_SqlForPartialUpdate(fakeData);

    const result = {
      setCols: "name=$1, num_employees=$2, description=$3",
      values: ["apply", 23, "new desc"]
    }

    expect(companyUpdate).toEqual(result)
  })


  test("no input provided", function () {
    const fakeData = fakeUpdateData[2];

    const companyUpdate = _unsafe_SqlForPartialUpdate(fakeData)

    const result = { setCols: '', values: [] }

    expect(companyUpdate).toEqual(result);
  })
  // not essential
  test("one field updates success", function () {
    const fakeData = fakeUpdateData[1];

    const companyUpdate = _unsafe_SqlForPartialUpdate(fakeData);

    const result = {
      setCols: "name=$1, logo_url=$2",
      values: ["imby", ""]
    }
    expect(companyUpdate).toEqual(result)
  })
}

)

