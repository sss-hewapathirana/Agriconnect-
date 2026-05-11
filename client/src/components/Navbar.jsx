import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserContext';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, Sprout } from 'lucide-react';

const roleColors = {
  farmer: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  seller: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
};

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useUserProfile();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isLanding
          ? 'bg-transparent'
          : 'bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border'
      } h-16`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button
            onClick={() => navigate(isSignedIn ? '/dashboard' : '/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-custom flex items-center justify-center shadow-lg shadow-emerald-custom/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col -gap-1">
              <span
                className={`font-display font-extrabold text-lg tracking-tight leading-none ${
                  isLanding ? 'text-white' : 'text-emerald-900 dark:text-emerald-500'
                }`}
              >
                AGRICONNECT
              </span>
              {profile?.role && (
                <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-600/70 dark:text-emerald-400/70 uppercase">
                  {profile.role}
                </span>
              )}
            </div>
          </button>

          {/* Desktop Nav */}
          {isSignedIn && profile && (
            <nav className="hidden md:flex items-center gap-6">
              {[
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Orders', path: '/dashboard/orders' },
                { name: 'Profile', path: `/dashboard/profile` },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isLanding
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface-2 border border-transparent hover:border-gray-100 dark:hover:border-dark-border'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isSignedIn && (
            <>
              {/* Notifications */}
              <button
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                  isLanding
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface-2 border border-transparent hover:border-gray-100 dark:hover:border-dark-border'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-dark-bg" />
              </button>

              {/* User Button */}
              <div className="pl-2 border-l border-gray-100 dark:border-dark-border">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 rounded-xl border-2 border-emerald-500/10',
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
