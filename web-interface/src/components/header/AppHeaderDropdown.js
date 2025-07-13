import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { logout as apiLogout } from 'src/api/auth'
import { CDropdown, CDropdownDivider, CDropdownHeader, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { UserAvatar } from 'src/components/table/UserAvatar'
import ProfileModal from 'src/views/UserAccount/ProfileModal'

const AppHeaderDropdown = () => {
  const [profileVisible, setProfileVisible] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const openModal = () => setProfileVisible(true)
    window.addEventListener('openProfile', openModal)
    return () => window.removeEventListener('openProfile', openModal)
  }, [])

  const handleSaveProfile = (formData) => {
    console.log('Saving profile:', formData)
    // API call here
    setProfileVisible(false)
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
