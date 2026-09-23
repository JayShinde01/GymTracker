'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import ExerciseForm from '../../components/ExerciseForm';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExercises();
  }, [router]);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    let res;
    if (editingExercise) {
      res = await api.updateExercise(editingExercise.id, formData.name, formData.muscleGroup, formData.equipment);
    } else {
      res = await api.createExercise(formData.name, formData.muscleGroup, formData.equipment);
    }
    setSubmitting(false);

    if (res.error) {
      alert(res.error);
    } else {
      setShowForm(false);
      setEditingExercise(null);
      loadExercises();
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await api.deleteExercise(id);
      if (res.error) {
        alert(res.error);
      } else {
        loadExercises();
      }
    }
  };

  if (loading) return <Loading message="Loading exercises..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Exercise Management 🏋️‍♂️</h1>
          <p style={{ color: '#94a3b8' }}>Create and organize your workout movements.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingExercise(null);
              setShowForm(true);
            }}
            className="btn"
          >
            + Add Exercise
          </button>
        )}
      </div>

      {showForm && (
        <ExerciseForm
          initialData={editingExercise}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingExercise(null);
          }}
          isSubmitting={submitting}
        />
      )}

      {error && <div className="card" style={{ color: '#ef4444' }}>{error}</div>}

      {exercises.length === 0 && !showForm ? (
        <EmptyState
          message="No exercises created yet. Create your first exercise to start tracking."
          actionText="+ Add Exercise"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid">
          {exercises.map((ex) => (
            <div key={ex.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{ex.name}</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span className="badge">💪 {ex.muscleGroup}</span>
                  <span className="badge" style={{ background: '#1e293b', color: '#94a3b8' }}>
                    🏋️ {ex.equipment}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={() => {
                    setEditingExercise(ex);
                    setShowForm(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ex.id, ex.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
