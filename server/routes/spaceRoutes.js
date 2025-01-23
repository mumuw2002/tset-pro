//server\routes\spaceRoutes.js
const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');

router.get('/space', spaceController.SpaceDashboard);

module.exports = router;
