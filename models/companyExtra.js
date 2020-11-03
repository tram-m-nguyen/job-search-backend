const { static } = require("express");

"use strict"

//TODO. EVERYTHING IN HERE IS OLD CODE

static async function findAll(){
  //make variable: select, handle, name
  //append ot that query where...

  let companiesRes;
  // if query {}
  if (Object.keys(data).length === 0) {
    companiesRes = await db.query(
      `SELECT handle, name
           FROM companies
           ORDER BY name`);
    return companiesRes.rows;
  }

  //have it return a string and it's a query
  const { setSelect, setWhere, setWhereValues } = _unsafeSqlForFilterQuery(data);
  // console.log("setSelect", setSelect, " setWhere", setWhere, " values", values);

  const querySql = `SELECT ${setSelect}
                  FROM companies
                  WHERE ${setWhere}`;

  const result = await db.query(querySql, [...setWhereValues]);
  // console.log("first result row", result.rows[0]);

  const company = result.rows;

  return company;
}

  //todo. rewrite test function
  static async findAll(data = {}) {
  console.log("Company.findAll(", data, ")")
    // TODO. keeping this code for record keeping; move down
    // make variable: select, handle, name
    // append ot that query where...

    // let companiesRes;
    // const selectStarts = ["handle", "name"]
    // const selectStatement = ""

    // if (data.name === undefined &&
    //   data.minEmployees === undefined &&
    //   data.maxEmployees === undefined) {

    //   companiesRes = await db.query(
    //     `SELECT handle, name
    //        FROM companies
    //         ORDER BY name`);
    //   return companiesRes.rows;
    // }

    // if (data.minEmployees > data.maxEmployees) {
    //   throw new BadRequestError(`minEmployees cannot be greater than maxEmployees`)
    // }

    // if (data.name !== undefined) {

    // }


    // have it return a string and it's a query
    // const { setSelect, setWhere, setWhereValues } = _unsafeSqlForFilterQuery(data);
    // console.log("setSelect", setSelect, " setWhere", setWhere, " values", values);

    // const company = result.rows;

    // return company;

}


//TODO. HELPER METHODS TO WRITE SELECT STATEMENT
/** Accepts data object and returns a filter String. 
* 
* Take in data to filter, like {name, minEmployees, maxEmployees} 
* Return { 
  setSelect: "",
  setWhere: "",
  setWhereValues: [],
}
* 
* Example: _unsafeSqlForFilterQuery({"name": "a", "minEmployees": 2})
* Return { setSelect: "handle, name, num_employees",
*          setWhere: "name=$1 AND num_employees=$2",
*          setWhereValues: ["a", 2]}
*/
// `SELECT handle, name
// FROM companies
// WHERE name ILIKE %tom%
// ORDER BY name`

function _unsafeSqltoFilterQuery(dataToFilter) {
  console.log("sqlForFilter with criteria: ", dataToFilter)
  //{ "name": "a", "minEmployees": 2 }
  let selectClause = ["handle", "name"];
  let whereClause = ["name ILIKE"]; //$1
  let whereValues = []; //["a"]

  for (let key in dataToFilter) {
    const val = dataToFilter[key];

    if (key.includes("name")) {
      whereValues.push(val); //"a"
      whereClause.push(`'%'||$${whereValues.length + 1}||'%'`);
    }

    if (key.includes("min")) {
      whereValues.push(val); //"a"
      whereClause.push(`'%'||$${whereValues.length + 1}||'%'`);
    }

    if (key.includes("max")) {
      whereClause.push(`num_employees <= $${idx + 1}`);
    }
  }

  const finalWhereClause = whereClause.join(" AND ")

  if (finalWhereClause.includes("num")) {
    selectClause.push("num_employees");
  }

  const results = {
    setSelect: selectClause.join(", "),
    setWhere: finalWhereClause,
    setWhereValues: whereValues,
  };
  //whereValues = [% %]
  console.log("result object", results)
  return results;

}