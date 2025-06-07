import api from './index'

export const fetchLanguages = () => api.get(`/languages`).then(res => res.data)

export const fetchLanguageById = (id) => api.get(`/languages/${id}`).then(res => res.data)

export const createLanguage = (data) => api.post('/languages', data)

export const updateLanguage = (id, data) => api.put(`/languages/${id}`, data)

export const patchLanguage = (id, data) => api.patch(`/languages/${id}`, data)

export const deleteLanguage = (id) => api.delete(`/languages/${id}`)

export const swapLanguageOrder = async (id, swapId) => await api.patch(`/languages/${id}/swap`, {swapId})
