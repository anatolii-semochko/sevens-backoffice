import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

export const objectToFormData = (obj, form = new FormData(), namespace = '') => {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) continue;
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (obj[key] instanceof File) {
      form.append(formKey, obj[key]);
    } else if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
      objectToFormData(obj[key], form, formKey);
    } else {
      form.append(formKey, obj[key]);
    }
  }
  return form;
};

export const fetchErrorMessage = (error) => error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error.message ||
  'Unknown API error'

export const handleApiError = (error) => {
  const message = fetchErrorMessage(error)
  window.toast.error(message)
  return message;
};

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

export default api;
