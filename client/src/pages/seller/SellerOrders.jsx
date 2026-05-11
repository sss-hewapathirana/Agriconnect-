import { Calendar, CheckCircle2, Clock, ShoppingBag, Star, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import StarRating from '../../components/StarRating';
import { getMyOrders, submitReview } from '../../utils/api';

const statusConfig = {
  pending: { label: 'Pending', className: 'badge-pending', icon: Clock },
  accepted: { label: 'Accepted', className: 'badge-accepted', icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'badge-rejected', icon: XCircle },
};

function OrderCard({ order, onReview }) {
  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-surface-2 flex items-center justify-center border border-gray-100 dark:border-dark-border">
            <ShoppingBag className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{order.farmerName || 'Farmer'}</h3>
            <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.className}`}>
          <StatusIcon className="w-3 h-3" /> {cfg.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-surface-2 rounded-2xl border border-gray-100 dark:border-dark-border mb-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Product</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{order.productName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Quantity</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{order.quantity} {order.unit}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Deadline</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(order.deadline).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${order.totalPrice?.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all">
          View Details
        </button>
        {order.status === 'accepted' && (
          <button
            onClick={() => onReview(order)}
            className="flex-1 py-2.5 bg-emerald-custom text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5" /> Rate Farmer
          </button>
        )}
      </div>
    </div>
  );
}

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

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

  const handleReviewClick = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment('');
    setReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedOrder || !rating) return;
    setSubmitting(true);
    try {
      await submitReview({
        orderId: selectedOrder.id,
        farmerId: selectedOrder.farmerId,
        rating,
        comment
      });
      setReviewModal(false);
      // Optional: Refresh orders or show success
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400">Track and manage your procurement requests.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-5 h-[280px] animate-pulse">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl shimmer" />
                <div className="flex-1 space-y-2 mt-1">
                  <div className="shimmer h-4 rounded w-1/2" />
                  <div className="shimmer h-3 rounded w-1/4" />
                </div>
              </div>
              <div className="shimmer h-20 rounded-2xl mb-6" />
              <div className="flex gap-2">
                <div className="shimmer h-10 rounded-xl flex-1" />
                <div className="shimmer h-10 rounded-xl flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-dark-surface-2 flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-gray-700" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">You haven't placed any orders yet. Explore the sourcing network to find farmers.</p>
          <button className="btn-primary px-8">Find Farmers</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onReview={handleReviewClick} />
          ))}
        </div>
      )}

      <Modal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        title={`Review ${selectedOrder?.farmerName || 'Farmer'}`}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider text-[11px]">Overall Rating</label>
            <StarRating value={rating} size="lg" interactive={true} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Your Experience</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the produce quality and communication?"
              rows={4}
              className="input-field resize-none"
            />
          </div>
          <button
            onClick={handleReviewSubmit}
            disabled={submitting || !rating}
            className="w-full btn-primary py-3"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
