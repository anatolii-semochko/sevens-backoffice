import api from './index'
import apiTest from './index-test'

export const fetchUsers = () => apiTest.get('/users').then(res => res.data)

export const fetchUserById = (id) => apiTest.get(`/users/${id}`).then(res => res.data)

export const createUser = (data) => apiTest.post('/users', data)

export const updateUser = (id, data) => apiTest.put(`/users/${id}`, data)

export const patchUser = (id, data) => apiTest.patch(`/users/${id}`, data)

export const deleteUser = (id) => apiTest.delete(`/users/${id}`)

apiTest.setItems('users', [
  {
    id: '11111',
    name: 'Anatolii',
    lastName: 'Semochko',
    email: 'test@test.com',
    avatar: '6.jpg',
    active: 1,
    created: '2002-12-12 10:10:10',
    updated: '2003-12-12 10:10:10',
  },
  {
    id: '2222222',
    name: 'Ali',
    lastName: 'Baba',
    email: 'ali@test.com',
    avatar: '7.jpg',
    active: 1,
    created: '2002-12-12 10:10:10',
    updated: '2003-12-12 10:10:10',
  },
  {
    id: '33333333',
    name: 'Tom',
    lastName: 'Cruse',
    email: 'tom@test.com',
    avatar: '8.jpg',
    active: 0,
    created: '2002-12-12 10:10:10',
    updated: '2003-12-12 10:10:10',
  },
])
