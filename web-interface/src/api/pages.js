import api from './index'
import apiTest from './index-test'

export const fetchPages = () => apiTest.get('/pages').then(res => res.data)

export const fetchPageById = (id) => apiTest.get(`/pages/${id}`).then(res => res.data)

export const createPage = (data) => apiTest.post('/pages', data)

export const updatePage = (id, data) => apiTest.put(`/pages/${id}`, data)

export const patchPage = (id, data) => apiTest.patch(`/pages/${id}`, data)

export const deletePage = (id) => apiTest.delete(`/pages/${id}`)

apiTest.setItems('pages', [
  {
    id: '11111',
    url: '/',
  },
  {
    id: '2222222',
    url: '/page',
  },
  {
    id: '3333333',
    url: '/token',
  },
])
