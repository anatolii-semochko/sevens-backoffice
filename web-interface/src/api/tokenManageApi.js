import api, { fetchErrorMessage } from './index'

const mainUrl = '/token-manage'

export const fetchTokenTransactions = (criteria) => api
  .get(`${mainUrl}/transactions`, { params: criteria })
  .then(res => res.data)

export const fetchError = (error) => fetchErrorMessage(error)
