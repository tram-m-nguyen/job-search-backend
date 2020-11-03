"use strict";

const db = require("../db");
const { BadRequestError,
  NotFoundError } = require("../expressError");

//import helper functions if any
const { _unsafe_SqlForPartialUpdate} = require("../helpers/sql")



/** Related functions for jobs. */

class Job {
  /**
   * Accept data object like {id, title, salary, equity or company_handle}
   * 
   * Return all jobs [{id, title..}].
   * 
   */
  // TODO.Note for later: add filter ...
  // Example: _unsafeSqlForFilterQuery({ "name": "a", "minEmployees": 2 })
  //   * Return {
  //     setSelect: "handle, name, num_employees",
  // * setWhere: "name=$1 AND num_employees=$2",
  // * setWhereValues: ["a", 2]

  static async findAll() {
    console.log("Job.findAll() ran")

    let jobsResult;

    jobsResult = await db.query(
      `SELECT id, title, salary, equity
        FROM jobs
        ORDER BY title`
    )

    return jobsResult.rows
  }

  /** Given job id, return data about the job.
   * 
   * Joined jobs and companies table to display the company's full name.
   * 
   * Return {id, title, salary, equity, company_handle, name}
   * 
   * Throws NotFoundError if not found.
   */

  static async get(id) {
    //get(id) get a job by id
    const jobRes = await db.query(
      `SELECT j.id, j.title, j.salary, j.equity, c.name, j.company_handle, 
        FROM jobs AS j
        JOIN companies AS c
        ON j.company_handle = c.handle
        WHERE id = $1`,
      [id]
    )

    const job = jobRes.rows[0]

    if (!job) throw new NotFoundError(`No job with this ${id}`);

    return job;
  }

  /** Create a job (from data), update db, return new job data
   * 
   * Incoming data should be {title, salary, equity, company_handle}
   * 
   * Returns {id, title, salary, equity, company_handle}
   * 
   * Throw BadRequestError if job already in database.
    */
  
  static async create({ title, salary, equity, company_handle }){

      const result = await db.query(
        `INSERT INTO jobs
        (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, salary, equity, company_handle`, 
        [ 
          title, 
          salary, 
          equity, 
          company_handle]
      )

      const job = result.rows[0];
      console.log("this is job", job)

      return job;
  }

  /** Update job data with `data`.
   * 
   * This is a partial update -- data doesn't have to contain fields, update 
   * only fields that are provided.
   * 
   * Updating job should never change the id or the associate company_handle.
   * 
   * Data include: {title, salary, equity}
   * 
   * Return {id, title, salary, equity, company_handle}
   * 
   * Throw BadRequestError if no data provided.
   * Throw NotFoundError if not found.
   */

   static async update(id, data){
    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No data to update");
    }
    //TODO. IF REFACTOR NAME -- CHANGE HERE
     //const { setCols, values } = _DANGERsqlForPartialUpdate(data);
     const { setCols, values } = _unsafe_SqlForPartialUpdate(data);
     const idVarIdx = "$" + (values.length + 1);

     const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary,
                                equity,
                                company_handle`;

     const result = await db.query(querySql, [...values, id]);
     const job = result.rows[0];

     if (!job) throw new NotFoundError(`No job id: ${id}`);

     return job;
   }
  
  
  /** Delete a job from teh database; returns undefined.
   * 
   * Throw NotFoundError if job not found.
   */

  static async remove(id){
    const result = await db.query(
      `DELETE 
        FROM jobs
        WHERE id = $1
        RETURNING id`,
        [id]);

    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job id: ${id}`);

  } 
}

module.exports = Job;












// NOTEs for later
// /** Create a job (from data), update db, return new job data
//    * 
//    * Incoming data should be {id, title, salary, equity, company_handle}
//    * 
//    * Returns {id, title, salary, equity, company_handle}
//    * 
//    * Throw BadRequestError if job already in database.
//     */
//   //should not pass in an id bc there's not id in obj passed, in
//   //insert undefined as id into db, postgres says no!
//   static async create({ title, salary, equity, company_handle }){

//   //can't do duplicate check!! bc you dont' have id, you can have a job with
//   // sallary and equity
//   // const duplicateCheck = await db.query(
//   //   `SELECT id
//   //     FROM jobs
//   //     WHERE id = $1`,
//   //     [id]);

//   //   if (duplicateCheck.rows[0]){
//   //     throw new BadRequestError(`Duplicate job: ${id}`);
//   //   }

//   const result = await db.query(
//     `INSERT INTO jobs
//         (title, salary, equity, company_handle)
//         VALUES ($1, $2, $3, $4)
//         RETURNING id, title, salary, equity, company_handle`, //do want to get id back
//     [
//       title,
//       salary,
//       equity,
//       company_handle]
//   )

//   const job = result.rows[0];
//   console.log("this is job", job)

//   return job;
// }
