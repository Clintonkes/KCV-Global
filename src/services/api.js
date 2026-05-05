import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kcv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('kcv_token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const photosAPI = {
  list: (params) => api.get('/photos', { params }),
  create: (data) => api.post('/photos', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/photos/${id}`),
}

export const productsAPI = {
  list: (params) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
}

export const ordersAPI = {
  checkout: (data) => api.post('/orders/checkout', data),
  list: () => api.get('/orders'),
}

export const sessionsAPI = {
  getSlots: (params) => api.get('/sessions', { params }),
  book: (data) => api.post('/sessions/book', data),
  my: () => api.get('/sessions/my'),
  updateStatus: (id, status) => api.put(`/sessions/${id}`, null, { params: { status } }),
}

export const submissionsAPI = {
  submit: (data) => api.post('/submissions', data),
  list: () => api.get('/submissions'),
  review: (id, status) => api.put(`/submissions/${id}`, null, { params: { status } }),
}

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
}

export default api
