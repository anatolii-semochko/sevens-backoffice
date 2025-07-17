import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilFlagAlt,
  cilLibrary,
  cilFork,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Base elements',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Languages',
    to: '/languages',
    icon: <CIcon icon={cilFlagAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/categories',
    icon: <CIcon icon={cilFork} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Content',
  },
  {
    component: CNavGroup,
    name: 'Pages Content',
    to: '/content',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pages and SEO',
        to: '/content/pages',
      },
      // { // TODO - This page has to be adapted to Symfony translations or removed
      //   component: CNavItem,
      //   name: 'Terms and Translations',
      //   to: '/content/pages-content',
      // },
      {
        component: CNavItem,
        name: 'Help Section',
        to: '/content/help',
      },
    ],
  },
]

export default _nav
