const { Request, Response, NextFunction } = require("express");

const requireUser = (req, res, next) => {
  const user = res.locals.currentUser;
  console.log("inside requireUser")
  if (!user) {
    console.log("user isn't logged in")
    return res.sendStatus(403);
  }
  console.log("session is valid")
  return next();
};

module.exports = requireUser;
