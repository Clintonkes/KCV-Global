import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { User, Shield, UserCheck, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminAPI.users()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (id, role) => {
    try {
      await adminAPI.updateUser(id, { role })
      toast.success(`Role updated to ${role}`)
      fetchUsers()
    } catch {
      toast.error('Error updating user role.')
    }
  }

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )



  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-champagne mb-1">User Registry</h1>
          <p className="text-platinum/40 text-sm font-sans">Manage platform access, roles, and creator permissions.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/20" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-platinum focus:outline-none focus:border-champagne/40 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-card rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-3xl">
          <p className="text-platinum/30 font-serif text-xl italic">No users found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedUsers.map((u) => (
            <div key={u.id} className="bg-slate-card border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne flex-shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-platinum font-bold text-sm">{u.username}</p>
                  <p className="text-platinum/40 text-xs mt-0.5">{u.email}</p>
                  <p className="text-platinum/30 text-[10px] mt-0.5">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1 ${
                  u.role === 'admin' ? 'bg-champagne/20 text-champagne border-champagne/30' : 'bg-platinum/5 text-platinum/40 border-white/5'
                }`}>
                  {u.role === 'admin' ? <Shield size={10} /> : <UserCheck size={10} />}
                  {u.role}
                </span>
                <select
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-platinum/60 focus:outline-none appearance-none"
                  value={u.role}
                  onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > itemsPerPage && (
          <div className="px-8 py-4 bg-slate-card/50 border border-white/5 rounded-2xl flex items-center justify-between mt-6">
            <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
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
