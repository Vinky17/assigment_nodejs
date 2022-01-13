const express = require('express');
const router = express.Router();
const productsController = require('../controllers/c_product')

router.get('/:slug&:id', productsController.detail);
router.get('/:id', productsController.viewList);
router.get('/', productsController.list);

module.exports = router;