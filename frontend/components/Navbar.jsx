'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <Link href={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        🏋️ Gym Tracker
      </Link>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li>
              <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/exercises" className={pathname === '/exercises' ? 'active' : ''}>
                Exercises
              </Link>
            </li>
            <li>
              <Link href="/workouts" className={pathname.startsWith('/workouts') ? 'active' : ''}>
                Workouts
              </Link>
            </li>
            <li>
              <Link href="/progress" className={pathname === '/progress' ? 'active' : ''}>
                Progress
              </Link>
            </li>
            <li>
              <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}>
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="btn btn-sm">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
