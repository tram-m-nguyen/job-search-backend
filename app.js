"use strict";

/** Express app for jobly. */

const express = require("express");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const companiesRoutes = require("./routes/companies");
const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs")

const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/companies", companiesRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);

//Returns actual number when querying numeric column 
var types = require('pg').types
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

//TODO. KNOW BUG FOR RETURN EQUITY AS A STR

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */


app.use(function (err, req, res, next) {
  //if (process.env.NODE_ENV !== "test") console.error(err.stack);
  //this line suppresses more detailed error messages, 
  //uncomment: if (process.env.NODE_ENV !== "test") to get more detailed 
  //error messages with : console.error(err.stack);
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
