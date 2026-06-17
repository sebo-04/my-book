const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.get('/books', libraryController.getAllBooks);
router.post('/books', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), libraryController.createBook);
router.put('/books/:id', libraryController.updateBook);
router.delete('/books/:id', libraryController.deleteBook);
router.get('/categories', libraryController.getAllCategories);
router.post('/categories', libraryController.createCategory);
router.delete('/categories/bulk', libraryController.deleteCategories);
router.get('/copies', libraryController.getCopiesByBook);
router.post('/copies', libraryController.createCopy);
router.put('/copies/:id', libraryController.updateCopy);
router.delete('/copies/:id', libraryController.deleteCopy);
module.exports = router;