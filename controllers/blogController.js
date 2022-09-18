const Blog = require('../models/blog')
const { body, validationResult } = require("express-validator")
const User = require("../models/user")
const {isAdmin} = require('./userController');

let test = function(req,res,next) {
    return res.status(200).json({"test":"test test"});
}

let getBlogs = function(req,res,next){
    Blog.find()
        .exec(function(err, blogs) {
            if(err) {
                return next(err)
            }
            res.status(200).send({data: {blogs}})
        })
}

let getBlog = function(req,res,next){
    Blog.findById({_id: req.params.id})
    .exec(function(err,blog){
        if(err) {
            return next(err)
        }
        res.status(200).send({data:{blog}})
    })
}

let addBlog = function(req,res,next){
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({
            message: req.body,
            errors: errors.array()
        })
    }
    verifyAdmin(req,res)
    const blog = new Blog(
        {
            title: req.body.title,
            text: req.body.text,
            author: "author",
            dateCreated: Date.now()
        }
    )
    console.log("this is the user trying to save a blog,", req.user)
    blog.save((err)=>{
        if(err) {
            return next(err)
        }
        else {
            res.status(200).send({data: {
                blog
            }})
        }
    })
}


let updateBlog = [
    body("title")
        .trim()
        .isLength({min:1})
        .escape()
        .withMessage("Title required"),
    body("text")
        .trim()
        .isLength({min:1})
        .escape()
        .withMessage("Text required")
    ,
    function(req,res,next){
        verifyAdmin(req,res)
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.status(400).send({
                message: req.body,
                errors: errors.array()
            })
        }
        else {
            
            const updatedBlog = new Blog(
                {
                    title: req.body.title,
                    text: req.body.text,
                    dateUpdated: Date.now(),
                    _id: req.params.id,
                    
                }
            )
            Blog.findByIdAndUpdate(req.params.id, updatedBlog, {}, (err)=>{
                if(err) {
                    return next(err)
                }
                res.status(200).send({data: {
                    "blog": updatedBlog
                }})
            })
        }
    }
]

let deleteBlog = function(req,res,next){
    //need to delete all comments related to this blog as well before 
    //doing the actual delete
    Blog.findOneAndDelete({_id:req.params.id}, function(err) {
        if(err) {
            return next(err)
        }
        res.status(200).send({message: "delete successful"})
    })
}

const verifyAdmin = async function(req,res) {
    let results = await isAdmin(req.user._id)
    if(!results.isAdmin){
        res.status(401).send({message: "must be admin to post"})
    }
    
}

module.exports = {
    getBlogs,
    getBlog,
    addBlog,
    updateBlog,
    deleteBlog,
    test
}