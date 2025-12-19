
const express = require('express');
const { addProduct, updateProduct ,delProduct, readProduct} = require("../controllers/product.controller");

const {authCheck, authorized } = require('../middleware/authCheck')

const router = express.Router();

router.post('/add-product',authCheck,authorized(["admin","user"]),addProduct);
router.post('/update-product',authCheck,updateProduct);
router.delete('/delete-product',authCheck,delProduct);
router.get('/read-product',authCheck,readProduct);

module.exports = router;