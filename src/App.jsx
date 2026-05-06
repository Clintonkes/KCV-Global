import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageTransition from './components/layout/PageTransition'

// Pages — Public
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import BookSession from './pages/BookSession'
import Artists from './pages/Artists'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Dashboard
import Dashboard from './pages/dashboard/Dashboard'

// Admin
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPhotos from './pages/admin/AdminPhotos'
import AdminSessions from './pages/admin/AdminSessions'
import AdminProducts from './pages/admin/AdminProducts'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminUsers from './pages/admin/AdminUsers'

/* ── Route guards ── */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-slate-deep flex items-center justify-center"><div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-slate-deep flex items-center justify-center"><div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

import { Toaster } from 'react-hot-toast'

/* ── Layout Wrapper ── */
function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <Toaster position="top-center" containerStyle={{ top: 80 }} toastOptions={{
        style: {
          background: '#1A1D21',
          color: '#F3E5D8',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          zIndex: 9999,
        }
      }} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SiteLayout><PageTransition><Home /></PageTransition></SiteLayout>} />
          <Route path="/gallery" element={<SiteLayout><PageTransition><Gallery /></PageTransition></SiteLayout>} />

          <Route path="/book" element={<SiteLayout><PageTransition><BookSession /></PageTransition></SiteLayout>} />
          <Route path="/artists" element={<SiteLayout><PageTransition><Artists /></PageTransition></SiteLayout>} />
          
          {/* Auth */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <SiteLayout><PageTransition><Dashboard /></PageTransition></SiteLayout>
            </PrivateRoute>
          } />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
