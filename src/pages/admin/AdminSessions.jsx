import { useState, useEffect } from 'react'
import { sessionsAPI } from '../../services/api'
import { Calendar, User, CheckCircle, XCircle, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchSessions() }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const data = await sessionsAPI.getSlots()
      setSessions(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load sessions')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await sessionsAPI.updateStatus(id, status)
      toast.success(`Session ${status}`)
      fetchSessions()
    } catch {
      toast.error('Error updating session status.')
    }
  }



  const paginatedSessions = sessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(sessions.length / itemsPerPage)

  const statusStyles = {
    pending:   'bg-champagne/10 text-champagne border-champagne/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-platinum/10 text-platinum border-platinum/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-champagne mb-1">Booking Manager</h1>
        <p className="text-platinum/40 text-sm font-sans">Track and confirm creative sessions and consulting calls.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-3xl">
          <Calendar size={48} className="mx-auto text-platinum/10 mb-4" />
          <p className="text-platinum/30 font-serif text-xl italic">No sessions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedSessions.map((session) => (
            <div key={session.id} className="bg-slate-card border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne flex-shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-platinum font-bold text-sm">
                      {session.guest_name || `Client #${session.client_id}`}
                    </p>
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusStyles[session.status] || 'bg-white/5 text-platinum/40 border-white/5'}`}>
                      {session.status}
                    </span>
                  </div>
                  {session.email && (
                    <p className="text-platinum/40 text-xs flex items-center gap-1 mb-1">
                      <Mail size={10} /> {session.email}
                    </p>
                  )}
                  <p className="text-platinum/40 text-xs font-sans">{session.type} · {session.date} at {session.time_slot}</p>
                  {session.notes && <p className="text-platinum/30 text-xs italic mt-1 truncate max-w-xs">{session.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {session.status === 'pending' && (
                  <button onClick={() => handleUpdateStatus(session.id, 'confirmed')} className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all">
                    <CheckCircle size={14} /> Confirm
                  </button>
                )}
                <button onClick={() => handleUpdateStatus(session.id, 'cancelled')} className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all">
                  <XCircle size={14} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {sessions.length > itemsPerPage && (
          <div className="px-8 py-4 bg-slate-card/50 border border-white/5 rounded-2xl flex items-center justify-between mt-6">
            <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sessions.length)} of {sessions.length}
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
      </div>
    )}
    </div>
  )
}
