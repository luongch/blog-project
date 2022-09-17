const express = require('express');
const router = express.Router();
const signup_controller = require('../controllers/signupController')

// POST sign up page
router.post('/', signup_controller.user_create_post);

module.exports = router;
