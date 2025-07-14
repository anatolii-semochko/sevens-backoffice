import api, { handleApiError, setAuthToken } from './index'

export const login = (email, password) =>
  api
    .post('/users/login', { email, password })
    .then((res) => {
      setAuthToken(res.data.token)
      return res.data
    })
    .catch((error) => {
      handleApiError(error)
      throw error
    })
export const logout = () =>
  api
    .post('/users/logout')
    .catch((error) => {
      handleApiError(error)
      throw error
    })
    .finally(() => {
      setAuthToken(null)
    })
