import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, User, Settings } from 'lucide-react';

const tabs = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Orders', icon: Package, path: '/dashboard/orders' },
  { label: 'Profile', icon: User, path: '/dashboard/profile' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {tabs.map(({ label, icon: Icon, path }) => {
        const active =
          path === '/dashboard'
            ? location.pathname === path
            : location.pathname.startsWith(path);

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              active
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
              strokeWidth={active ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">{label}</span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-green-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
