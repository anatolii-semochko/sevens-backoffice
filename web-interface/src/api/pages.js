import api, { fetchErrorMessage } from './index'

const mainUrl = '/pages'

export const fetchPages = (params) => api
  .get(mainUrl, {params})
  .then(res => res.data)

export const fetchPageById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createPage = (data) => api
  .post(mainUrl, data)

export const updatePage = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const patchPage = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deletePage = (id) => api
  .delete(`${mainUrl}/${id}`)

export const fetchError = (error) => fetchErrorMessage(error)
