import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photosAPI } from '../services/api'
import { Eye, Heart } from 'lucide-react'

import toast from 'react-hot-toast'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Portrait', 'Landscape', 'Fine Art', 'Commercial', 'Editorial']

  const getFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8000'
    return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`
  }

  useEffect(() => {
    setLoading(true)
    photosAPI.list({ category: filter === 'All' ? undefined : filter })
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(err => {
        toast.error("Failed to load gallery")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-champagne mb-6"
          >
            Visual Anthology
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-sans border transition-all ${
                  filter === cat 
                  ? 'bg-champagne text-slate-deep border-champagne' 
                  : 'text-platinum/40 border-platinum/10 hover:border-platinum/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </header>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="aspect-[3/4] bg-slate-card/50 rounded-2xl animate-pulse" />
             ))}
           </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-card cursor-pointer border border-white/5"
                >
                  <img 
                    src={getFullUrl(photo.url)} 
                    alt={photo.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                    <p className="text-champagne font-serif text-2xl mb-2">{photo.title}</p>
                    <p className="text-platinum/60 text-sm font-sans mb-4">{photo.category}</p>
                    <div className="flex gap-3">
                       <button className="p-2 bg-white/10 rounded-full text-platinum hover:bg-champagne hover:text-slate-deep transition-colors">
                          <Eye size={18} />
                       </button>
                       <button className="p-2 bg-white/10 rounded-full text-platinum hover:bg-red-500 transition-colors">
                          <Heart size={18} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {!loading && photos.length === 0 && (
          <div className="text-center py-20">
             <p className="text-platinum/40 font-serif text-2xl italic">No captures found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
