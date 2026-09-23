// controllers/dashboardController.js
const { calculateStreak } = require('../utils/streak');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Total Workouts
    const totalWorkouts = await req.prisma.workout.count({
      where: { userId },
    });

    // 2. Total Exercises Performed (count of unique exercise instances in workouts)
    const totalExercisesPerformed = await req.prisma.workoutExercise.count({
      where: { workout: { userId } },
    });

    // 3. Total Volume = Sum of (weight * reps) for all sets belonging to user
    const userSets = await req.prisma.workoutSet.findMany({
      where: {
        workoutExercise: {
          workout: { userId },
        },
      },
      select: { weight: true, reps: true },
    });

    const totalVolume = userSets.reduce(
      (sum, set) => sum + set.weight * set.reps,
      0
    );

    // 4. Workouts This Week (starting from Sunday of current week)
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0 is Sunday
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = await req.prisma.workout.count({
      where: {
        userId,
        date: { gte: startOfWeek },
      },
    });

    // 5. Streaks
    const userWorkouts = await req.prisma.workout.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'asc' },
    });

    const workoutDates = userWorkouts.map((w) => w.date);
    const { currentStreak, longestStreak } = calculateStreak(workoutDates);

    res.json({
      totalWorkouts,
      totalExercisesPerformed,
      totalVolume,
      workoutsThisWeek,
      currentStreak,
      longestStreak,
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
