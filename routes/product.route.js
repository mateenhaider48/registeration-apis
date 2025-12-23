
const express = require('express');
const { addProduct, updateProduct ,delProduct, readProduct} = require("../controllers/product.controller");

const {authCheck, authorized } = require('../middleware/authCheck')

const router = express.Router();

router.post('/add-product',authCheck,authorized("admin"),addProduct);
router.post('/update-product',authCheck,authorized("admin"),updateProduct);
router.delete('/delete-product',authCheck,authorized("admin"),delProduct);
router.get('/read-product',authCheck,authorized("admin","user"),readProduct);

module.exports = router;