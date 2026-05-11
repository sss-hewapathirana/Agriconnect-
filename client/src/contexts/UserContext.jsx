import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getMyProfile, setTokenGetter } from '../utils/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Give API client access to Clerk token
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getMyProfile();
      setProfile(res.data.user);
      setError(null);
    } catch (err) {
      if (err?.response?.status === 404) {
        // User hasn't onboarded yet
        setProfile(null);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (clerkLoaded) fetchProfile();
  }, [clerkLoaded, fetchProfile]);

  const updateProfile = (data) => setProfile((prev) => ({ ...prev, ...data }));
  const clearProfile = () => setProfile(null);

  return (
    <UserContext.Provider value={{ profile, loading, error, fetchProfile, updateProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserProfile = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserProfile must be inside UserProvider');
  return ctx;
};
