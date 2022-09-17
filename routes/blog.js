express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const commentController = require('../controllers/commentController')
const requireUser = require("../middleware/requireUser")
const { body } = require("express-validator")

//get all blog posts
router.get('/', blogController.getBlogs)
//get specific blog post
router.get('/:id', blogController.getBlog)
//create new post
router.post('/', function(req,res,next){
    requireUser(req,res,next)
    },
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
        blogController.addBlog(req,res,next)
    }
)
//update post
router.put('/:id', blogController.updateBlog)
//delete post
router.delete('/:id', blogController.deleteBlog)
router.get('/test/test', blogController.test)


router.post('/:id/comment', commentController.addComment)

module.exports = router;