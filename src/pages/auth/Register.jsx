import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.register(formData)
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Email or username might be taken.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-deep min-h-screen flex items-center justify-center px-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-card border border-white/5 p-12 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-champagne mb-2">Create Account</h1>
            <p className="text-platinum/40 text-sm font-sans tracking-wide">Join the KCV Global community today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm transition-colors"
                  placeholder="creative_soul"
                />
              </div>
            </div>

            <div>
              <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-sans">{error}</p>
            )}

            <button 
              disabled={loading}
              className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center mt-10 text-platinum/40 text-sm font-sans">
            Already have an account? <Link to="/login" className="text-champagne hover:text-white transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
