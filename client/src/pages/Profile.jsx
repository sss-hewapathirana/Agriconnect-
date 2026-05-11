import { useState } from 'react';
import { useUserProfile } from '../contexts/UserContext';
import { updateMyProfile } from '../utils/api';
import { User, Mail, MapPin, Phone, Camera, Save, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { profile, updateProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    location: profile?.location || '',
    phone: profile?.phone || '',
    bio: profile?.bio || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile(form);
      updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and public profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Role */}
        <div className="lg:col-span-1">
          <div className="card p-8 text-center sticky top-24">
            <div className="relative inline-block mb-6 group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 overflow-hidden flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-emerald-300" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-custom text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-white dark:border-dark-surface">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-display text-xl font-extrabold text-gray-900 dark:text-white mb-1">{profile?.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              {profile?.role}
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-gray-300" />
                {profile?.location || 'Not set'}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-gray-300" />
                {profile?.phone || 'Not set'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Nuwara Eliya, Central Province"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Bio / Description</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Tell others about yourself or your farm..."
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 h-12 min-w-[160px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
                {success && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-fade-in">
                    <CheckCircle2 className="w-5 h-5" /> Profile updated!
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
