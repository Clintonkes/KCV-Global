import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productsAPI } from '../../services/api'
import { Plus, Trash2, Edit3, ShoppingBag, Loader2, X } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: 'Prints' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productsAPI.list()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => data.append(key, formData[key]))
      if (file) data.append('file', file)
      
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data)
      } else {
        await productsAPI.create(data)
      }
      
      setShowModal(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      alert('Error saving product.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productsAPI.delete(id)
      fetchProducts()
    } catch (err) {
      alert('Error deleting product.')
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category })
    setShowModal(true)
  }

  return (
    <div>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-champagne mb-2">Store Manager</h1>
          <p className="text-platinum/40 text-sm font-sans tracking-wide">Manage your e-commerce inventory and pricing.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', category: 'Prints' }) }}
          className="bg-champagne text-slate-deep px-8 py-3 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-platinum/40">
              <th className="px-8 py-5 font-bold">Product</th>
              <th className="px-8 py-5 font-bold">Price</th>
              <th className="px-8 py-5 font-bold">Stock</th>
              <th className="px-8 py-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-deep overflow-hidden border border-white/10">
                       <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-platinum font-bold text-sm">{product.name}</p>
                      <p className="text-platinum/40 text-xs mt-0.5">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-champagne font-bold">${product.price.toFixed(2)}</td>
                <td className="px-8 py-6 text-platinum/60 text-sm">{product.stock} Units</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(product)} className="p-2 text-platinum/20 hover:text-champagne transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-platinum/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && products.length === 0 && (
          <div className="p-20 text-center">
             <ShoppingBag size={40} className="mx-auto text-platinum/10 mb-4" />
             <p className="text-platinum/30 font-serif text-lg italic">Your inventory is empty.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-deep/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-card border border-white/10 p-10 rounded-3xl max-w-2xl w-full relative"
          >
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-platinum/20 hover:text-platinum">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-serif text-champagne mb-8">{editingProduct ? 'Edit Asset' : 'New Collection Item'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Product Name</label>
                  <input 
                    type="text" required value={formData.name}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Prints</option>
                    <option>Digital Assets</option>
                    <option>Courses</option>
                    <option>Consulting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Description</label>
                <textarea 
                  rows="3" required value={formData.description}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm resize-none"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Price ($)</label>
                  <input 
                    type="number" step="0.01" required value={formData.price}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Stock Quantity</label>
                  <input 
                    type="number" required value={formData.stock}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div>
                 <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Product Image</label>
                 <input 
                    type="file" 
                    className="w-full text-platinum/40 text-xs" 
                    onChange={(e) => setFile(e.target.files[0])}
                 />
              </div>

              <button 
                disabled={uploading}
                className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : (editingProduct ? 'Save Changes' : 'Add to Catalog')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
