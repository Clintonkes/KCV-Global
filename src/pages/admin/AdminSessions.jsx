import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sessionsAPI } from '../../services/api'
import { Calendar, Clock, User, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'

export default function AdminSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const data = await sessionsAPI.getSlots()
      setSessions(data)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await sessionsAPI.updateStatus(id, status)
      fetchSessions()
    } catch (err) {
      alert('Error updating session status.')
    }
  }

  const statusStyles = {
    pending: 'bg-champagne/10 text-champagne border-champagne/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-platinum/10 text-platinum border-platinum/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-champagne mb-2">Booking Manager</h1>
        <p className="text-platinum/40 text-sm font-sans tracking-wide">Track and confirm creative sessions and consulting calls.</p>
      </div>

      <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-platinum/40">
                <th className="px-8 py-5 font-bold">Client & Session</th>
                <th className="px-8 py-5 font-bold">Date & Time</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-platinum font-bold text-sm">Client ID: {session.client_id}</p>
                        <p className="text-platinum/40 text-xs mt-0.5">{session.type} Session</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-platinum font-medium text-sm">
                       <Calendar size={14} className="text-champagne" />
                       {session.date}
                    </div>
                    <div className="flex items-center gap-2 text-platinum/40 text-xs mt-1">
                       <Clock size={14} />
                       {session.time_slot}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyles[session.status]}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {session.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(session.id, 'confirmed')}
                          className="p-2 text-platinum/20 hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleUpdateStatus(session.id, 'cancelled')}
                        className="p-2 text-platinum/20 hover:text-red-400 transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && sessions.length === 0 && (
            <div className="p-20 text-center">
               <Calendar size={40} className="mx-auto text-platinum/10 mb-4" />
               <p className="text-platinum/30 font-serif text-lg italic">No sessions found in the ledger.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
