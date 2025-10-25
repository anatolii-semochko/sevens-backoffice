import React, { useEffect } from 'react'
import store from '../store'
import { fetchCurrentUser, fetchRolesList } from '../api/users'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  useEffect(() => {
    if (!store.getState().user.id) {
      fetchCurrentUser()
        .then((user) => store.dispatch({ type: 'set', user }))
        .catch(() => {})
      fetchRolesList()
        .then((userRoles) => store.dispatch({ type: 'set', userRoles }))
        .catch(() => {})
    }
  }, [])
  return (
    <div>
      <AppSidebar/>
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader/>
        <div className="body flex-grow-1">
          <AppContent/>
        </div>
        <AppFooter/>
      </div>
      <div id="wallet-panel" className="right-slide-panel"></div>
    </div>
  )
}

export default DefaultLayout
