const express = require('express');
const router = express.Router();
const sidebarController = require('../controllers/sidebarController');
router.get('/user-role', sidebarController.getUserRole);
module.exports = router;