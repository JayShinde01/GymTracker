// controllers/workoutController.js

// Get all workouts for user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await req.prisma.workout.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });
    res.json(workouts);
  } catch (err) {
    console.error('getWorkouts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new workout
exports.createWorkout = async (req, res) => {
  const { name, date } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Workout name is required' });
  }

  try {
    const workoutDate = date ? new Date(date) : new Date();
    const workout = await req.prisma.workout.create({
      data: {
        name,
        date: workoutDate,
        userId: req.userId,
      },
    });
    res.status(201).json(workout);
  } catch (err) {
    console.error('createWorkout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single workout details
exports.getWorkoutById = async (req, res) => {
  const { id } = req.params;
  try {
    const workout = await req.prisma.workout.findFirst({
      where: { id: Number(id), userId: req.userId },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (err) {
    console.error('getWorkoutById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update workout details
exports.updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, date } = req.body;

  try {
    const existing = await req.prisma.workout.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const updated = await req.prisma.workout.update({
      where: { id: Number(id) },
      data: {
        name: name || existing.name,
        date: date ? new Date(date) : existing.date,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('updateWorkout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await req.prisma.workout.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Cascade delete sets and workoutExercises
    const workoutExercises = await req.prisma.workoutExercise.findMany({
      where: { workoutId: Number(id) },
    });
    const weIds = workoutExercises.map((we) => we.id);

    if (weIds.length > 0) {
      await req.prisma.workoutSet.deleteMany({
        where: { workoutExerciseId: { in: weIds } },
      });
      await req.prisma.workoutExercise.deleteMany({
        where: { workoutId: Number(id) },
      });
    }

    await req.prisma.workout.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error('deleteWorkout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- WORKOUT EXERCISES ---

// Add exercise to workout
exports.addExerciseToWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { exerciseId } = req.body;

  if (!exerciseId) {
    return res.status(400).json({ message: 'exerciseId is required' });
  }

  try {
    // Check workout ownership
    const workout = await req.prisma.workout.findFirst({
      where: { id: Number(workoutId), userId: req.userId },
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check exercise ownership
    const exercise = await req.prisma.exercise.findFirst({
      where: { id: Number(exerciseId), userId: req.userId },
    });
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const workoutExercise = await req.prisma.workoutExercise.create({
      data: {
        workoutId: Number(workoutId),
        exerciseId: Number(exerciseId),
      },
      include: {
        exercise: true,
        sets: true,
      },
    });

    res.status(201).json(workoutExercise);
  } catch (err) {
    console.error('addExerciseToWorkout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove exercise from workout
exports.removeExerciseFromWorkout = async (req, res) => {
  const { workoutId, exerciseId } = req.params;

  try {
    const workout = await req.prisma.workout.findFirst({
      where: { id: Number(workoutId), userId: req.userId },
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Find workoutExercise by workoutId & exerciseId or by workoutExerciseId
    const we = await req.prisma.workoutExercise.findFirst({
      where: {
        workoutId: Number(workoutId),
        OR: [
          { exerciseId: Number(exerciseId) },
          { id: Number(exerciseId) },
        ],
      },
    });

    if (!we) {
      return res.status(404).json({ message: 'Workout exercise relation not found' });
    }

    // Delete sets first
    await req.prisma.workoutSet.deleteMany({
      where: { workoutExerciseId: we.id },
    });

    await req.prisma.workoutExercise.delete({
      where: { id: we.id },
    });

    res.json({ message: 'Exercise removed from workout' });
  } catch (err) {
    console.error('removeExerciseFromWorkout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- SETS ---

// Add a set to a WorkoutExercise
exports.addSet = async (req, res) => {
  const { workoutExerciseId } = req.params;
  const { weight, reps } = req.body;

  if (weight === undefined || reps === undefined) {
    return res.status(400).json({ message: 'Weight and reps are required' });
  }

  try {
    const we = await req.prisma.workoutExercise.findFirst({
      where: { id: Number(workoutExerciseId) },
      include: { workout: true },
    });

    if (!we || we.workout.userId !== req.userId) {
      return res.status(404).json({ message: 'Workout exercise not found' });
    }

    const set = await req.prisma.workoutSet.create({
      data: {
        workoutExerciseId: Number(workoutExerciseId),
        weight: Number(weight),
        reps: Number(reps),
      },
    });

    res.status(201).json(set);
  } catch (err) {
    console.error('addSet error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a set
exports.updateSet = async (req, res) => {
  const { id } = req.params;
  const { weight, reps } = req.body;

  try {
    const set = await req.prisma.workoutSet.findFirst({
      where: { id: Number(id) },
      include: {
        workoutExercise: {
          include: { workout: true },
        },
      },
    });

    if (!set || set.workoutExercise.workout.userId !== req.userId) {
      return res.status(404).json({ message: 'Set not found' });
    }

    const updated = await req.prisma.workoutSet.update({
      where: { id: Number(id) },
      data: {
        weight: weight !== undefined ? Number(weight) : set.weight,
        reps: reps !== undefined ? Number(reps) : set.reps,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('updateSet error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a set
exports.deleteSet = async (req, res) => {
  const { id } = req.params;

  try {
    const set = await req.prisma.workoutSet.findFirst({
      where: { id: Number(id) },
      include: {
        workoutExercise: {
          include: { workout: true },
        },
      },
    });

    if (!set || set.workoutExercise.workout.userId !== req.userId) {
      return res.status(404).json({ message: 'Set not found' });
    }

    await req.prisma.workoutSet.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Set deleted successfully' });
  } catch (err) {
    console.error('deleteSet error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
