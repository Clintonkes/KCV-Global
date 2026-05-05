import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../services/api'
import { User, Shield, UserCheck, Search, Loader2 } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminAPI.users()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (id, role) => {
    try {
      await adminAPI.updateUser(id, { role })
      fetchUsers()
    } catch (err) {
      alert('Error updating user role.')
    }
  }

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-champagne mb-2">User Registry</h1>
          <p className="text-platinum/40 text-sm font-sans tracking-wide">Manage platform access, roles, and creator permissions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={18} />
          <input 
            type="text" 
            placeholder="Search users..."
            className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm w-full md:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-card border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-platinum/40">
              <th className="px-8 py-5 font-bold">User</th>
              <th className="px-8 py-5 font-bold">Role</th>
              <th className="px-8 py-5 font-bold">Joined</th>
              <th className="px-8 py-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-platinum font-bold text-sm">{u.username}</p>
                      <p className="text-platinum/40 text-xs mt-0.5">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-2 w-fit ${
                    u.role === 'admin' ? 'bg-champagne/20 text-champagne border-champagne/30' : 'bg-platinum/5 text-platinum/40 border-white/5'
                  }`}>
                    {u.role === 'admin' ? <Shield size={10} /> : <UserCheck size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-platinum/40 text-xs font-sans">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                   <select 
                     className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-platinum/60 focus:outline-none"
                     value={u.role}
                     onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                   >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="artist">Artist</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center">
             <p className="text-platinum/30 font-serif text-lg italic">No users matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
