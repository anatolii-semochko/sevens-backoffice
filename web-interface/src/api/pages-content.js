import api from './index'
import apiTest from './index-test'

const mainUrl = '/pages-content'
export const fetchContent = () => apiTest.get(mainUrl).then(res => res.data)

export const fetchContentById = (id) => apiTest.get(`${mainUrl}/${id}`).then(res => res.data)

export const createContent = (data) => apiTest.post(mainUrl, data)

export const updateContent = (id, data) => apiTest.put(`${mainUrl}/${id}`, data)

export const patchContent = (id, data) => apiTest.patch(`${mainUrl}/${id}`, data)

export const deleteContent = (id) => apiTest.delete(`${mainUrl}/${id}`)

apiTest.setItems('pages-content', [
  {
    id: '11111',
    term: 'materials-description',
    page: {
      id: '11111',
      url: '/',
    },
    translations: {
      '11111': 'Materials description English',
      '22222': 'Materials description German',
      '44444': 'Materials description French',
    },
  },
  {
    id: '2222222',
    term: 'material-description',
    page: {
      id: '2222222',
      url: '/page',
    },
    translations: {
      '11111': 'Material description English',
      '22222': 'Material description German',
      '44444': 'Material description French',
    },
  },
  {
    id: '3333333',
    term: 'material-conditions',
    page: {
      id: '2222222',
      url: '/page',
    },
    translations: {
      '11111': 'Material conditions English',
      '22222': 'Material conditions German',
      '44444': 'Material conditions French',
    },
  },
])
