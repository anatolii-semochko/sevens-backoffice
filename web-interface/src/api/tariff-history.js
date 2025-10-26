import api, { fetchErrorMessage } from './index'

const mainUrl = '/tariff-history'

export const fetchTariffHistory = (criteria) => api
  .get(mainUrl, { params: criteria })
  .then(res => res.data)

export const fetchTariffHistoryById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const getTariffTransaction = (data) => api
  .post(`${mainUrl}/transaction/get`, data)
  .then(res => res.data)

export const postTariffTransaction = (data) => api
  .post(`${mainUrl}/transaction/post`, data)
  .then(res => res.data)

export const fetchError = (error) => fetchErrorMessage(error)
