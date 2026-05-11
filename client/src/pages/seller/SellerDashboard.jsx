import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmersFeed } from '../../utils/api';
import StarRating from '../../components/StarRating';
import { Search, MapPin, CheckCircle2, ChevronRight, User } from 'lucide-react';

const categories = ['All', 'Vegetables', 'Fruits', 'Animal Products'];

export default function SellerDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => { fetchFarmers(); }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await getFarmersFeed();
      setFarmers(res.data || []);
    } catch { setFarmers([]); } finally { setLoading(false); }
  };

  const filtered = farmers.filter(f => {
    const matchesSearch = f.name?.toLowerCase().includes(search.toLowerCase()) || 
                          f.location?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            (f.products && f.products.some(p => p.category?.toLowerCase() === activeCategory.toLowerCase().replace(' ', '_')));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Sourcing Network</h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface focus:border-purple-500 dark:focus:border-purple-500 outline-none transition-all shadow-sm font-medium"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                  activeCategory === c
                    ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-2'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card p-6 h-[300px] animate-pulse">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-full shimmer flex-shrink-0" />
                <div className="flex-1 space-y-3 mt-1">
                  <div className="h-5 w-3/4 rounded shimmer" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                </div>
              </div>
              <div className="h-20 rounded-2xl shimmer mb-6" />
              <div className="h-12 rounded-xl shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-24 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 dark:bg-dark-surface-2 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-gray-200 dark:text-gray-700" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">No farmers found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(farmer => {
            const hasProducts = farmer.products && farmer.products.length > 0;
            const topProducts = hasProducts 
              ? [...new Set(farmer.products.map(p => p.name))].slice(0, 3).join(', ') 
              : 'No listed products yet';

            return (
              <div key={farmer.id} className="card p-6 flex flex-col hover:shadow-xl hover:border-purple-100 dark:hover:border-purple-900 transition-all group animate-fade-in-up">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 border-2 border-purple-100 dark:border-purple-800 overflow-hidden">
                    {farmer.avatarUrl ? (
                      <img src={farmer.avatarUrl} alt={farmer.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{farmer.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      Verified Farmer
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <StarRating value={farmer.rating || 4.5} size="sm" />
                    <span className="font-bold text-gray-900 dark:text-white">{(farmer.rating || 4.5).toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({farmer.reviewCount || 12} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{farmer.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">
                      98% Fulfillment
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-surface-2 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-dark-border group-hover:bg-purple-50/30 dark:group-hover:bg-purple-900/10 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Main Products</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-1">
                    {topProducts}
                    {farmer.products?.length > 3 && '...'}
                  </p>
                </div>

                <button 
                  onClick={() => navigate(`/dashboard/farmers/${farmer.id}`)}
                  className="mt-auto w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/10"
                >
                  View Profile <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
