import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { submissionsAPI } from '../services/api'
import { User, Mail, Globe, Briefcase } from 'lucide-react'

import toast from 'react-hot-toast'

export default function Artists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showApply, setShowApply] = useState(false)
  const [applyForm, setApplyForm] = useState({ category: 'Photography', bio: '', name: '', email: '' })

  useEffect(() => {
    // In a real app, this would fetch approved artists. 
    setLoading(false)
  }, [])

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      await submissionsAPI.submit(applyForm)
      toast.success('Application submitted! We will review it shortly.')
      setShowApply(false)
    } catch (err) {
      toast.error('Submission failed. Please check your connection.')
      console.error(err)
    }
  }

  const MOCK_ARTISTS = [
    { id: 1, name: 'Elena Rossi', role: 'Editorial Photographer', bio: 'Specializing in high-fashion narrative captures.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop' },
    { id: 2, name: 'Julian Vane', role: 'Creative Director', bio: 'Former Vogue contributor, focused on brand identity.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop' },
    { id: 3, name: 'Sasha Kemp', role: 'Fine Art Specialist', bio: 'Exploring the intersection of light and digital texture.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop' },
  ]

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif text-champagne mb-4"
            >
              The Collective
            </motion.h1>
            <p className="text-platinum/40 font-sans tracking-wide max-w-xl">
              Meet the visionaries behind KCV Global. A curated assembly of photographers and creative consultants.
            </p>
          </div>
          <button 
            onClick={() => setShowApply(true)}
            className="bg-white/5 border border-white/10 text-platinum px-8 py-3 rounded-xl font-sans hover:bg-champagne hover:text-slate-deep transition-all"
          >
            Join the Collective
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_ARTISTS.map((artist, i) => (
            <motion.div 
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-square bg-slate-card rounded-2xl overflow-hidden border border-white/5 relative mb-6">
                 <img 
                   src={artist.image} 
                   alt={artist.name} 
                   className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-deep to-transparent opacity-60" />
              </div>
              <h3 className="text-champagne font-serif text-3xl mb-1">{artist.name}</h3>
              <p className="text-platinum/40 text-xs uppercase tracking-widest font-sans font-bold mb-4">{artist.role}</p>
              <p className="text-platinum/60 text-sm font-sans leading-relaxed mb-6">{artist.bio}</p>
              <div className="flex gap-4">
                 <button className="text-platinum/30 hover:text-champagne transition-colors"><Globe size={18} /></button>
                 <button className="text-platinum/30 hover:text-champagne transition-colors"><Mail size={18} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Apply Modal */}
        {showApply && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-deep/80">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-card border border-white/10 p-10 rounded-3xl max-w-xl w-full"
            >
              <h2 className="text-3xl font-serif text-champagne mb-2">Artist Application</h2>
              <p className="text-platinum/40 text-sm font-sans mb-8">Tell us about your work and why you want to join KCV.</p>
              
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                      onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                      onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Primary Discipline</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm appearance-none"
                    onChange={(e) => setApplyForm({...applyForm, category: e.target.value})}
                  >
                    <option>Photography</option>
                    <option>Creative Direction</option>
                    <option>Styling</option>
                    <option>Visual Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Short Bio / Statement</label>
                  <textarea 
                    rows="4"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm resize-none"
                    onChange={(e) => setApplyForm({...applyForm, bio: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4">
                   <button 
                     type="button" 
                     onClick={() => setShowApply(false)}
                     className="flex-1 border border-platinum/10 text-platinum/60 py-3 rounded-xl hover:bg-white/5 transition-colors"
                   >
                     Cancel
                   </button>
                   <button className="flex-1 bg-champagne text-slate-deep py-3 rounded-xl font-bold hover:bg-white transition-colors">
                     Submit Application
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
