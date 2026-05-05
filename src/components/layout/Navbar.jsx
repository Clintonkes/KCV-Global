import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Camera, ShoppingBag, Calendar, User, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, isAdmin, user } = useAuth()
  const location = useLocation()

  const navLinks = [
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Book', path: '/book', icon: Calendar },
    { name: 'Artists', path: '/artists', icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-slate-card/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-champagne tracking-tighter">KCV</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-platinum/40 mt-1 hidden sm:block">Global LLC</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`font-sans text-sm tracking-wide transition-colors hover:text-champagne ${location.pathname === link.path ? 'text-champagne' : 'text-platinum/60'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin" className="p-2 text-platinum/60 hover:text-champagne transition-colors">
              <LayoutDashboard size={20} />
            </Link>
          )}
          
          {isAuthenticated && (
            <Link to="/dashboard" className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-full bg-champagne/20 flex items-center justify-center text-champagne text-[10px] font-bold">
                    {user?.username?.[0].toUpperCase()}
                </div>
                <span className="text-xs text-platinum/80 font-sans hidden lg:block">{user?.username}</span>
            </Link>
          )}

          <button className="md:hidden text-platinum/60" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-24 left-6 right-6 bg-slate-card border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-platinum/60 text-lg font-serif"
              >
                <link.icon size={20} className="text-champagne" />
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
