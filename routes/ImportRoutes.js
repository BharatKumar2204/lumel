const express = require('express');
const router = express.Router();

const {importCSV}=require('../controllers/ImportCSV');

router.get('/import-data', importCSV);


module.exports = router;