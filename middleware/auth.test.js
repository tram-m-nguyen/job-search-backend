"use strict";

const jwt = require("jsonwebtoken");
const {
  authenticateJWT,
  _ensureLoggedIn,
  _ensureAdmin,
} = require("./auth");
const { UnauthorizedError } = require("../expressError");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", is_admin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", is_admin: false }, "wrong");

describe("authenticateJWT", function () {
  test("success via body", async function () {
    const req = { body: { _token: testJwt } };
    const res = { locals: {} };
    const next = function () {
    };
    await authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        is_admin: false,
      },
    });
  });

  test("no token", async function () {
    const req = { body: {} };
    const res = { locals: {} };
    const next = function () {
    };
    await authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("invalid token", async function () {
    const req = { body: { _token: badJwt } };
    const res = { locals: {} };
    const next = function () {
    };
    await authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
    // this is taking 18ms to run 
  });
});


describe("_ensureLoggedIn", function () {
  test("success", function () {
    const req = {};
    const res = { locals: 
                    { user:
                        { username: "test", 
                        is_admin: false } 
                      } 
                    };
    _ensureLoggedIn(req, res);
  });

  test("failure", function () {
    const req = {};
    const res = { locals: {} };
    try {
      _ensureLoggedIn(req, res);
      fail(`Error was expected`);
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy()
    }
  });
});

describe("_ensureAdmin", function () {
  test("success", function () {
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: true } } };
    _ensureAdmin(req, res);
  })

  test("failure not logged in", function () {
    const req = {};
    const res = { locals: {} };
    try {
      _ensureAdmin(req,res);
      fail(`Error was expected`);
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  })
  test("failure not admin", function () {
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false} } };
    try {
      _ensureAdmin(req, res);
      fail(`Error was expected`);
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  })
})

