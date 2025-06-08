import api, { fetchErrorMessage } from './index'

const mainUrl = '/pages-content'

export const fetchContent = () => api
  .get(mainUrl)
  .then(res => res.data)

export const fetchContentById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createContent = (data) => api
  .post(mainUrl, data)

export const updateContent = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const patchContent = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deleteContent = (id) => api
  .delete(`${mainUrl}/${id}`)

export const fetchError = (error) => fetchErrorMessage(error)
