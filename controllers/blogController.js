const Blog = require('../models/blog')

let getBlogs = async function(req,res,next){
    let blogs = await Blog.find({});
    res.status(200).send({data: {blogs}})
}

let getBlog = async function(req,res,next){
    let blog = await Blog.findById({_id: req.params.id})
    res.status(200).send({data:{blog}})
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