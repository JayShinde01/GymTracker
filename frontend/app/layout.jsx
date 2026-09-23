import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Gym Tracker - Track Workouts & Progress',
  description: 'Beginner-friendly full-stack Gym Tracker application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
