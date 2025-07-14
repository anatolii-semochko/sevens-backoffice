import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import store from '../store'
import { fetchCurrentUser } from '../api/users'

const DefaultLayout = () => {
  useEffect(() => {
    if (!store.getState().user.id) {
      fetchCurrentUser()
        .then((user) => store.dispatch({ type: 'set', user }))
        .catch(() => {})
    }
  }, [])
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
