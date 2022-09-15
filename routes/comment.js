express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const comment = require('../models/comment');

//get all comments related to a specific post
router.get('/', commentController.getComments)
//update post
router.put('/:id', commentController.updateComment)
//delete post
router.delete('/:id', commentController.deleteComment)

module.exports = router;