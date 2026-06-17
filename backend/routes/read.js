const express = require('express');
const router = express.Router();
const readController = require('../controllers/readController');
router.get('/book-info/:id', readController.getBookDetailsForReading);
router.get('/book-page/:id', readController.getBookPageFile);
router.post('/reserve-copy/:id', readController.reserveBookCopy);
module.exports = router;