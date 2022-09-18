const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");
const bcrypt = require("bcryptjs");
var cookieParser = require('cookie-parser');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user')

passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
      },
      async (token, done) => {
        console.log("in JWTStrategy")
        try {
            console.log("in TRY",token.user)
          return done(null, token.user);
        } catch (error) {
            console.log("error in JWTStrategy")
          done(error);
        }
      }
    )
  );

passport.use(
    "login",
    new LocalStrategy((username, password, done) => {
        console.log("in local strategy")
        User.findOne({ username: username }, (err, user) => {
        if (err) { 
            console.log("found an error")
            return done(err);
        }
        if (!user) {
            console.log("no user")
            return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                // passwords match! log user in
                console.log("success", user)
                return done(null, user)
            } else {
                // passwords do not match!
                console.log("pw doesn't match")
                return done(null, false, { message: "Incorrect password" })
            }
        })
        });
    })
);
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
  
// app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(function(req, res, next) {
//     res.locals.currentUser = req.user;
//     next();
// });