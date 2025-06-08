import api, { fetchErrorMessage } from './index'

const mainUrl = '/languages'

export const fetchLanguages = () => api
  .get(mainUrl)
  .then(res => res.data)

export const fetchLanguageById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createLanguage = (data) => api
  .post(mainUrl, data)

export const updateLanguage = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const patchLanguage = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deleteLanguage = (id) => api
  .delete(`${mainUrl}/${id}`)

export const swapLanguageOrder = (id, swapId) => api
  .patch(`${mainUrl}/${id}/swap`, {swapId})

export const fetchError = (error) => fetchErrorMessage(error)
