// controllers/exerciseController.js

// Get all exercises for current user
exports.getExercises = async (req, res) => {
  try {
    const exercises = await req.prisma.exercise.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(exercises);
  } catch (err) {
    console.error('getExercises error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single exercise by ID
exports.getExerciseById = async (req, res) => {
  const { id } = req.params;
  try {
    const exercise = await req.prisma.exercise.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    console.error('getExerciseById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create exercise
exports.createExercise = async (req, res) => {
  const { name, muscleGroup, equipment } = req.body;
  if (!name || !muscleGroup || !equipment) {
    return res.status(400).json({ message: 'Name, muscle group, and equipment are required' });
  }

  try {
    const exercise = await req.prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        equipment,
        userId: req.userId,
      },
    });
    res.status(201).json(exercise);
  } catch (err) {
    console.error('createExercise error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update exercise
exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, muscleGroup, equipment } = req.body;

  try {
    const existing = await req.prisma.exercise.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const updated = await req.prisma.exercise.update({
      where: { id: Number(id) },
      data: {
        name: name || existing.name,
        muscleGroup: muscleGroup || existing.muscleGroup,
        equipment: equipment || existing.equipment,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('updateExercise error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await req.prisma.exercise.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    await req.prisma.exercise.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('deleteExercise error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
