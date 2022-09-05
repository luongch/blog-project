const Blog = require('../models/blog')

let getBlogs = async function(req,res,next){
    let blogs = await Blog.find({});
    // console.log(blogs)
    res.status(200).send({data: {blogs}})
}

let getBlog = function(req,res,next){
    res.send("got specific blogs")
}

let addBlog = function(req,res,next){
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
        res.send("success")
    })
    
}

let updateBlog = function(req,res,next){
    res.send("updated post")
}

let deleteBlog = function(req,res,next){
    res.send("deleted blog")
}

module.exports = {
    getBlogs,
    getBlog,
    addBlog,
    updateBlog,
    deleteBlog
}