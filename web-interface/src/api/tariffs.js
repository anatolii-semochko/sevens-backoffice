import axios from 'axios'
import api, { fetchErrorMessage } from './index'

const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_NODE_SERVER_URL || 'http://localhost:3001',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Get current tariffs from blockchain via PHP API
export const fetchCurrentTariffs = () => api
  .get('/tariff-history/current')
  .then(res => res.data)

// Direct node-server calls (kept for backward compatibility)
export const getSetTariffsTransaction = (data) => nodeApi
  .get('/tariff/get-transaction', { params: data })
  .then(res => res.data)
