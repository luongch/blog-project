const express = require("express");
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
const path = require("path");
const connectDb = require('./mongoConfig')

const blogRouter = require("../routes/blog")
const commentRouter = require("../routes/comment")
const authenticationRouter = require("../routes/authentication")
const signupRouter = require("../routes/signup")

const User = require('../models/user')

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");


const createServer = function(mongoDbUri) {
    
    const app = express();
    connectDb(mongoDbUri)

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    passport.use(
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
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
      
    app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
        res.locals.currentUser = req.user;
        next();
    });

    app.use('/blog', blogRouter)
    app.use('/comment', commentRouter)
    app.use('/signup', signupRouter)
    app.use('/auth', authenticationRouter)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        console.log("caught 404")
        console.log(res)
        next(createError(404));
    });

    // // error handler
    // app.use(function(err, req, res, next) {
    //     // set locals, only providing error in development
    //     res.locals.message = err.message;
    //     res.locals.error = req.app.get('env') === 'development' ? err : {};

    //     // render the error page
    //     res.status(err.status || 500).send({message:err.message});;
    // });
  
    return app
}


module.exports = createServer;