//server\routes\spaceRoutes.js
const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated'); // นำเข้า middleware

router.get('/space', ensureAuthenticated, spaceController.SpaceDashboard);

module.exports = router;
