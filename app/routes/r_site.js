const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/c_site');

router.get('/', sitesController.getList)

module.exports = router;