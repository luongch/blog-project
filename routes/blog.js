express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const commentController = require('../controllers/commentController')
const requireUser = require("../middleware/requireUser")
const { body } = require("express-validator")
const passport = require('passport');

//get all blog posts
router.get('/', blogController.getBlogs)
//get specific blog post
router.get('/:id', blogController.getBlog)
//create new post
router.post('/',
    passport.authenticate('jwt', { session: false }),
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
        console.log("before adding blog", req.user)
        blogController.addBlog(req,res,next)
    }
)
//update post
router.put('/:id', passport.authenticate('jwt', { session: false }), blogController.updateBlog)
//delete post
router.delete('/:id', passport.authenticate('jwt', { session: false }), blogController.deleteBlog)

router.post('/:id/comment', commentController.addComment)

module.exports = router;