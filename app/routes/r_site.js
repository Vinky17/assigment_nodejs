const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/c_site');

router.get('/signup', sitesController.signUp);
router.get('/login', sitesController.logIn);
router.get('/logout', sitesController.logOut);

router.post('/signup', sitesController.handleSignUp);
router.post('/login', sitesController.handleLogIn);

router.get('/home', sitesController.getList);

module.exports = router;