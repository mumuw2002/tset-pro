//server\routes\indexRoutes.js
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.homepage);


module.exports = router;
