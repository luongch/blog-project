const express = require('express');
const router = express.Router();
const authentication_controller = require('../controllers/authenticationController')

// POST login page
router.post('/login', authentication_controller.user_login_post);

// POST logout
router.post('/logout', authentication_controller.user_logout_post);

module.exports = router;
