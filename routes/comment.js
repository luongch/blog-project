express = require('express');
const router = express.Router();

//get all comments related to a specific post
router.get('/', function(req,res,next){
    res.send("got all comments")
})
//get specific comments post
router.get('/:id',function(req,res,next){
    res.send("got specific comments")
})
//update post
router.put('/:id', function(req,res,next){
    res.send("updated comment")
})
//create new post
router.post('/', function(req,res,next){
    res.send("created new comment")
})
//delete post
router.delete('/:id', function(req,res,next){
    res.send("deleted comments")
})

module.exports = router;