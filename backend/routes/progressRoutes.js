// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const progressController = require('../controllers/progressController');

router.use(authMiddleware);

router.get('/:exerciseId', progressController.getProgress);

module.exports = router;
