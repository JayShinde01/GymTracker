// services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to handle fetch API requests with JWT token
async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error occurred' };
    }

    return data;
  } catch (err) {
    console.error('API Request Error:', err);
    return { error: 'Network error. Please check backend connection.' };
  }
}

const api = {
  // Auth APIs
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  // Exercise APIs
  getExercises: () => request('/exercises'),
  getExerciseById: (id) => request(`/exercises/${id}`),
  createExercise: (name, muscleGroup, equipment) =>
    request('/exercises', {
      method: 'POST',
      body: JSON.stringify({ name, muscleGroup, equipment }),
    }),
  updateExercise: (id, name, muscleGroup, equipment) =>
    request(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, muscleGroup, equipment }),
    }),
  deleteExercise: (id) =>
    request(`/exercises/${id}`, {
      method: 'DELETE',
    }),

  // Workout APIs
  getWorkouts: () => request('/workouts'),
  getWorkoutById: (id) => request(`/workouts/${id}`),
  createWorkout: (name, date) =>
    request('/workouts', {
      method: 'POST',
      body: JSON.stringify({ name, date }),
    }),
  updateWorkout: (id, name, date) =>
    request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, date }),
    }),
  deleteWorkout: (id) =>
    request(`/workouts/${id}`, {
      method: 'DELETE',
    }),

  addExerciseToWorkout: (workoutId, exerciseId) =>
    request(`/workouts/${workoutId}/exercises`, {
      method: 'POST',
      body: JSON.stringify({ exerciseId }),
    }),
  removeExerciseFromWorkout: (workoutId, exerciseId) =>
    request(`/workouts/${workoutId}/exercises/${exerciseId}`, {
      method: 'DELETE',
    }),

  // Sets APIs
  addSet: (workoutExerciseId, weight, reps) =>
    request(`/workout-exercises/${workoutExerciseId}/sets`, {
      method: 'POST',
      body: JSON.stringify({ weight, reps }),
    }),
  updateSet: (setId, weight, reps) =>
    request(`/sets/${setId}`, {
      method: 'PUT',
      body: JSON.stringify({ weight, reps }),
    }),
  deleteSet: (setId) =>
    request(`/sets/${setId}`, {
      method: 'DELETE',
    }),

  // Dashboard API
  getDashboardStats: () => request('/dashboard'),

  // Progress API
  getProgress: (exerciseId) => request(`/progress/${exerciseId}`),
};

export default api;
