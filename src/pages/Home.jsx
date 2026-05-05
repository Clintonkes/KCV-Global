import { motion } from 'framer-motion'
import { Camera, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-slate-deep text-platinum min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-10">
        <div className="max-w-4xl z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-champagne font-sans tracking-widest text-sm uppercase"
          >
            Creative Consulting & Photography
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-serif mt-6 leading-tight"
          >
            Capturing the <br /> 
            <span className="italic text-champagne">Essence of Vision.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-platinum/60 mt-8 max-w-xl font-sans"
          >
            KCV Global LLC provides premium photography and creative strategy for brands that demand excellence. Based in Lowell, MA.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex gap-6"
          >
            <button className="bg-champagne text-slate-deep px-8 py-4 rounded-xl font-sans font-bold hover:scale-105 transition-transform flex items-center gap-2">
              Book a Session <Camera size={18} />
            </button>
            <button className="border border-platinum/20 text-platinum px-8 py-4 rounded-xl font-sans hover:bg-white/5 transition-colors flex items-center gap-2">
              View Gallery <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Floating Asymmetrical Element */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="w-[400px] h-[600px] bg-slate-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-deep to-transparent opacity-60" />
             <div className="absolute bottom-10 left-10">
                <Star className="text-champagne mb-4" />
                <p className="font-serif text-2xl text-champagne">Editorial Quality</p>
                <p className="text-sm opacity-60">Certified Creative Excellence</p>
             </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
