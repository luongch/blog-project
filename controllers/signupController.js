const bcrypt = require('bcryptjs');
const User = require('../models/user')
const { body,check, validationResult } = require("express-validator");

exports.user_create_get = (req,res,next) => {
    res.render("signup", {title: "Sign up"})
}
exports.user_create_post = [
    body("username")
        .trim()
        .isLength({min:1})
        .escape()
        .withMessage("User name must be specified"),
    body("password")
        .trim()
        .isLength({min:1})
        .escape()
        .withMessage("Password must be specified"),
    // check(
    //     'passwordConfirmation',
    //     'passwordConfirmation field must have the same value as the password field',
    //     )
    //     .exists()
    //     .custom((value, { req }) => value === req.body.password),
    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            console.log("error with form validation", errors)
            res.render("signup", {
                title: "Sign up",
                user: req.body,
                errors: errors.array()
            })
            return;
        }
        /**
         *add some code here to verify if user exists already 
         *
         */
        bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
            if(err) {
                console.log("failed to hash")
                return next(err)
            }
            const user= new User({
                username: req.body.username,
                password: hashedPassword,
                isAdmin: false
            });
            user.save((err)=>{
                if(err) {
                    console.log("failed to save")
                    return next(err)
                }
                res.status(200).send({data: {user}})
            });
        });   
    }
]
