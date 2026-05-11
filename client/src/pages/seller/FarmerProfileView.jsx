import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFarmerProfile, getFarmerReviews } from '../../utils/api';
import { MapPin, Star, Package, ShoppingCart, MessageSquare, ChevronLeft, CheckCircle2, Globe, Phone } from 'lucide-react';
import StarRating from '../../components/StarRating';

export default function FarmerProfileView() {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          getFarmerProfile(farmerId),
          getFarmerReviews(farmerId)
        ]);
        setFarmer(profileRes.data.farmer);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="shimmer h-8 w-24 rounded-lg" />
        <div className="flex gap-8">
          <div className="shimmer w-32 h-32 rounded-3xl" />
          <div className="flex-1 space-y-3">
            <div className="shimmer h-8 w-1/3 rounded" />
            <div className="shimmer h-4 w-1/4 rounded" />
            <div className="shimmer h-4 w-1/2 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="shimmer h-64 rounded-2xl" />
          <div className="shimmer h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!farmer) return <div className="text-center py-20 font-bold">Farmer not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Sourcing
      </button>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/20 overflow-hidden border-2 border-emerald-100 dark:border-emerald-800 shadow-xl shadow-emerald-900/5 flex-shrink-0">
          {farmer.avatarUrl ? (
            <img src={farmer.avatarUrl} alt={farmer.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-4xl">
              {farmer.name?.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="font-display text-4xl font-extrabold text-gray-900 dark:text-white">{farmer.name}</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
              <MapPin className="w-4 h-4 text-emerald-500" /> {farmer.location}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 
              <span className="text-gray-900 dark:text-white font-bold">{farmer.rating?.toFixed(1) || '5.0'}</span> 
              ({reviews.length} reviews)
            </div>
            {farmer.phone && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                <Phone className="w-4 h-4 text-emerald-500" /> {farmer.phone}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/dashboard/place-order/${farmer.id}`)}
              className="px-8 py-3 bg-emerald-custom hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/10 transition-all active:scale-95 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Place Order
            </button>
            <button className="px-6 py-3 bg-white dark:bg-dark-surface border-2 border-gray-100 dark:border-dark-border text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-all active:scale-95 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Message
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-dark-border mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${
            activeTab === 'products' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
          }`}
        >
          Products ({farmer.products?.length || 0})
          {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${
            activeTab === 'reviews' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
          }`}
        >
          Reviews ({reviews.length})
          {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${
            activeTab === 'about' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
          }`}
        >
          About
          {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmer.products?.length > 0 ? (
              farmer.products.map(product => (
                <div key={product.id} className="card p-5 group hover:border-emerald-100 dark:hover:border-emerald-900 transition-all">
                  <div className="w-full aspect-square bg-gray-50 dark:bg-dark-surface-2 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <Package className="w-12 h-12 text-gray-200 dark:text-gray-700 group-hover:scale-110 transition-transform" />
                    {product.availableQuantity <= 0 && (
                      <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-4">{product.category?.replace('_', ' ')}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Price</p>
                      <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${product.pricePerUnit?.toFixed(2)}<span className="text-xs font-medium text-gray-400">/{product.unit}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/place-order/${farmer.id}?product=${product.id}`)}
                      disabled={product.availableQuantity <= 0}
                      className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-custom hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 font-medium italic">No products listed.</div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="card p-6 animate-fade-in-up">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-surface-2 flex items-center justify-center font-bold text-gray-500">
                        {review.sellerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{review.sellerName}</p>
                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      <StarRating value={review.rating} size={16} />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{review.comment}"</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 font-medium italic">No reviews yet.</div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl space-y-8 animate-fade-in">
            <div className="card p-8">
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Biography</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {farmer.bio || `${farmer.name} is a dedicated farmer from ${farmer.location}, committed to providing high-quality agricultural products to local wholesalers and retailers.`}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                  <p className="font-bold text-gray-900 dark:text-white">8+ Years Farming</p>
                </div>
              </div>
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reliability</p>
                  <p className="font-bold text-gray-900 dark:text-white">99% Order Completion</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
