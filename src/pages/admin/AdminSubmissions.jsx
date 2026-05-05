import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submissionsAPI } from '../../services/api'
import { Check, X, Eye, Clock, User } from 'lucide-react'

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await submissionsAPI.list()
      setSubmissions(data)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id, status) => {
    try {
      await submissionsAPI.review(id, status)
      fetchSubmissions()
    } catch (err) {
      alert('Error updating submission status.')
    }
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-champagne mb-2">Artist Applications</h1>
        <p className="text-platinum/40 text-sm font-sans tracking-wide">Review and approve new creators joining the KCV Collective.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {submissions.map((sub) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-card border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-champagne/10 flex items-center justify-center text-champagne">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-platinum font-bold font-sans">Artist #{sub.artist_id}</h3>
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full border ${
                        sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        sub.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-champagne/10 text-champagne border-champagne/20'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-platinum/60 text-xs font-sans tracking-wide mb-3">{sub.category} · Applied on {new Date(sub.created_at).toLocaleDateString()}</p>
                    <p className="text-platinum/40 text-sm italic font-serif leading-relaxed max-w-xl">"{sub.bio}"</p>
                  </div>
                </div>

                {sub.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleReview(sub.id, 'approved')}
                      className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => handleReview(sub.id, 'rejected')}
                      className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {submissions.length === 0 && (
            <div className="text-center py-20 bg-white/3 rounded-3xl border border-white/5 border-dashed">
               <Clock size={40} className="mx-auto text-platinum/10 mb-4" />
               <p className="text-platinum/30 font-serif text-lg">No pending applications at this time.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
