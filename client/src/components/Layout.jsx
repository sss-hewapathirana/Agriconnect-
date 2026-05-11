import { useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#0d1117] transition-colors duration-300">
      <Navbar />
      <main className={isDashboard && isSignedIn ? 'page-with-nav' : ''}>
        {children}
      </main>
      {isDashboard && isSignedIn && <BottomNav />}
    </div>
  );
}
