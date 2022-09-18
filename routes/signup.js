const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController')

// POST sign up page
router.post('/', user_controller.user_create_post);

module.exports = router;
