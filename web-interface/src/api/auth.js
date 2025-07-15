import api, { fetchErrorMessage, handleApiError } from './index'

export const login = (login, password) => api
    .post('/users/login', { login, password })
    .then((res) => {
      setAuthToken(res.data.token)
      return res.data
    })

export const logout = () => api
    .post('/users/logout')
    .catch((error) => {
      handleApiError(error)
      throw error
    })
    .finally(() => {
      setAuthToken(null)
    })

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
  }
}

const savedToken = localStorage.getItem('token')
if (savedToken) {
  setAuthToken(savedToken)
}

// Sync auth token across browser tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'token') {
    setAuthToken(e.newValue)
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      setAuthToken(null)
      if (!window.location.pathname.includes('/login')) {
        window.location.pathname = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const fetchError = (error) => fetchErrorMessage(error)
