const { Request, Response, NextFunction } = require("express");

const requireUser = (req, res, next) => {
  const user = res.locals.user;
  console.log("inside requireUser")
  if (!user) {
    console.log("user isn't logged in")
    return res.sendStatus(403);
  }

  return next();
};

module.exports = requireUser;
