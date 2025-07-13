import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ProfileModal from 'src/views/UserAccount/ProfileModal'

const AppHeaderDropdown = () => {


  const [profileVisible, setProfileVisible] = useState(false)
  const [user, setUser] = useState({ email: 'test@example.com', avatar: '' }) // або отримати з API/store

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


  const logout = () => console.log('logout')

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src="" size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem className="cursor-pointer" onClick={() => window.dispatchEvent(new Event('openProfile'))}>
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
