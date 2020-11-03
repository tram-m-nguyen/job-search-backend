"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { _unsafe_SqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** If query given filter companies by query criteria; else find all companies.
   *
   * If query given, returns [{ handle, name, num_employees }, ...] (empty list if none found)
   * If no query, returns [{ handle, name }, ...] (empty list if none found)
   * */

  static async findAll(data = {}) {
    console.log("Company.findAll(", data, ")")

    let query = `SELECT handle, name
                   FROM companies`;
    let whereClause = [];
    let whereValues = [];

    if (data.minEmployees > data.maxEmployees) throw new BadRequestError();

    const { name, minEmployees, maxEmployees } = data;

    if (name !== undefined) {
      // whereValues.push(name)
      // whereClause.push(`name ILIKE '%||$${whereValues.length}||%'`);
      const wildCardName = '%' + name + '%' // '%${name}%'
      whereValues.push(wildCardName)
      whereClause.push(`name ILIKE $${whereValues.length}`);
    }

    if (minEmployees !== undefined) {
      whereValues.push(minEmployees)
      whereClause.push(`num_employees >= $${whereValues.length}`);
    }

    if (maxEmployees !== undefined) {
      whereValues.push(maxEmployees)
      whereClause.push(`num_employees <= $${whereValues.length}`);
    }


    if (whereClause.length > 0) {
      query += ` WHERE ` + whereClause.join(" AND ");
    }

    query += ` ORDER BY name`;
    console.log("query is now: ", query, "whereValues", whereValues);

    const result = await db.query(query, [...whereValues]);
    console.log("this is result", result.rows);
    return result.rows;
  }


  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, num_employees, description, logo_url }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
           FROM companies
           WHERE handle = $1`,
      [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }


  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, num_employees, description, logo_url }
   *
   * Returns { handle, name, num_employees, description, logo_url }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, num_employees, description, logo_url }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM companies
           WHERE handle = $1`,
      [handle]);

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate company: ${handle}`);
    }

    const result = await db.query(
      `INSERT INTO companies
           (handle, name, num_employees, description, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, num_employees, description, logo_url`,
      [
        handle,
        name,
        num_employees,
        description,
        logo_url,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, num_employees, description, logo_url}
   *
   * Returns {handle, name, num_employees, description, logo_url}
   *
   * Throw BadRequestError if no data provided.
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    if (Object.keys(data).length === 0) throw new BadRequestError("No data to update");

    const { setCols, values } = _unsafe_SqlForPartialUpdate(data);
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                num_employees, 
                                description, 
                                logo_url`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }



  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies 
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;