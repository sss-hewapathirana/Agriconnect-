import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import Modal from '../../components/Modal';
import { Plus, Pencil, Trash2, Package, AlertTriangle, X } from 'lucide-react';

const categories = ['vegetables', 'fruits', 'animal_products', 'grains', 'spices'];

const emptyForm = { name: '', category: 'vegetables', description: '', pricePerUnit: '', unit: 'kg', availableQuantity: '' };

function ProductCard({ product, onEdit, onDelete, deleting }) {
  const isLowStock = product.availableQuantity < 20;
  return (
    <div className="card overflow-hidden animate-fade-in-up">
      <div className="relative bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-[#21262d] h-32 flex items-center justify-center">
        <Package className="w-12 h-12 text-green-300 dark:text-green-700" />
        {isLowStock && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Low Stock
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 bg-white dark:bg-[#21262d] rounded-lg flex items-center justify-center text-gray-500 hover:text-green-600 shadow-sm border border-gray-100 dark:border-[#30363d] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            disabled={deleting === product.id}
            className="w-8 h-8 bg-white dark:bg-[#21262d] rounded-lg flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm border border-gray-100 dark:border-[#30363d] transition-colors"
          >
            {deleting === product.id
              ? <span className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-900 dark:text-white mb-2">{product.name}</p>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Price</p>
            <p className="font-bold text-green-600 dark:text-green-400">
              ${Number(product.pricePerUnit).toFixed(2)}/{product.unit}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Stock</p>
            <p className={`font-bold ${isLowStock ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {product.availableQuantity} {product.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ form, setForm, onSubmit, loading, onClose, isEdit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Fresh Organic Carrots" className="input-field" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
            {categories.map(c => (
              <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
          <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="input-field">
            {['kg', 'g', 'liter', 'piece', 'dozen'].map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price per {form.unit}</label>
          <input type="number" min="0" step="0.01" value={form.pricePerUnit}
            onChange={e => setForm({ ...form, pricePerUnit: e.target.value })}
            placeholder="0.00" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantity ({form.unit})</label>
          <input type="number" min="0" value={form.availableQuantity}
            onChange={e => setForm({ ...form, availableQuantity: e.target.value })}
            placeholder="0" className="input-field" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (optional)</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your product..." rows={3} className="input-field resize-none" />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getMyProducts();
      setProducts(res.data.products || []);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, description: p.description || '', pricePerUnit: p.pricePerUnit, unit: p.unit, availableQuantity: p.availableQuantity });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, pricePerUnit: Number(form.pricePerUnit), availableQuantity: Number(form.availableQuantity) };
      if (editing) {
        await updateProduct(editing.id, payload);
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
      } else {
        const res = await createProduct(payload);
        setProducts(prev => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } finally { setDeleting(null); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your farm products and stock levels.</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card overflow-hidden">
              <div className="shimmer h-32" />
              <div className="p-4 space-y-2">
                <div className="shimmer h-4 rounded w-2/3" />
                <div className="shimmer h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">No products yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Add your first farm product to start receiving orders.</p>
          <button onClick={openAdd} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add First Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onEdit={openEdit} onDelete={handleDelete} deleting={deleting} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add New Product'}>
        <ProductForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={saving} onClose={() => setModalOpen(false)} isEdit={!!editing} />
      </Modal>

      {/* FAB */}
      <button
        onClick={openAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl active:scale-95 z-30"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
