import React from 'react'
import { CAvatar } from '@coreui/react'
import { useSelector } from 'react-redux'

const UserAvatar = ({
  user,
  size = null,
  showStatus = false
}) => {
  const userAvatars = useSelector((state) => state.path.userAvatars)

  const getInitials = (fullName) => fullName ? fullName
    .split(' ')
    .filter(fullName => fullName.length > 0)
    .map(fullName => fullName[0].toUpperCase())
    .join('') : null

  const status = showStatus ? (user.active ? 'success' : 'danger') : null

  return user.avatar ? (
      <CAvatar
        size={size}
        src={userAvatars + 'small-' + user.avatar}
        title={user.fullName}
        status={status}
      />
    ) : (
      <CAvatar size={size} title={user.fullName} status={status} >
        {getInitials(user.fullName)}
      </CAvatar>
    )
}

export { UserAvatar }
