const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/c_site');

router.get('/login', sitesController.logIn);
router.get('/signup', sitesController.signUp);

router.post('/login', sitesController.handleLogIn);
router.post('/signup', sitesController.handleSignUp);

router.get('/', sitesController.getList);

module.exports = router;