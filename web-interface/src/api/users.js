import api, { fetchErrorMessage } from './index'

const mainUrl = '/users'

export const fetchUsers = (params) => api
  .get(mainUrl, { params })
  .then(res => res.data)

export const fetchUserById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createUser = (data) => api
  .post(mainUrl, data)

export const updateUser = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const updateUserProfile = (data) => api
  .patch(`${mainUrl}/user-profile`, data)

export const patchUser = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deleteUser = (id) => api
  .delete(`${mainUrl}/${id}`)

export const fetchCurrentUser = () => api
  .get(`${mainUrl}/me`)
  .then((res) => res.data)

export const fetchRolesList = () => api
  .get(`${mainUrl}/roles-list`)
  .then((res) => res.data)

export const fetchError = (error) => fetchErrorMessage(error)
