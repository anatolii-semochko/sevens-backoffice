import api from './index'

export const fetchPages = () => api.get('/pages').then(res => res.data)

export const fetchPageById = (id) => api.get(`/pages/${id}`).then(res => res.data)

export const createPage = (data) => api.post('/pages', data)

export const updatePage = (id, data) => api.put(`/pages/${id}`, data)

export const patchPage = (id, data) => api.patch(`/pages/${id}`, data)

export const deletePage = (id) => api.delete(`/pages/${id}`)
