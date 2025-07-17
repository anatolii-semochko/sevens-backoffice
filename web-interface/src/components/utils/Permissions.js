import React from 'react'
import { useSelector } from 'react-redux'
import { CAlert } from '@coreui/react'

const roles = () => {
  const roles = useSelector(state => state.user?.roles || [])
  return {
    superAdmin: roles.includes('ROLE_SUPER_ADMIN'),
    admin: roles.includes('ROLE_ADMIN'),
    user: roles.includes('ROLE_USER'),
    moderator: roles.includes('ROLE_MODERATOR'),
    editor: roles.includes('ROLE_EDITOR'),
    manager: roles.includes('ROLE_MANAGER'),
    customerSupport: roles.includes('ROLE_CUSTOMER_SUPPORT'),
  }
}

const AccessDeniedBlock = ({
 message = 'Access Denied',
 className = 'mb-3',
}) => {
  return (
    <CAlert color="danger" className={className}>{message}</CAlert>
  )
}

export { roles, AccessDeniedBlock }
