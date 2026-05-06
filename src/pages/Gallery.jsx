import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photosAPI, ordersAPI } from '../services/api'
import { Eye, ShoppingCart, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [email, setEmail] = useState('')

  const categories = ['All', 'Portrait', 'Landscape', 'Fine Art', 'Commercial', 'Editorial']

  const getFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
      : (import.meta.env.PROD ? '' : 'http://localhost:8000')
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

  const addToCart = (photo) => {
    if (!photo.price) {
      toast.error('This piece is not currently for sale.')
      return
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === photo.id)
      if (existing) {
        return prev.map(item => item.id === photo.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...photo, quantity: 1 }]
    })
    toast.success(`${photo.title} added to cart`)
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    if (!email) {
      toast.error('Please provide an email for the order receipt.')
      return
    }
    setIsCheckingOut(true)
    try {
      const orderData = {
        items: cart.map(item => ({ photo_id: item.id, quantity: item.quantity })),
        total_amount: cartTotal,
        email: email
      }
      await ordersAPI.checkout(orderData)
      setCart([])
      setEmail('')
      toast.success('Order placed! Check your email for details.', { duration: 5000 })
    } catch (err) {
      toast.error('Checkout failed. Please try again.')
      console.error(err)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex-1">
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
          </div>

          <div className="bg-slate-card border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-4 w-full">
               <div className="bg-champagne/10 p-3 rounded-xl text-champagne">
                  <ShoppingCart size={20} />
               </div>
               <div className="flex-1 min-w-[120px]">
                  <p className="text-[10px] uppercase tracking-widest text-platinum/40">Collector's Cart</p>
                  <p className="text-sm font-bold text-platinum">{cart.length} Items · ${cartTotal.toFixed(2)}</p>
               </div>
             </div>
             {cart.length > 0 && (
               <div className="flex w-full sm:w-auto gap-2">
                 <input 
                   type="email" 
                   placeholder="Your email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum focus:outline-none focus:border-champagne/40 w-full sm:w-40"
                 />
                 <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="bg-champagne text-slate-deep px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50 whitespace-nowrap"
                 >
                   {isCheckingOut ? 'Wait...' : 'Purchase'}
                 </button>
               </div>
             )}
          </div>
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
            <AnimatePresence mode="popLayout">
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
                  {photo.price > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-slate-deep/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                       <p className="text-champagne font-bold text-xs">${photo.price.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-deep/90 via-slate-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                    <p className="text-champagne font-serif text-3xl mb-1">{photo.title}</p>
                    <p className="text-platinum/60 text-sm font-sans mb-6">{photo.category}</p>
                    <div className="flex gap-3">
                       <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-champagne text-slate-deep rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-champagne/20" onClick={() => addToCart(photo)}>
                          <Plus size={18} /> Add to Cart
                       </button>
                       <button className="p-3 bg-white/10 rounded-xl text-platinum hover:bg-white/20 transition-colors">
                          <Eye size={20} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {!loading && photos.length === 0 && (
          <div className="text-center py-20 bg-slate-card/20 rounded-3xl border border-white/5 border-dashed">
             <p className="text-platinum/40 font-serif text-2xl italic">No captures found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

