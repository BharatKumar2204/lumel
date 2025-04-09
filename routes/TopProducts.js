const express = require('express');
const router = express.Router();

const {topProducts}=require('../controllers/TopProducts');

router.get('/top-products', topProducts);


module.exports = router;