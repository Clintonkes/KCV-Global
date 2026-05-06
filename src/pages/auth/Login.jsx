import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      // Redirect admins to the admin panel, others to home
      const userData = JSON.parse(localStorage.getItem('kcv_user') || '{}')
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-deep min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-card border border-white/5 p-12 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-champagne/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-champagne/20">
            <ShieldCheck size={28} className="text-champagne" />
          </div>
          <h1 className="font-serif text-4xl text-champagne mb-2">Admin Portal</h1>
          <p className="text-platinum/40 text-sm font-sans tracking-wide">KCV Global Staff Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-platinum/40 text-[10px] uppercase tracking-widest mb-2 font-sans font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm transition-colors"
                placeholder="admin@kcvglobal.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center font-sans bg-red-500/5 border border-red-500/10 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={loading}
            className="w-full bg-champagne text-slate-deep py-4 rounded-xl font-bold font-sans hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Access Dashboard <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-platinum/20 text-xs font-sans">
          This portal is for authorised KCV staff only.
        </p>
      </motion.div>
    </div>
  )
}
