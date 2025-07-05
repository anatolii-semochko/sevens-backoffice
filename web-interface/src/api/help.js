import api, { fetchErrorMessage } from './index'

const mainUrl = '/help'

export const fetchHelps = (params) => api
  .get(mainUrl, {params})
  .then(res => res.data)

export const fetchHelpById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createHelp = (data) => api
  .post(mainUrl, data)

export const putHelp = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const patchHelp = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deleteHelp = (id) => api
  .delete(`${mainUrl}/${id}`)

export const swapHelpOrder = (id, swapId) => api
  .patch(`${mainUrl}/${id}/swap`, {swapId})

export const generateHelp = () => api
  .post(`${mainUrl}/generate`, {})

export const fetchError = (error) => fetchErrorMessage(error)
