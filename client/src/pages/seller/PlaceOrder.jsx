import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getFarmerProfile, placeOrder } from '../../utils/api';
import { ChevronLeft, Calendar, ShoppingCart, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PlaceOrder() {
  const { farmerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    productId: searchParams.get('product') || '',
    quantity: '',
    deadline: '',
    notes: ''
  });

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        setLoading(true);
        const res = await getFarmerProfile(farmerId);
        setFarmer(res.data.farmer);
        if (!form.productId && res.data.farmer.products?.length > 0) {
          setForm(prev => ({ ...prev, productId: res.data.farmer.products[0].id }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
  }, [farmerId]);

  const selectedProduct = farmer?.products?.find(p => p.id === form.productId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId || !form.quantity || !form.deadline) return;
    
    setSubmitting(true);
    try {
      await placeOrder({
        farmerId,
        productId: form.productId,
        productName: selectedProduct?.name,
        quantity: Number(form.quantity),
        unit: selectedProduct?.unit,
        deadline: form.deadline,
        notes: form.notes,
        totalPrice: Number(form.quantity) * (selectedProduct?.pricePerUnit || 0)
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/orders'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto p-8 text-center animate-pulse">Loading order form...</div>;
  if (!farmer) return <div className="text-center py-20 font-bold">Farmer not found</div>;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Your request has been sent to {farmer.name}. You'll be notified once they respond.</p>
        <div className="card p-6 text-left max-w-sm mx-auto mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Product</span>
            <span className="font-bold text-gray-900 dark:text-white">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Quantity</span>
            <span className="font-bold text-gray-900 dark:text-white">{form.quantity} {selectedProduct?.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Deadline</span>
            <span className="font-bold text-gray-900 dark:text-white">{new Date(form.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard/orders')} className="btn-primary px-8">View My Orders</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Place Order</h1>
        <p className="text-gray-500 dark:text-gray-400">Requesting produce from <span className="text-emerald-600 font-bold">{farmer.name}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Select Product</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {farmer.products?.map(p => (
              <button
                key={p.id}
                type="button"
                disabled={p.availableQuantity <= 0}
                onClick={() => setForm({ ...form, productId: p.id })}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all relative ${
                  form.productId === p.id 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' 
                    : 'border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface hover:border-emerald-200'
                } ${p.availableQuantity <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.productId === p.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-dark-surface-2 text-gray-400'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold text-sm ${form.productId === p.id ? 'text-emerald-900 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{p.name}</p>
                  <p className="text-xs text-gray-500">${p.pricePerUnit}/{p.unit}</p>
                </div>
                {form.productId === p.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Quantity ({selectedProduct?.unit || 'units'})</label>
            <div className="relative">
              <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="0.00"
                className="input-field pl-12 h-14"
              />
            </div>
            {selectedProduct && form.quantity > selectedProduct.availableQuantity && (
              <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Exceeds available stock ({selectedProduct.availableQuantity})
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Collection Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="input-field pl-12 h-14"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider text-[11px]">Additional Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Specify any special requirements or pickup details..."
            rows={4}
            className="input-field resize-none p-4"
          />
        </div>

        {/* Order Summary */}
        {selectedProduct && form.quantity > 0 && (
          <div className="bg-emerald-900 text-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/20 animate-fade-in-up">
            <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">Order Summary</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-100/60 font-medium">{selectedProduct.name} (x{form.quantity})</span>
                <span className="font-bold">${(form.quantity * selectedProduct.pricePerUnit).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-100/60 font-medium">Service Fee</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
            </div>
            <div className="h-px bg-emerald-800 mb-6" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-extrabold">${(form.quantity * selectedProduct.pricePerUnit).toFixed(2)}</p>
              </div>
              <button 
                type="submit"
                disabled={submitting || form.quantity > selectedProduct.availableQuantity}
                className="px-8 py-3 bg-white text-emerald-900 font-extrabold rounded-2xl hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
