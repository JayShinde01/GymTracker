// routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const workoutController = require('../controllers/workoutController');

router.use(authMiddleware);

// Workouts CRUD
router.get('/', workoutController.getWorkouts);
router.post('/', workoutController.createWorkout);
router.get('/:id', workoutController.getWorkoutById);
router.put('/:id', workoutController.updateWorkout);
router.delete('/:id', workoutController.deleteWorkout);

// Workout Exercises
router.post('/:workoutId/exercises', workoutController.addExerciseToWorkout);
router.delete('/:workoutId/exercises/:exerciseId', workoutController.removeExerciseFromWorkout);

module.exports = router;
