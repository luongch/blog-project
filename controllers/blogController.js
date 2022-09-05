const Blog = require('../models/blog')
const { body, validationResult } = require("express-validator")


let getBlogs = async function(req,res,next){
    let blogs = await Blog.find({});
    res.status(200).send({data: {blogs}})
}

let getBlog = async function(req,res,next){
    let blog = await Blog.findById({_id: req.params.id})
    res.status(200).send({data:{blog}})
}

let addBlog = [
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
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.status(400).send({
                message: req.body,
                errors: errors.array()
            })
        }
        const blog = new Blog(
            {
                title: req.body.title,
                text: req.body.text,
                author: "author",
                dateCreated: Date.now()
            }
        )
        blog.save((err)=>{
            if(err) {
                return next(err)
            }
            else {
                res.send("success")
            }
            
        })
        
    }   
]

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
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.status(400).send({
                message: req.body,
                errors: errors.array()
            })
        }
        const updatedBlog = new Blog(
            {
                title: req.body.title,
                text: req.body.text,
                dateUpdated: Date.now(),
                _id: req.params.id,
                
            }
        )
        Blog.findByIdAndUpdate(req.params.id, updatedBlog, {}, (err)=>{
            if(!err) {
                return next(err)
            }
            res.status(200).send("updated post")
        })
        
    }
]

let deleteBlog = function(req,res,next){
    Blog.findOneAndDelete({_id:req.params.id}, function(err) {
        if(err) {
            return next(err)
        }
        res.status(200).send({message: "delete successful"})
    })
}

module.exports = {
    getBlogs,
    getBlog,
    addBlog,
    updateBlog,
    deleteBlog
}