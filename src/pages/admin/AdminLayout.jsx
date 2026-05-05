import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Camera, ShoppingBag, Calendar, Send, Users, Home, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLayout() {
  const location = useLocation()

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Media Manager', path: '/admin/photos', icon: Camera },
    { name: 'Store Manager', path: '/admin/products', icon: ShoppingBag },
    { name: 'Bookings', path: '/admin/sessions', icon: Calendar },
    { name: 'Submissions', path: '/admin/submissions', icon: Send },
    { name: 'Users', path: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex min-h-screen bg-slate-deep text-platinum font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-card/50 backdrop-blur-xl fixed h-full z-20 hidden lg:block">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <span className="font-serif text-2xl font-bold text-champagne tracking-tighter">KCV</span>
            <span className="text-[10px] uppercase tracking-widest text-platinum/40 mt-1">Admin</span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
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
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <Link to="/" className="flex items-center gap-3 text-platinum/30 hover:text-champagne transition-colors text-sm">
            <Home size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 md:p-12">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
