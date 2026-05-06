import { useState, useEffect } from 'react'
import { ordersAPI } from '../../services/api'
import { ShoppingBag, ChevronRight, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await ordersAPI.listAll()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-400" size={16} />
      case 'cancelled': return <XCircle className="text-red-400" size={16} />
      default: return <Clock className="text-champagne" size={16} />
    }
  }

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(orders.length / itemsPerPage)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif text-champagne mb-2">Order Requests</h1>
        <p className="text-platinum/40 text-sm font-sans tracking-wide">Manage Collector's Cart requests and update status.</p>
      </div>

      <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-platinum/40">
                <th className="px-8 py-5 font-bold">Order ID</th>
                <th className="px-8 py-5 font-bold">Customer</th>
                <th className="px-8 py-5 font-bold">Items</th>
                <th className="px-8 py-5 font-bold">Amount</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6 text-platinum font-bold text-sm">#{order.id}</td>
                  <td className="px-8 py-6">
                    <p className="text-platinum text-sm">{order.email}</p>
                    <p className="text-platinum/40 text-[10px] uppercase tracking-widest mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="text-platinum/60 text-xs">
                          {item.photo_id ? `Photo #${item.photo_id}` : `Product #${item.product_id}`} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-champagne font-bold">${order.total_amount.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                      {getStatusIcon(order.status)}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-platinum/80">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        className="bg-slate-deep border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-platinum/60 focus:outline-none focus:border-champagne/40"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length > itemsPerPage && (
          <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-platinum/60 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 text-platinum/60 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="p-20 text-center">
            <ShoppingBag size={40} className="mx-auto text-platinum/10 mb-4" />
            <p className="text-platinum/30 font-serif text-lg italic">No order requests yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
