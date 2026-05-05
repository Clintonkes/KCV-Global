import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { ShoppingBag, Calendar, User as UserIcon, Settings, LogOut, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ordersAPI, sessionsAPI } from '../../services/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, bookingsData] = await Promise.all([
          ordersAPI.list(),
          sessionsAPI.my()
        ])
        setOrders(ordersData)
        setBookings(bookingsData)
      } catch (err) {
        console.error("Error fetching dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'text-champagne' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length, icon: Calendar, color: 'text-platinum' },
    { label: 'Role', value: user?.role, icon: UserIcon, color: 'text-champagne' },
  ]

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-champagne mb-2">Studio Dashboard</h1>
            <p className="text-platinum/40 font-sans">Welcome back, <span className="text-platinum">{user?.username}</span>.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-platinum/60 hover:text-red-400 transition-colors text-sm font-sans"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-card border border-white/5 p-8 rounded-3xl"
            >
              <stat.icon className={`${stat.color} mb-4`} size={24} />
              <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-sans font-bold">{stat.label}</p>
              <p className="text-3xl font-serif text-platinum mt-1 capitalize">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Orders */}
          <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-serif text-platinum">Recent Orders</h3>
              <ShoppingBag className="text-platinum/20" size={20} />
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-platinum font-sans font-bold text-sm">Order #{order.id}</p>
                        <p className="text-platinum/40 text-xs">${order.total_amount.toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest bg-champagne/10 text-champagne px-3 py-1 rounded-full border border-champagne/20">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-platinum/30 text-sm italic font-sans py-4">No orders placed yet.</p>
              )}
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-serif text-platinum">Upcoming Sessions</h3>
              <Calendar className="text-platinum/20" size={20} />
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-platinum font-sans font-bold text-sm">{booking.type} Session</p>
                        <p className="text-platinum/40 text-xs">{booking.date} @ {booking.time_slot}</p>
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-champagne/10 text-champagne border-champagne/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-platinum/30 text-sm italic font-sans py-4">No sessions scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
