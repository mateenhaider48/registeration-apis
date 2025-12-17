const { product, updateProduct ,delProduct, readProduct} = require("../controllers/product.controller");

const express = require('express');

const router = express.Router();

router.post('/add-product',product);
router.post('/update-product',updateProduct);
router.delete('/delete-product',delProduct);
router.get('/read-product',readProduct);

module.exports = router;