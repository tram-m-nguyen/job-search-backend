"use strict"

/** Routes for jobs */

//TODO. WRITE SCHEMA
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job")

//TODO. CHANGE BELOW FOR JOBS SCHEMA - ONCE CREATED
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobFilterSchema = require("../schemas/jobFilter.json");

const router = new express.Router();


/**GET / => {companies: [{id, title}}, ...]} 
 * TODO. ADD FILTER METHOD
 * Can filter on provided search filters:
 * - title (will find case-insensitive, partial matches)
 * - minSalary - with at least this salary
 * - hasEquity - boolean - if false or not included in filtering, will return
 *   list of all jobs 
 *
 * Authorization required: none
 **/

router.get("/", async function (req, res, next) {
  try {

    const validator = jsonschema.validate(req.body, jobFilterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    //const filterQuery = req.body;
    const query = req.body;
    //change const job = await Job.findAll(filterQuery)
    const job = await Job.findAll();
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { job }
 *
 *  Job is {id, title, salary, equity, company_handle, name}
 * 
 * Return [{id, title, salary, equity, company_handle, name}]
 *
 * Authorization required: none
 **/

router.get("/:id", async function(req, res, next){
  try{
    const job = await Job.get(req.params.id)
    
    return res.json({job})
  } catch (err){
    return next(err)
  }
})

/** POST/{job} => {job}
 *  Post new job.
 * job JSON should be {id, title, salary, equity, company_handle, name}
 * 
 * Return {id, title, salary, equity, company_handle, name}
 * 
 * Authorization required: admin 
 **/

router.post("/", ensureAdmin, async function(req, res, next){
  try{
    console.log("this is req.body___________", req.body)
    
    const validator = jsonschema.validate(req.body, jobNewSchema)
    
    if (!validator.valid){
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({job});
  } catch(err){
    return next(err);
  }

})


/** PATCH / [id] { fld1, fld2, ... } => { job }
 * 
 * Patches job data.
 *
 * fields can be: {id, title, salary, equity, company_handle}
 *
 * Returns {id, title, salary, equity, company_handle, name}
 *
 * Authorization required: admin
 */

 router.patch("/:id", ensureAdmin, async function(req, res, next){
   try {
     const validator = jsonschema.validate(req.body, jobUpdateSchema);
     if (!validator.valid) {
       const errs = validator.errors.map(e => e.stack);
       throw new BadRequestError(errs);
     }

     const job = await Job.update(req.params.id, req.body);
     return res.json({ job });
   } catch (err) {
     return next(err);
   }
 })

/** DELETE /[id]  =>  { deleted: id }
*
* Authorization required: admin
**/

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;