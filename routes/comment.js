express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const comment = require('../models/comment');

//get all comments related to a specific post
router.get('/', commentController.getComments)
//get specific comments post
router.get('/:id',function(req,res,next){
    res.send("got specific comments")
})
//update post
router.put('/:id', commentController.updateComment)
//delete post
router.delete('/:id', function(req,res,next){
    res.send("deleted comments")
})

module.exports = router;