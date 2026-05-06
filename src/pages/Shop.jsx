import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productsAPI } from '../services/api'
import { ShoppingCart, Plus, Minus } from 'lucide-react'

import toast from 'react-hot-toast'
import { ordersAPI } from '../services/api'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const [email, setEmail] = useState('')

  const getFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8000'
    return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`
  }

  useEffect(() => {
    productsAPI.list()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => {
        toast.error("Failed to load products")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success(`${product.name} added to cart`)
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
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
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
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif text-champagne mb-4"
            >
              The Atelier
            </motion.h1>
            <p className="text-platinum/40 font-sans tracking-wide">Premium prints, limited editions, and creative assets.</p>
          </div>
          
          <div className="bg-slate-card border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-4 w-full">
               <div className="bg-champagne/10 p-3 rounded-xl text-champagne">
                  <ShoppingCart size={20} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-platinum/40">Your Cart</p>
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
                   {isCheckingOut ? 'Processing...' : 'Checkout'}
                 </button>
               </div>
             )}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {[1,2,3].map(i => (
               <div key={i} className="bg-slate-card rounded-2xl h-[500px] animate-pulse" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[4/5] bg-slate-card rounded-2xl overflow-hidden border border-white/5 relative">
                   <img 
                    src={getFullUrl(product.image_url)} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute top-4 right-4 bg-slate-deep/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <p className="text-champagne font-bold font-sans">${product.price.toFixed(2)}</p>
                   </div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-platinum font-serif text-2xl">{product.name}</h3>
                    <p className="text-platinum/40 text-sm mt-1">{product.category}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-champagne text-slate-deep p-3 rounded-xl hover:scale-110 transition-transform shadow-lg shadow-champagne/10"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 bg-slate-card/30 rounded-3xl border border-white/5 border-dashed">
             <ShoppingCart size={48} className="mx-auto text-platinum/10 mb-6" />
             <p className="text-platinum/40 font-serif text-2xl italic">The atelier is currently being curated.</p>
          </div>
        )}
      </div>
    </div>
  )
}
