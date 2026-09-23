// tests/streak.test.js
const { calculateStreak } = require('../utils/streak');

describe('calculateStreak Utility', () => {
  test('returns 0 for empty dates array', () => {
    const result = calculateStreak([]);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  test('calculates correct streak for consecutive days', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(today.getDate() - 2);

    const dates = [dayBefore, yesterday, today];
    const result = calculateStreak(dates);

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  test('counts multiple workouts on the same day as 1 day', () => {
    const today = new Date();
    const todaySecondWorkout = new Date();

    const dates = [today, todaySecondWorkout];
    const result = calculateStreak(dates);

    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  test('handles broken streaks', () => {
    const day1 = new Date('2026-09-01');
    const day2 = new Date('2026-09-02');
    const day5 = new Date('2026-09-05'); // Gap of 3 days

    const dates = [day1, day2, day5];
    const result = calculateStreak(dates);

    // Since day5 is not today or yesterday relative to current time, current streak is 0
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(2);
  });
});
