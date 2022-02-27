const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/c_site');

router.get('/signup', sitesController.signUp);
router.get('/login', sitesController.logIn);
router.get('/logout', sitesController.logOut);
router.get('/search', sitesController.search);

router.post('/signup', sitesController.handleSignUp);
router.post('/login', sitesController.handleLogIn);
router.post('/send-email', sitesController.sendMail);

router.get('/', sitesController.getList);

module.exports = router;