"use strict";

/** 
 * Accept data object like {name, num_employees, description, logo_url}
 * 
 * Return JSON { setCols: "", values: [..."datatoUpdate"]}
 * 
 * WARNING: This function doesn't enforce data types in the data object.
 * 
 * Example:
 * _unsafe_SqlForPartialUpdate({ name: "the", num_employees: 4 })
 * Return { setCols: 'name=$1, num_employees=$2', values: ['the', 4] }
 */

function _unsafe_SqlForPartialUpdate(dataToUpdate) {
  const cols = Object.keys(dataToUpdate).map(
    (col, idx) => `${col}=$${idx + 1}`);

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}



module.exports = {
  _unsafe_SqlForPartialUpdate
};


// Saving as another option for SQL query
// Another method to query with case insensitive
//whereClause.push(`lower(name) LIKE '%'||$${idx + 1}||'%'`);

// Another method to use later
/* TODO: refactor to find a shorthand
* Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
  }); */

//TODO. OLD FUNCTION

/** Keeping as a record of progress  */
/** Accepts data object and returns a filter String.
 *
 * Take in data to filter { column names }
 *
 * Returns objects like {
                          setSelect: "",
                          setWhere: "",
                          setWhereValues: [],
                          }
 *
 * Take in data to filter, like {name, minEmployees, maxEmployees} - good for models/company
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

//take out _unssafeSql for , _unsafe for function above - logic belongs in model
//put in models/companies
//handle minE > maxEmp - write a test
// function _unsafeSqlForFilterQuery(dataToFilter) {
//   console.log("sqlForFilter with criteria: ", dataToFilter)

//   let selectClause = ["handle", "name"];
//   let whereClause = [];
//   let whereValues = [];

//   for (let key in dataToFilter) {
//     const val = dataToFilter[key]; 

//     //inside if()
//     whereValues.push(val);
//     //const idx = 0 //whereValues.indexOf(val); //idx will always be 0

//     //wherevalue.push() inside if
//     if (key.includes("name")) {
//       // whereValues.push(val ${ idx + 1});
//       whereClause.push(`name ILIKE '%'||$${whereValues.length + 1}||'%'`);
//     }

//     if (key.includes("min")) {
//       whereClause.push(`num_employees >= $${idx + 1}`);
//     }

//     if (key.includes("max")) {
//       whereClause.push(`num_employees <= $${idx + 1}`);
//     }
//   }

//   const finalWhereClause = whereClause.join(" AND ")

//   if (finalWhereClause.includes("num")) { 
//     selectClause.push("num_employees");
//   }

//   const results = {
//     setSelect: selectClause.join(", "),
//     setWhere: finalWhereClause,
//     setWhereValues: whereValues,
//   }; 
//   //whereValues = [% %]
//   console.log("result object", results)
//   return results;




// }