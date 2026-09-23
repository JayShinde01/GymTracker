'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ textIndent: 0, textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '3rem', color: '#10b981', marginBottom: '16px' }}>🏋️ Gym Tracker</h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px auto' }}>
        Track workouts. Build consistency. See your progress.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link href="/register" className="btn" style={{ padding: '12px 28px', fontSize: '1.1rem' }}>
          Get Started
        </Link>
        <Link href="/login" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '1.1rem' }}>
          Login
        </Link>
      </div>

      <div className="grid" style={{ marginTop: '60px', textAlign: 'left' }}>
        <div className="card">
          <h3>⚡ Easy Workout Logging</h3>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Log your exercises, sets, weight, and reps cleanly with zero hassle.
          </p>
        </div>
        <div className="card">
          <h3>🔥 Consistency & Streaks</h3>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Build habits with automatic streak calculations based on your workout history.
          </p>
        </div>
        <div className="card">
          <h3>📈 Progress & 1RM</h3>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Track volume trends, best lifts, and estimated 1-Rep Max calculations.
          </p>
        </div>
      </div>
    </div>
  );
}
