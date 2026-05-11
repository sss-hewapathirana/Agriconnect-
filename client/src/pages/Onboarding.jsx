import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { onboardUser } from '../utils/api';
import { useUserProfile } from '../contexts/UserContext';
import { Sprout, ShoppingCart, MapPin, Phone, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const roles = [
  {
    id: 'farmer',
    icon: Sprout,
    title: 'Farmer',
    subtitle: 'I grow & supply produce',
    description: 'List your products, receive orders from sellers, and grow your farm business.',
    color: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    activeRing: 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-[#161b22]',
  },
  {
    id: 'seller',
    icon: ShoppingCart,
    title: 'Seller',
    subtitle: 'I source & buy produce',
    description: 'Find verified farmers, place orders, and streamline your agricultural supply chain.',
    color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    activeRing: 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#161b22]',
  },
];

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { fetchProfile } = useUserProfile();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ name: user?.fullName || '', phone: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (!form.name || !form.phone || !form.location) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onboardUser({
        clerkId: user.id,
        name: form.name,
        role: selectedRole,
        phone: form.phone,
        location: form.location,
      });
      await fetchProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-green-500 w-12' : 'bg-gray-200 dark:bg-gray-700 w-8'
              }`}
            />
          ))}
        </div>

        {/* ── Step 1: Role Selection ── */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Welcome to Agriconnect! 🌱
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Tell us who you are so we can personalize your experience.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {roles.map(({ id, icon: Icon, title, subtitle, description, color, iconColor, iconBg, activeRing }) => (
                <button
                  key={id}
                  onClick={() => setSelectedRole(id)}
                  className={`w-full text-left card p-5 flex items-start gap-4 transition-all duration-200 ${
                    selectedRole === id ? `${color} ${activeRing}` : 'hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-gray-900 dark:text-white">{title}</span>
                      {selectedRole === id && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{subtitle}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedRole && setStep(2)}
              disabled={!selectedRole}
              className="btn-primary w-full py-3 text-base"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step 2: Profile Details ── */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                selectedRole === 'farmer'
                  ? 'bg-green-100 dark:bg-green-900/40'
                  : 'bg-purple-100 dark:bg-purple-900/40'
              }`}>
                {selectedRole === 'farmer'
                  ? <Sprout className="w-7 h-7 text-green-600 dark:text-green-400" />
                  : <ShoppingCart className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                }
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Set up your profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Joining as a <span className="font-semibold capitalize text-gray-700 dark:text-gray-200">{selectedRole}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kamal Perera"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0771234567"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Matara, Sri Lanka"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Setting up...
                    </span>
                  ) : (
                    <>Complete Setup <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
