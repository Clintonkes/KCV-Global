import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../services/api'
import { Users, ShoppingBag, Calendar, Camera, Send, TrendingUp, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.stats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.total_revenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-champagne', bg: 'bg-champagne/10' },
    { label: 'Platform Users', value: stats?.total_users || 0, icon: Users, color: 'text-platinum', bg: 'bg-white/5' },
    { label: 'Session Bookings', value: stats?.total_bookings || 0, icon: Calendar, color: 'text-champagne', bg: 'bg-champagne/10' },
    { label: 'Store Orders', value: stats?.total_orders || 0, icon: ShoppingBag, color: 'text-platinum', bg: 'bg-white/5' },
    { label: 'Gallery Assets', value: stats?.total_photos || 0, icon: Camera, color: 'text-champagne', bg: 'bg-champagne/10' },
    { label: 'Artist Applications', value: stats?.total_submissions || 0, icon: Send, color: 'text-platinum', bg: 'bg-white/5' },
  ]

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-champagne mb-2">Platform Overview</h1>
        <p className="text-platinum/40 text-sm font-sans tracking-wide">Real-time statistics and operational data for KCV Global.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-card border border-white/5 p-8 rounded-3xl group hover:border-champagne/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-sans font-bold mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-platinum">{loading ? '...' : stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-emerald-500 text-xs font-sans">+12% from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-card border border-white/5 p-8 rounded-3xl h-80 flex items-center justify-center">
           <p className="text-platinum/20 text-sm italic font-serif">Revenue Growth Chart Placeholder</p>
        </div>
        <div className="bg-slate-card border border-white/5 p-8 rounded-3xl h-80 flex items-center justify-center">
           <p className="text-platinum/20 text-sm italic font-serif">User Activity Distribution Placeholder</p>
        </div>
      </div>
    </div>
  )
}
