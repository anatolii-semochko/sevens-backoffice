import api, { fetchErrorMessage } from './index'

const mainUrl = '/categories'

// export const fetchCategories = (criteria) => api
//   .get(mainUrl, criteria)
//   .then(res => res.data)

export const fetchCategories = (criteria) => {

  console.log({criteria})

  return api
    .get(mainUrl,{ params: criteria })
    .then(res => res.data)
}

export const fetchCategoryById = (id) => api
  .get(`${mainUrl}/${id}`)
  .then(res => res.data)

export const createCategory = (data) => api
  .post(mainUrl, data)

export const updateCategory = (id, data) => api
  .put(`${mainUrl}/${id}`, data)

export const patchCategory = (id, data) => api
  .patch(`${mainUrl}/${id}`, data)

export const deleteCategory = (id) => api
  .delete(`${mainUrl}/${id}`)

export const fetchError = (error) => fetchErrorMessage(error)
