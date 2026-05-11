import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserContext';
import { getMyOrders, updateOrderStatus } from '../../utils/api';
import { Package, Clock, CheckCircle2, XCircle, TrendingUp, Share2, ShoppingBag, Calendar, User } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', className: 'badge-pending', icon: Clock },
  accepted: { label: 'Accepted', className: 'badge-accepted', icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'badge-rejected', icon: XCircle },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

function OrderCard({ order, onAccept, onReject, processing }) {
  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="card p-4 animate-fade-in-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#21262d] flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.sellerName || 'Seller'}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
          <StatusIcon className="w-3 h-3" /> {cfg.label}
        </span>
      </div>

      <div className="space-y-1.5 mb-4 text-sm">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-0.5">Product</p>
            <p className="font-semibold text-gray-900 dark:text-white">{order.productName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-0.5">Quantity</p>
            <p className="font-semibold text-gray-900 dark:text-white">{order.quantity} {order.unit}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-0.5">Deadline</p>
          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {order.deadline ? new Date(order.deadline).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
          </p>
        </div>
        {order.notes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-2">
            "{order.notes}"
          </p>
        )}
      </div>

      {order.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onReject(order.id)}
            disabled={processing === order.id}
            className="btn-danger flex-1 py-2 text-sm"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(order.id)}
            disabled={processing === order.id}
            className="btn-primary flex-1 py-2 text-sm"
          >
            {processing === order.id ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : 'Accept'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function FarmerDashboard() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    setProcessing(orderId);
    try {
      await updateOrderStatus(orderId, 'accepted');
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'accepted' } : o));
    } finally { setProcessing(null); }
  };

  const handleReject = async (orderId) => {
    setProcessing(orderId);
    try {
      await updateOrderStatus(orderId, 'rejected');
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'rejected' } : o));
    } finally { setProcessing(null); }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => o.status === 'accepted');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Welcome back, {profile?.name?.split(' ')[0]} 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 stagger-children">
        <StatCard
          icon={Package}
          label="Active Orders"
          value={activeOrders.length}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Pending"
          value={pendingOrders.length}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Market Alert */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-xl p-4 mb-8 text-white">
        <div className="flex items-center gap-2 text-green-300 text-xs font-semibold mb-1">
          <TrendingUp className="w-3.5 h-3.5" /> MARKET ALERT
        </div>
        <div className="text-2xl font-extrabold mb-0.5">$1.40<span className="text-sm font-medium text-green-300">/kg</span></div>
        <p className="text-green-200 text-sm">Current market avg. for Tomato (Organic). Up 12% this week.</p>
      </div>

      {/* Incoming Orders */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-white">Incoming Orders</h2>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="text-sm text-green-600 dark:text-green-400 font-semibold"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4">
              <div className="shimmer h-4 rounded mb-3 w-3/4" />
              <div className="shimmer h-3 rounded mb-2 w-1/2" />
              <div className="shimmer h-3 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#21262d] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">No incoming orders yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Start receiving requests by sharing your profile with wholesalers and local markets.
          </p>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="btn-primary mx-auto"
          >
            <Share2 className="w-4 h-4" /> Share Profile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingOrders.slice(0, 5).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onReject={handleReject}
              processing={processing}
            />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="card p-4 text-left hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <Package className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
            <p className="font-semibold text-sm text-gray-900 dark:text-white">My Products</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage inventory</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="card p-4 text-left hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <User className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
            <p className="font-semibold text-sm text-gray-900 dark:text-white">All Orders</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View order history</p>
          </button>
        </div>
      </div>
    </div>
  );
}
