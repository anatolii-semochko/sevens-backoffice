import api from './index'
import apiTest from './index-test'

export const fetchLanguages = () => apiTest.get(`/languages`).then(res => res.data)

export const fetchLanguageById = (id) => apiTest.get(`/languages/${id}`).then(res => res.data)

export const createLanguage = (data) => apiTest.post('/languages', data)

export const updateLanguage = (id, data) => api.put(`/languages/${id}`, data)

export const patchLanguage = (id, data) => apiTest.patch(`/languages/${id}`, data)

export const deleteLanguage = (id) => apiTest.delete(`/languages/${id}`)

apiTest.setItems('languages', [
  {
    id: '11111',
    code: 'us',
    name: 'English',
    active: 1,
    main: 1,
  },
  {
    id: '22222',
    code: 'de',
    name: 'German',
    active: 1,
    main: 0,
  },
  {
    id: '33333',
    code: 'es',
    name: 'Spanish',
    active: 0,
    main: 0,
  },
  {
    id: '44444',
    code: 'fr',
    name: 'French',
    active: 1,
    main: 0,
  },
])
