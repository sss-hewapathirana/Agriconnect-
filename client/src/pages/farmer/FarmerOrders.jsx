import { useState, useEffect } from 'react';
import { getMyOrders, updateOrderStatus } from '../../utils/api';
import { Package, Clock, CheckCircle2, XCircle, Filter, Calendar, ShoppingBag } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', className: 'badge-pending', icon: Clock },
  accepted: { label: 'Accepted', className: 'badge-accepted', icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'badge-rejected', icon: XCircle },
};

const tabs = ['all', 'pending', 'accepted', 'rejected'];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch { setOrders([]); } finally { setLoading(false); }
  };

  const handleStatus = async (orderId, status) => {
    setProcessing(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } finally { setProcessing(null); }
  };

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">All Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{orders.length} total orders received</p>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4">
        {tabs.map(tab => {
          const count = tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length;
          const cfg = tab !== 'all' ? statusConfig[tab] : null;
          const Icon = cfg?.icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#21262d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#30363d]'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 space-y-3">
              <div className="shimmer h-4 rounded w-2/3" />
              <div className="shimmer h-3 rounded w-1/2" />
              <div className="shimmer h-3 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">No {activeTab !== 'all' ? activeTab : ''} orders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Orders will appear here when sellers place them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="card p-4 animate-fade-in-up">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{order.productName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      From: {order.sellerName || 'Unknown Seller'}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Quantity</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.quantity} {order.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Deadline</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-xs">
                      {order.deadline ? new Date(order.deadline).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Placed</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-xs">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-2 mb-3">
                    "{order.notes}"
                  </p>
                )}

                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(order.id, 'rejected')}
                      disabled={processing === order.id} className="btn-danger flex-1 py-2 text-sm">
                      Reject
                    </button>
                    <button onClick={() => handleStatus(order.id, 'accepted')}
                      disabled={processing === order.id} className="btn-primary flex-1 py-2 text-sm">
                      {processing === order.id
                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : 'Accept'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
