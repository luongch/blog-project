const bcrypt = require('bcryptjs');
const User = require('../models/user')
const { body,check, validationResult } = require("express-validator");
const passport = require('passport')

exports.user_login_post = [
    body("username")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Username required"),
    body("password")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Password required")
    ,
    (req,res,next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(401)
            return;
        }
        
        /**
         *passport.authenticate returns a function directly and that function 
         * takes in req,res, by calling (req,res,next) right after we are passing
         * in those parameters to the returned function
         * It is equivalent to the follwing commented out code
         */
        // let test = passport.authenticate("local", {
        //     successRedirect: "/",
        //     failureRedirect: "/login"
        // })
        

        //https://stackoverflow.com/questions/41292348/404-not-found-error-setting-up-passport-in-express-4
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                console.log("there is an error")
                return res.status(500).send();
            } 
            if (!user) {
                console.log("there is no user")
                return res.status(400).json({error:info.message});
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.status(200).json({data:req.user});
            });
        })(req, res, next);
    }    
]

exports.user_logout_post = function(req,res,next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).json({data:1});
    });
}