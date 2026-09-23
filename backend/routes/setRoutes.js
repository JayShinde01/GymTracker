// routes/setRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const workoutController = require('../controllers/workoutController');

router.use(authMiddleware);

router.post('/workout-exercises/:workoutExerciseId/sets', workoutController.addSet);
router.put('/sets/:id', workoutController.updateSet);
router.delete('/sets/:id', workoutController.deleteSet);

module.exports = router;
