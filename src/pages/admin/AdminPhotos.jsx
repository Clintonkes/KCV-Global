import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photosAPI } from '../../services/api'
import { Plus, Trash2, Image as ImageIcon, Loader2, X } from 'lucide-react'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Portrait', price: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const data = await photosAPI.list()
      setPhotos(data)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('category', formData.category)
      if (formData.price) data.append('price', formData.price)
      data.append('file', file)
      
      await photosAPI.create(data)
      setShowUpload(false)
      fetchPhotos()
    } catch (err) {
      alert('Error uploading photo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    try {
      await photosAPI.delete(id)
      fetchPhotos()
    } catch (err) {
      alert('Error deleting photo.')
    }
  }

  return (
    <div>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-champagne mb-2">Media Manager</h1>
          <p className="text-platinum/40 text-sm font-sans tracking-wide">Upload and organize your visual portfolio.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-champagne text-slate-deep px-8 py-3 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Upload New
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square bg-slate-card rounded-2xl overflow-hidden border border-white/5"
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-deep/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                     onClick={() => handleDelete(photo.id)}
                     className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                   <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{photo.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-deep/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-card border border-white/10 p-10 rounded-3xl max-w-lg w-full relative"
          >
            <button onClick={() => setShowUpload(false)} className="absolute top-6 right-6 text-platinum/20 hover:text-platinum">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-serif text-champagne mb-8">Upload Capture</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="aspect-video bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all relative overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                {file ? (
                  <p className="text-champagne font-sans text-sm">{file.name}</p>
                ) : (
                  <>
                    <ImageIcon className="text-platinum/10 mb-4" size={32} />
                    <p className="text-platinum/40 text-xs font-sans">Click or drag to select image</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm appearance-none"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Portrait</option>
                    <option>Landscape</option>
                    <option>Editorial</option>
                    <option>Fine Art</option>
                  </select>
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Price (Optional)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={uploading}
                className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : 'Start Upload'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
