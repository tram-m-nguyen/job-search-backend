"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and is_admin field.)
 *
 * It's not an error if no token was provided or if the token is invalid ---
 * this middleware is purely provided authentication, not authorization.
 *
 **/

function authenticateJWT(req, res, next) {
  try {
    const token = req.body._token;
    // Remove token because it's not needed after this middleware
    delete req.body._token;
    if (token) res.locals.user = jwt.verify(token, SECRET_KEY); // returns {username: ...}
    return next();
  } catch (err) {
    console.warn("cannot authenticate token", err);
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 **/

// This is written with an inner function to perform the security check or throw
// an error: this makes this easily unit-tested.

function _ensureLoggedIn(req, res) {
  console.log("res.locals.user", res.locals.user);
  if (!res.locals.user) throw new UnauthorizedError();
}

// The outer function can be integration tested when used in Express. This is
// the function that should be included as middleware.

function ensureLoggedIn(req, res, next) {
  try {
    _ensureLoggedIn(req, res);
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use on routes that only admin users should be able to use.
 * 
 * If not, raise Unauthorized error.
 */

 // This is an inner function to perform log-check and admin-check or throw an error
function _ensureAdmin(req, res, next) {
  _ensureLoggedIn(req, res);
  if (res.locals.user.is_admin !== true) throw new UnauthorizedError();
}
 // The outer function, should be included as middleware.

function ensureAdmin(req, res, next) {
  try {
    _ensureAdmin(req, res)
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  _ensureLoggedIn,
  ensureLoggedIn,
  ensureAdmin,
  _ensureAdmin
};
