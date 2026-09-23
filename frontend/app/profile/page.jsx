'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.getMe();
      if (res.error) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setUser(res);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div className="card" style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <div className="card">
        <div style={{ textIndent: 0, textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👤</div>
          <h2>{user.name}</h2>
          <p style={{ color: '#94a3b8' }}>{user.email}</p>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8' }}>User ID:</span>
            <span>#{user.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#94a3b8' }}>Member Since:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
