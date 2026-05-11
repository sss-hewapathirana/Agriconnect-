import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Bell, Shield, Keyboard, LogOut, ChevronRight } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

function SettingsItem({ icon: Icon, label, description, children, onClick }) {
  return (
    <div 
      className={`p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-all cursor-pointer group first:rounded-t-2xl last:rounded-b-2xl`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-surface-2 flex items-center justify-center text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        </div>
      </div>
      {children || <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />}
    </div>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { signOut } = useClerk();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Personalize your Agriconnect experience.</p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferences</h3>
          <div className="card shadow-sm divide-y divide-gray-100 dark:divide-dark-border overflow-hidden">
            <SettingsItem 
              icon={isDark ? Moon : Sun} 
              label="Appearance" 
              description={isDark ? "Currently in Dark Mode" : "Currently in Light Mode"}
              onClick={toggleTheme}
            >
              <div 
                className={`w-14 h-8 rounded-full relative transition-colors ${isDark ? 'bg-emerald-600' : 'bg-gray-200'}`}
              >
                <div 
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isDark ? 'left-7' : 'left-1'}`}
                />
              </div>
            </SettingsItem>
            <SettingsItem 
              icon={Bell} 
              label="Notifications" 
              description="Email and Push notifications" 
            />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Account</h3>
          <div className="card shadow-sm divide-y divide-gray-100 dark:divide-dark-border overflow-hidden">
            <SettingsItem 
              icon={Shield} 
              label="Privacy & Security" 
              description="Password and authentication" 
            />
            <SettingsItem 
              icon={Keyboard} 
              label="Language" 
              description="English (United States)" 
            />
          </div>
        </section>

        <section>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 p-6 text-red-500 font-bold card hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border-red-100 dark:border-red-900/20 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p>Sign Out</p>
              <p className="text-xs text-red-400 font-medium">Log out from your account</p>
            </div>
          </button>
        </section>

        <div className="text-center pt-8">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Agriconnect v1.0.0</p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">Made with ❤️ for farmers & wholesalers</p>
        </div>
      </div>
    </div>
  );
}
