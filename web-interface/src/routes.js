import React from 'react'

const Languages  = React.lazy(() => import('./views/base-elements/Languages'));
const Users  = React.lazy(() => import('./views/base-elements/Users'));
const Pages  = React.lazy(() => import('./views/content/Pages'));
const PagesContent  = React.lazy(() => import('./views/content/PagesContent'));
const Categories  = React.lazy(() => import('./views/base-elements/Categories'));
const Help  = React.lazy(() => import('./views/content/Help'));

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/content', name: 'Content', element: Users, exact: true },
  { path: '/languages', name: 'Languages', element: Languages },
  { path: '/users', name: 'Users', element: Users },
  { path: '/content/pages', name: 'Pages', element: Pages },
  { path: '/content/pages-content', name: 'Pages', element: PagesContent },
  { path: '/categories', name: 'Pages', element: Categories },
  { path: '/content/help', name: 'Help', element: Help },
]

export default routes
