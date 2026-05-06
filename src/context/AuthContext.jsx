import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('kcv_token')
    if (token) {
      authAPI.me()
        .then(setUser)
        .catch(() => {
          // Silently clear invalid/expired token — don't redirect guests
          localStorage.removeItem('kcv_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const { access_token } = await authAPI.login(formData)
    localStorage.setItem('kcv_token', access_token)
    const userData = await authAPI.me()
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('kcv_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
