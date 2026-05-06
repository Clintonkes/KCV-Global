import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Camera, ShoppingBag, Calendar, Send, Users, Home, ChevronRight, Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()

  const menuItems = [
    { name: 'Overview',      path: '/admin',              icon: LayoutDashboard },
    { name: 'Media',         path: '/admin/photos',       icon: Camera },
    { name: 'Orders',        path: '/admin/orders',       icon: ShoppingBag },
    { name: 'Bookings',      path: '/admin/sessions',     icon: Calendar },
    { name: 'Applications',  path: '/admin/submissions',  icon: Send },
    { name: 'Users',         path: '/admin/users',        icon: Users },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-champagne tracking-tighter">KCV</span>
          <span className="text-[10px] uppercase tracking-widest text-platinum/40 mt-1">Admin</span>
        </Link>
        <button className="lg:hidden text-platinum/40 hover:text-platinum" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              location.pathname === item.path
              ? 'bg-champagne text-slate-deep shadow-lg shadow-champagne/10'
              : 'text-platinum/40 hover:bg-white/5 hover:text-platinum'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.name}</span>
            {location.pathname === item.path && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      <div className="space-y-2 mt-6 pt-6 border-t border-white/5">

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 text-red-400/60 hover:text-red-400 transition-colors text-sm px-4 py-2 rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-deep text-platinum font-sans">

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-card/50 backdrop-blur-xl fixed h-full z-20 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-slate-deep/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 z-40 bg-slate-card border-r border-white/5 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-slate-deep/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-platinum/60 hover:text-champagne transition-colors"
          >
            <Menu size={22} />
          </button>
          <span className="font-serif text-xl text-champagne">KCV Admin</span>

        </div>

        {/* Page Content */}
        <div className="p-5 md:p-8 lg:p-12 pb-24 lg:pb-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-slate-card/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
              location.pathname === item.path ? 'text-champagne' : 'text-platinum/30 hover:text-platinum/60'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[9px] uppercase tracking-wider font-bold">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
