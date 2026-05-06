import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photosAPI } from '../../services/api'
import { Plus, Trash2, Image as ImageIcon, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Portrait', price: '' })
  const [file, setFile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchPhotos() }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const data = await photosAPI.list()
      setPhotos(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load photos')
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('category', formData.category)
      if (formData.price) fd.append('price', formData.price)
      fd.append('file', file)
      await photosAPI.create(fd)
      toast.success('Photo uploaded!')
      setShowUpload(false)
      setFile(null)
      fetchPhotos()
    } catch {
      toast.error('Error uploading photo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await photosAPI.delete(id)
      toast.success('Photo deleted.')
      fetchPhotos()
    } catch {
      toast.error('Error deleting photo.')
    }
  }

  const paginatedPhotos = photos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(photos.length / itemsPerPage)

  const getFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const base = import.meta.env.PROD ? '' : 'http://localhost:8000'
    return `${base}/${url.startsWith('/') ? url.slice(1) : url}`
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-champagne mb-1">Media Manager</h1>
          <p className="text-platinum/40 text-sm font-sans">Upload and organize your visual portfolio.</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-champagne text-slate-deep px-6 py-3 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Upload New
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-3xl">
          <ImageIcon size={48} className="mx-auto text-platinum/10 mb-4" />
          <p className="text-platinum/30 font-serif text-xl italic">No photos uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {paginatedPhotos.map((photo) => (
              <motion.div
                key={photo.id} layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square bg-slate-card rounded-2xl overflow-hidden border border-white/5"
              >
                <img src={getFullUrl(photo.url)} alt={photo.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-deep/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{photo.title}</p>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {photos.length > itemsPerPage && (
            <div className="px-8 py-4 bg-slate-card/50 border border-white/5 rounded-2xl flex items-center justify-between">
              <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-bold">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, photos.length)} of {photos.length}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/5 text-platinum/60 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/5 text-platinum/60 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-md bg-slate-deep/80">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-card border border-white/10 p-6 sm:p-10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg relative max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setShowUpload(false)} className="absolute top-5 right-5 text-platinum/20 hover:text-platinum">
              <X size={20} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-serif text-champagne mb-6">Upload Capture</h2>

            <form onSubmit={handleUpload} className="space-y-5">
              <div className="aspect-video bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all relative overflow-hidden">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setFile(e.target.files[0])} required accept="image/*" />
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-platinum/10 mb-3" size={28} />
                    <p className="text-platinum/40 text-xs font-sans">Tap to select image</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Title</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm appearance-none" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option>Portrait</option><option>Landscape</option><option>Editorial</option><option>Fine Art</option>
                  </select>
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Price ($)</label>
                  <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              <button disabled={uploading} className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : 'Upload Photo'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
