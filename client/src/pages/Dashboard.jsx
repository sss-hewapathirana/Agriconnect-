import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserContext';
import FarmerDashboard from './farmer/FarmerDashboard';
import FarmerProducts from './farmer/FarmerProducts';
import FarmerOrders from './farmer/FarmerOrders';
import SellerDashboard from './seller/SellerDashboard';
import SellerOrders from './seller/SellerOrders';
import FarmerProfileView from './seller/FarmerProfileView';
import PlaceOrder from './seller/PlaceOrder';
import Profile from './Profile';
import Settings from './Settings';

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-green-200 dark:border-green-900 border-t-green-600 rounded-full animate-spin" />
      <p className="text-gray-400 dark:text-gray-500 text-sm">Loading your dashboard...</p>
    </div>
  );
}

export default function Dashboard() {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile === null) {
      navigate('/onboarding', { replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading) return <LoadingScreen />;
  if (!profile) return null;

  const isFarmer = profile.role === 'farmer';

  return (
    <Routes>
      {/* Shared */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />

      {/* Farmer routes */}
      {isFarmer && (
        <>
          <Route index element={<FarmerDashboard />} />
          <Route path="/orders" element={<FarmerOrders />} />
          <Route path="/products" element={<FarmerProducts />} />
        </>
      )}

      {/* Seller routes */}
      {!isFarmer && (
        <>
          <Route index element={<SellerDashboard />} />
          <Route path="/orders" element={<SellerOrders />} />
          <Route path="/farmers/:farmerId" element={<FarmerProfileView />} />
          <Route path="/place-order/:farmerId" element={<PlaceOrder />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<LoadingScreen />} />
    </Routes>
  );
}
