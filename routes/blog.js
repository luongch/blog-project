express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const commentController = require('../controllers/commentController')

//get all blog posts
router.get('/', blogController.getBlogs)
//get specific blog post
router.get('/:id', blogController.getBlog)
//create new post
router.post('/', blogController.addBlog)
//update post
router.put('/:id', blogController.updateBlog)
//delete post
router.delete('/:id', blogController.deleteBlog)
router.get('/test/test', blogController.test)


router.post('/:id/comment', commentController.addComment)

module.exports = router;