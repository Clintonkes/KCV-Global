import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productsAPI } from '../services/api'
import { ShoppingCart, Plus, Minus } from 'lucide-react'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsAPI.list()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex justify-between items-end">
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
          <div className="bg-slate-card border border-white/10 p-4 rounded-2xl hidden md:flex items-center gap-4">
             <div className="bg-champagne/10 p-3 rounded-xl text-champagne">
                <ShoppingCart size={20} />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-platinum/40">Your Cart</p>
                <p className="text-sm font-bold text-platinum">0 Items · $0.00</p>
             </div>
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
                    src={product.image_url} 
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
                  <button className="bg-champagne text-slate-deep p-3 rounded-xl hover:scale-110 transition-transform shadow-lg shadow-champagne/10">
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
             <button className="mt-8 text-champagne border-b border-champagne/30 pb-1 hover:border-champagne transition-all text-sm font-sans tracking-widest uppercase">
               Notify me of drops
             </button>
          </div>
        )}
      </div>
    </div>
  )
}
