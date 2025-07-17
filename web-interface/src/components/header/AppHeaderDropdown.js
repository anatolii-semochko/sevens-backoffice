import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout as apiLogout } from 'src/api/auth'
import { fetchCurrentUser, updateUserProfile, fetchError } from 'src/api/users'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ProfileModal from 'src/views/UserAccount/ProfileModal'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { UserAvatar } from 'src/components/table/UserAvatar'

const AppHeaderDropdown = () => {
  const [profileVisible, setProfileVisible] = useState(false)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const openModal = () => setProfileVisible(true)
    window.addEventListener('openProfile', openModal)
    return () => window.removeEventListener('openProfile', openModal)
  }, [])

  const handleSaveProfile = async (formData) => {
    try {
      await updateUserProfile(formData)
      const updated = await fetchCurrentUser()
      dispatch({ type: 'set', user: updated })
      setProfileVisible(false)
      if (formData.password) {
        await logout()
      }
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const logout = async () => {
    await apiLogout()
    window.location.replace('/login')
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          {user && <UserAvatar user={user} size={'md'} />}
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem
            className="cursor-pointer"
            onClick={() => window.dispatchEvent(new Event('openProfile'))}
          >
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem className="cursor-pointer" onClick={() => logout()}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  )
}

export default AppHeaderDropdown
