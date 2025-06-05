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
    breadcrumbs: {
      '11111': 'Breadcrumbs English',
      '22222': 'Breadcrumbs German',
      '33333': 'Breadcrumbs Spanish',
    },
    title: {
      '11111': 'Title English',
      '22222': 'Title German',
      '33333': 'Title Spanish',
    },
    keywords: {
      '11111': 'Keywords English',
      '22222': 'Keywords German',
      '33333': 'Keywords Spanish',
    },
    description: {
      '11111': 'Description English',
      '22222': 'Description German',
      '33333': 'Description Spanish',
    },
  },
  {
    id: '2222222',
    url: '/page',
    breadcrumbs: {
      '11111': 'Breadcrumbs English',
      '22222': 'Breadcrumbs German',
      '33333': 'Breadcrumbs Spanish',
    },
    title: {
      '11111': 'Title English',
      '22222': 'Title German',
      '33333': 'Title Spanish',
    },
    keywords: {
      '11111': 'Keywords English',
      '22222': 'Keywords German',
      '33333': 'Keywords Spanish',
    },
    description: {
      '11111': 'Description English',
      '22222': 'Description German',
      '33333': 'Description Spanish',
    },
  },
  {
    id: '3333333',
    url: '/token',
    breadcrumbs: {
      '11111': 'Breadcrumbs English',
      '22222': 'Breadcrumbs German',
      '33333': 'Breadcrumbs Spanish',
    },
    title: {
      '11111': 'Title English',
      '22222': 'Title German',
      '33333': 'Title Spanish',
    },
    keywords: {
      '11111': 'Keywords English',
      '22222': 'Keywords German',
      '33333': 'Keywords Spanish',
    },
    description: {
      '11111': 'Description English',
      '22222': 'Description German',
      '33333': 'Description Spanish',
    },
  },
])
