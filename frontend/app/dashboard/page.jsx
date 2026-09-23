'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      const statsRes = await api.getDashboardStats();
      const workoutsRes = await api.getWorkouts();

      if (statsRes.error || workoutsRes.error) {
        if (statsRes.error === 'Access token missing' || statsRes.error === 'Invalid token') {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        setError(statsRes.error || workoutsRes.error);
      } else {
        setStats(statsRes);
        setWorkouts(workoutsRes.slice(0, 5));
      }
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <div className="card" style={{ color: '#ef4444' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1>Dashboard 👋</h1>
        <p style={{ color: '#94a3b8' }}>Keep showing up and build your consistency.</p>
      </div>

      <div className="grid">
        <StatCard title="Total Workouts" value={stats.totalWorkouts} icon="🏋️" />
        <StatCard title="Exercises Performed" value={stats.totalExercisesPerformed} icon="💪" />
        <StatCard title="Total Volume" value={stats.totalVolume.toLocaleString()} unit="kg" icon="📦" />
        <StatCard title="Workouts This Week" value={stats.workoutsThisWeek} icon="📅" />
        <StatCard title="Current Streak" value={stats.currentStreak} unit="Days" icon="🔥" />
        <StatCard title="Longest Streak" value={stats.longestStreak} unit="Days" icon="🏆" />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Recent Workouts</h2>
          <Link href="/workouts" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
            No workouts logged yet.{' '}
            <Link href="/workouts" style={{ color: '#10b981' }}>
              Log your first workout!
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workouts.map((w) => (
              <div key={w.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{w.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    📅 {new Date(w.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <Link href={`/workouts/${w.id}`} className="btn btn-secondary btn-sm">
                  Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
