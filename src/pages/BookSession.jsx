import { useState } from 'react'
import { motion } from 'framer-motion'
import { sessionsAPI } from '../services/api'
import { Calendar as CalendarIcon, Clock, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookSession() {
  const [formData, setFormData] = useState({
    date: '',
    time_slot: '',
    type: 'Portrait',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const sessionTypes = ['Portrait', 'Commercial', 'Editorial', 'Fine Art', 'Consulting']
  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM']

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await sessionsAPI.book(formData)
      setSubmitted(true)
      toast.success('Booking request sent!')
    } catch (err) {
      toast.error('Error booking session. Please try again.')
      console.error(err)
    }
  }

  if (submitted) {
    return (
      <div className="bg-slate-deep min-h-screen flex items-center justify-center px-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-card p-12 rounded-3xl border border-white/10 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} className="text-champagne" />
          </div>
          <h2 className="text-4xl font-serif text-champagne mb-4">Request Received</h2>
          <p className="text-platinum/60 font-sans leading-relaxed">
            Your creative session request has been logged. Our studio manager will reach out within 24 hours to confirm your slot.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-10 bg-champagne text-slate-deep px-8 py-3 rounded-xl font-bold font-sans hover:scale-105 transition-transform"
          >
            Back to Booking
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-slate-deep min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-serif text-champagne mb-8"
            >
              Reserve your <br /><span className="italic text-platinum">Narrative.</span>
            </motion.h1>
            <p className="text-platinum/60 font-sans text-lg mb-12 leading-relaxed">
              We specialize in cinematic portraiture and high-end commercial consulting. Select your preferred slot and our team will handle the rest.
            </p>
            
            <div className="space-y-8">
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-card rounded-xl flex items-center justify-center text-champagne border border-white/5">
                     <CalendarIcon size={20} />
                  </div>
                  <div>
                     <p className="text-platinum font-bold text-sm">Flexible Scheduling</p>
                     <p className="text-platinum/40 text-xs mt-1">Book up to 3 months in advance.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-card rounded-xl flex items-center justify-center text-champagne border border-white/5">
                     <MessageSquare size={20} />
                  </div>
                  <div>
                     <p className="text-platinum font-bold text-sm">Pre-Session Consult</p>
                     <p className="text-platinum/40 text-xs mt-1">Every booking includes a 15-minute concept call.</p>
                  </div>
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-card p-10 rounded-3xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Session Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {sessionTypes.map(t => (
                     <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({...formData, type: t})}
                        className={`py-2 rounded-xl text-xs font-sans border transition-all ${
                          formData.type === t 
                          ? 'bg-champagne text-slate-deep border-champagne' 
                          : 'text-platinum/60 border-platinum/10 hover:border-platinum/30'
                        }`}
                     >
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Preferred Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Time Slot</label>
                    <select 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm appearance-none"
                      onChange={(e) => setFormData({...formData, time_slot: e.target.value})}
                    >
                       <option value="">Select a time</option>
                       {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                      onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div>
                <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Project Notes</label>
                <textarea 
                  rows="4"
                  placeholder="Tell us about your vision..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm resize-none"
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <button className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-colors mt-4">
                Submit Request
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
