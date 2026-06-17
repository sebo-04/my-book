const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
router.get('/categories', bookController.getCategories);
router.get('/latest', bookController.getLatestBooks);
router.get('/top-rated', bookController.getTopRatedBooks);
router.get('/search', bookController.searchBooks);
module.exports = router;