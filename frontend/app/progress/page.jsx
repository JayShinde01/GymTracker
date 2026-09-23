'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function Progress() {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadExercises = async () => {
      const res = await api.getExercises();
      if (res.error) {
        if (res.error === 'Access token missing' || res.error === 'Invalid token') {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        setError(res.error);
      } else {
        setExercises(res);
        if (res.length > 0) {
          setSelectedExerciseId(res[0].id.toString());
        }
      }
      setLoading(false);
    };

    loadExercises();
  }, [router]);

  useEffect(() => {
    if (!selectedExerciseId) return;

    const fetchProgress = async () => {
      setLoadingProgress(true);
      const res = await api.getProgress(selectedExerciseId);
      if (res.error) {
        setError(res.error);
      } else {
        setProgressData(res);
      }
      setLoadingProgress(false);
    };

    fetchProgress();
  }, [selectedExerciseId]);

  if (loading) return <Loading message="Loading exercises..." />;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1>Progress Tracking 📈</h1>
        <p style={{ color: '#94a3b8' }}>Analyze your strength trends and 1-Rep Max for each exercise.</p>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Exercise</label>
          <select
            className="form-control"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
          >
            {exercises.length === 0 ? (
              <option value="">No exercises created yet</option>
            ) : (
              exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.muscleGroup} • {ex.equipment})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {loadingProgress ? (
        <Loading message="Calculating progress..." />
      ) : !progressData || !progressData.hasData ? (
        <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
          No workout history found for this exercise. Log a workout containing this exercise to view progress.
        </div>
      ) : (
        <div>
          <div className="grid" style={{ marginBottom: '32px' }}>
            <div className="card stat-card">
              <span className="stat-title">Best Weight Ever</span>
              <span className="stat-value">{progressData.bestWeight} kg</span>
            </div>
            <div className="card stat-card">
              <span className="stat-title">Best Reps Ever</span>
              <span className="stat-value">{progressData.bestReps} reps</span>
            </div>
            <div className="card stat-card">
              <span className="stat-title">Estimated 1RM</span>
              <span className="stat-value">{progressData.estimated1RM} kg</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Formula: Weight × (1 + Reps / 30)</span>
            </div>
            <div className="card stat-card">
              <span className="stat-title">Performance Trend</span>
              <span
                className="stat-value"
                style={{
                  color:
                    progressData.trend === 'Improved'
                      ? '#10b981'
                      : progressData.trend === 'Decreased'
                      ? '#ef4444'
                      : '#f59e0b',
                }}
              >
                {progressData.trendSymbol} {progressData.trend}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="card">
              <h3>Previous Session</h3>
              {progressData.previousSession ? (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontWeight: '600' }}>{progressData.previousSession.name}</p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
                    📅 {new Date(progressData.previousSession.date).toLocaleDateString()}
                  </p>
                  <p>Max Weight: {progressData.previousSession.maxWeight} kg</p>
                  <p>Total Volume: {progressData.previousSession.totalVolume} kg</p>
                  <div style={{ marginTop: '12px' }}>
                    <strong>Sets:</strong>
                    <ul>
                      {progressData.previousSession.sets.map((s, idx) => (
                        <li key={idx} style={{ color: '#94a3b8' }}>
                          Set {idx + 1}: {s.weight}kg × {s.reps}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', marginTop: '12px' }}>No previous session recorded.</p>
              )}
            </div>

            <div className="card" style={{ borderColor: '#10b981' }}>
              <h3>Current Session</h3>
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontWeight: '600' }}>{progressData.currentSession.name}</p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
                  📅 {new Date(progressData.currentSession.date).toLocaleDateString()}
                </p>
                <p>Max Weight: {progressData.currentSession.maxWeight} kg</p>
                <p>Total Volume: {progressData.currentSession.totalVolume} kg</p>
                <div style={{ marginTop: '12px' }}>
                  <strong>Sets:</strong>
                  <ul>
                    {progressData.currentSession.sets.map((s, idx) => (
                      <li key={idx} style={{ color: '#94a3b8' }}>
                        Set {idx + 1}: {s.weight}kg × {s.reps}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
