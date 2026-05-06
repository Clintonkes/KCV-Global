import { useState, useEffect } from 'react'
import { submissionsAPI } from '../../services/api'
import { Check, X, Clock, User, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchSubmissions() }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await submissionsAPI.list()
      setSubmissions(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load applications')
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id, status) => {
    try {
      await submissionsAPI.review(id, status)
      toast.success(`Application ${status}`)
      fetchSubmissions()
    } catch {
      toast.error('Error updating submission status.')
    }
  }



  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(submissions.length / itemsPerPage)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-champagne mb-1">Artist Applications</h1>
        <p className="text-platinum/40 text-sm font-sans">Review and approve new creators joining the KCV Collective.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-3xl">
          <Clock size={48} className="mx-auto text-platinum/10 mb-4" />
          <p className="text-platinum/30 font-serif text-xl italic">No applications at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {paginatedSubmissions.map((sub) => (
            <div key={sub.id} className="bg-slate-card border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-champagne/10 flex items-center justify-center text-champagne flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-platinum font-bold font-sans text-sm">
                      {sub.name || `Applicant #${sub.artist_id || sub.id}`}
                    </h3>
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      sub.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-champagne/10 text-champagne border-champagne/20'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  {sub.email && (
                    <p className="text-platinum/40 text-xs flex items-center gap-1 mb-1">
                      <Mail size={10} /> {sub.email}
                    </p>
                  )}
                  <p className="text-platinum/40 text-xs font-sans mb-2">{sub.category} · {new Date(sub.created_at).toLocaleDateString()}</p>
                  <p className="text-platinum/50 text-sm italic font-serif leading-relaxed line-clamp-2">"{sub.bio}"</p>
                </div>
              </div>

              {sub.status === 'pending' && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button onClick={() => handleReview(sub.id, 'approved')} className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleReview(sub.id, 'rejected')} className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all">
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {submissions.length > itemsPerPage && (
          <div className="px-8 py-4 bg-slate-card/50 border border-white/5 rounded-2xl flex items-center justify-between mt-6">
            <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, submissions.length)} of {submissions.length}
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
