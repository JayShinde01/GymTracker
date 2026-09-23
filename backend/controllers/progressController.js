// controllers/progressController.js

exports.getProgress = async (req, res) => {
  const { exerciseId } = req.params;

  try {
    // 1. Ensure exercise belongs to current user
    const exercise = await req.prisma.exercise.findFirst({
      where: { id: Number(exerciseId), userId: req.userId },
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // 2. Fetch all workout exercises for this exercise belonging to the user, with dates
    const workoutExercises = await req.prisma.workoutExercise.findMany({
      where: {
        exerciseId: Number(exerciseId),
        workout: { userId: req.userId },
      },
      include: {
        workout: true,
        sets: true,
      },
      orderBy: {
        workout: { date: 'asc' },
      },
    });

    if (workoutExercises.length === 0) {
      return res.json({
        exerciseName: exercise.name,
        hasData: false,
        message: 'No workout history found for this exercise.',
      });
    }

    // Group by session (workout)
    const sessions = workoutExercises.map((we) => ({
      workoutId: we.workout.id,
      workoutName: we.workout.name,
      date: we.workout.date,
      sets: we.sets,
      maxWeight: we.sets.reduce((max, s) => Math.max(max, s.weight), 0),
      totalVolume: we.sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
    }));

    const currentSession = sessions[sessions.length - 1];
    const previousSession = sessions.length > 1 ? sessions[sessions.length - 2] : null;

    // Find Best Weight & Best Reps ever
    let bestWeight = 0;
    let bestReps = 0;
    let estimated1RM = 0;

    sessions.forEach((session) => {
      session.sets.forEach((set) => {
        if (set.weight > bestWeight) bestWeight = set.weight;
        if (set.reps > bestReps) bestReps = set.reps;
        
        // 1RM Formula: Weight * (1 + Reps / 30)
        const e1RM = set.weight * (1 + set.reps / 30);
        if (e1RM > estimated1RM) estimated1RM = e1RM;
      });
    });

    // Comparison logic (current vs previous)
    let trend = 'No previous data';
    let trendSymbol = '→';

    if (previousSession) {
      if (currentSession.maxWeight > previousSession.maxWeight || currentSession.totalVolume > previousSession.totalVolume) {
        trend = 'Improved';
        trendSymbol = '↑';
      } else if (currentSession.maxWeight === previousSession.maxWeight && currentSession.totalVolume === previousSession.totalVolume) {
        trend = 'Maintained';
        trendSymbol = '→';
      } else {
        trend = 'Decreased';
        trendSymbol = '↓';
      }
    }

    res.json({
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      hasData: true,
      previousSession: previousSession
        ? {
            name: previousSession.workoutName,
            date: previousSession.date,
            sets: previousSession.sets,
            maxWeight: previousSession.maxWeight,
            totalVolume: previousSession.totalVolume,
          }
        : null,
      currentSession: {
        name: currentSession.workoutName,
        date: currentSession.date,
        sets: currentSession.sets,
        maxWeight: currentSession.maxWeight,
        totalVolume: currentSession.totalVolume,
      },
      bestWeight,
      bestReps,
      estimated1RM: Number(estimated1RM.toFixed(2)),
      trend,
      trendSymbol,
    });
  } catch (err) {
    console.error('getProgress error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
