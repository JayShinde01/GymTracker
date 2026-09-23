// utils/streak.js

/**
 * Calculates current streak and longest streak from an array of workout Date objects or ISO strings.
 * Rules:
 * 1. Multiple workouts on the same date count as ONE day.
 * 2. Consecutive workout dates increase the streak.
 * 3. Missing dates break the streak.
 * 
 * @param {Array<Date|string>} workoutDates - List of workout dates from DB
 * @returns {Object} { currentStreak: number, longestStreak: number }
 */
function calculateStreak(workoutDates) {
  if (!workoutDates || workoutDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Extract unique YYYY-MM-DD date strings sorted in ascending order
  const uniqueDateStrings = Array.from(
    new Set(
      workoutDates.map((d) => {
        const dateObj = new Date(d);
        return dateObj.toISOString().split('T')[0];
      })
    )
  ).sort();

  if (uniqueDateStrings.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert date strings to timestamps at midnight UTC for day difference calculations
  const timestamps = uniqueDateStrings.map((dateStr) => new Date(dateStr).getTime());
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < timestamps.length; i++) {
    const diffDays = Math.round((timestamps[i] - timestamps[i - 1]) / ONE_DAY_MS);
    if (diffDays === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Calculate current streak ending today or yesterday
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

  const lastWorkoutStr = uniqueDateStrings[uniqueDateStrings.length - 1];

  // If the last workout was not today or yesterday, current streak is 0
  if (lastWorkoutStr !== todayStr && lastWorkoutStr !== yesterdayStr) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = uniqueDateStrings.length - 1; i > 0; i--) {
      const tCurrent = new Date(uniqueDateStrings[i]).getTime();
      const tPrev = new Date(uniqueDateStrings[i - 1]).getTime();
      const diffDays = Math.round((tCurrent - tPrev) / ONE_DAY_MS);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

module.exports = { calculateStreak };
