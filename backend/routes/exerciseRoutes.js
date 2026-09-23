// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const exerciseController = require('../controllers/exerciseController');

router.use(authMiddleware);

router.get('/', exerciseController.getExercises);
router.post('/', exerciseController.createExercise);
router.get('/:id', exerciseController.getExerciseById);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;
