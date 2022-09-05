const Comment = require('../models/comment')

let getComments = (req,res,next) =>{
    //why does it fail when the blogId is wrong? shouldn't it throw the error instead?
    Comment.find({blogId:req.body.blogId})
        .exec(function(err,comments){
            if(err) {
                return next(err)
            }
            res.status(200).send({data: {comments}})
        })
}

let addComment = (req,res,next) =>{

    let comment = new Comment(
        {
            title: "test",
            text: "test",
            author: "author",
            dateCreated: Date.now(),
            blogId: req.params.id
        }
    )
    comment.save((err)=>{
        if(err) {
            return next(err)
        }
        res.status(200).send("successfully added comment")
    })
}

let updateComment = (req,res,next) => {
    console.log(req.params.id)
    let updatedComment = new Comment(
        {
            title: req.body.title,
            text: req.body.text,
            _id:req.params.id

        }
    )
    Comment.findByIdAndUpdate(req.params.id, updatedComment, {}, (err)=>{
        if(err) {
            return next(err)
        }
        res.status(200).send("updated comment")
    })
}

module.exports= {
    addComment,
    updateComment,
    getComments
}