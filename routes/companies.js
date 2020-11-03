"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const companyFilterSchema = require("../schemas/companyFilter.json");

const router = new express.Router();

/** GET /  =>  { companies: [{ handle, name }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 **/

router.get("/", async function (req, res, next) {
  try {

    const validator = jsonschema.validate(req.body, companyFilterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const filterQuery = req.body;
    const companies = await Company.findAll(filterQuery);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});



/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, num_employees, description, logo_url, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 **/

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** POST / { company } =>  { company }
 *
 * company should be { handle, name, num_employees, description, logo_url }
 *
 * Returns { handle, name, num_employees, description, logo_url }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: {name, num_employees, description, logo_url}
 *
 * Returns {handle, name, num_employees, description, logo_url}
 *
 * Authorization required: admin
 **/

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization required: admin
 **/

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;



// /**TRIED TO BUILD SEPERATE METHOD FOR FILTER
//  * 
//  * GET / FILTERTING => {}
//  * 
//  * This is an pure API app, taking and returning JSON. When data is passed to a GET request, it should be sent in the body of the request, not in the querystring.
//  * 
//  * Can filter on provided search filters:
//  * - minEmployees
//  * - maxEmployees
//  * - nameLike (will find case-insensitive, partial matches)
//  * - if minEmployees > maxEmployees => {status:400, message}
//  *
//  * Authorization required: none
//  * 
//  * 
//  */

// // TODO. query string vs JSON

// router.get("/", async function (req, res, next) {
//   try {
//     // let query = grab query or JSON, call static instance Company...()
//     const filterQuery = req.body;
//     let companies;

//     // if query.length = 0, Company.all()
//     // if query.length > 0, validate
//     // let result validate schema (query, filterSchema)
//     // if (!result.valid), throw an error {status:400, message}, else
//     if (Object.keys(filterQuery).length === 0) {
//       companies = await Company.findAll();
//     }
//     const result = jsonschema.validate(filterQuery, companyFilterSchema);
//     // TODO: ask about naming convention for schema $id 
//     // further research: confirm that jsonschemas cannot work on query strings

//     if (!result.valid) {
//       const msg = "minEmployees cannot be greater than maxEmployees";
//       throw new BadRequestError(message = msg);
//     }
//     companies = await Company.filter(filterQuery);

//     return res.json({ companies });
//   } catch (err) {
//     return next(err);
//   }
// });

// EXAMPLES RECEIVE.
// TODO: qeuery or body
// minEmployee = 3 => companies with 3 or more employees
// maxEmployee = 40 => companies with 40 or less employees
// minEmployee = 45 & maxEmployee = 40 => {status:400, message}
// name = net => companies whose names contain "net": ("Bay Net team", "oneNET", "net team")

// VALIDATE: Use Schema (borrow from existing company schema)

// no database filter logic in route, filter in in the model
// no existing method in Company; create

// write unittest to test out different combinations
// write test for the route: does it validate properly,does it use the model method properly

// keep documenting 

