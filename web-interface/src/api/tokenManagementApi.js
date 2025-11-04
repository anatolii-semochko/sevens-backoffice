import api, { throwErrorMessage } from './index'

const mainUrl = '/token-management'

export default class TokenManagementApi {
  async fetchCurrentTariffs(criteria) {
    return await api
      .get(mainUrl + '/current-tariffs', {params: criteria})
      .then(res => res.data)
      .catch(throwErrorMessage)
  }

  async fetchTariffHistory(criteria) {
    return await api
      .get(mainUrl + '/tariffs-history', {params: criteria})
      .then(res => res.data)
      .catch(throwErrorMessage)
  }

  async getTariffTransaction(data) {
    return api
      .post(mainUrl + '/get-tariffs-transaction', data)
      .then(res => res.data)
      .catch(throwErrorMessage)
  }

  async postTariffTransaction(data) {
    return api
      .post(mainUrl + `/post-tariffs-transaction`, data)
      .then(res => res.data)
      .catch(throwErrorMessage)
  }

  async fetchTokenTransactions(criteria) {
    return api
      .get(mainUrl + '/token-transactions', { params: criteria })
      .then(res => res.data)
      .catch(throwErrorMessage)
  }
}
