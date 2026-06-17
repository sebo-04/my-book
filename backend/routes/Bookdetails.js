const express = require('express');
const router = express.Router();
const bookDetailsController = require('../controllers/BookdetailsController');
router.get('/:id', bookDetailsController.getBookDetails);
router.post('/:id/review', bookDetailsController.addReview);
router.post('/:id/reserve', bookDetailsController.reserveCopy);
module.exports = router;