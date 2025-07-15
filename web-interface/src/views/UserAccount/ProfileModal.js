import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormInput, CAlert } from '@coreui/react'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { LogoInput } from 'src/components/input-fields/LogoInput'

const ProfileModal = ({ visible, onClose, user, onSave }) => {
  const userAvatars = useSelector((state) => state.path.userAvatars)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState({
    loginName: user.loginName,
    email: user.email,
    password: '',
    confirmPassword: '',
    avatar: user.avatar,
  })

  useEffect(() => {
    setForm({
      loginName: user.loginName,
      email: user.email,
      password: '',
      confirmPassword: '',
      avatar: user.avatar,
    })
  }, [user, visible])

  const handleSave = () => {
    setErrorMessage(null)
    if (form.password !== form.confirmPassword) {
      return setErrorMessage('Password incorrect')
    }
    onSave(form)
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>Profile</CModalHeader>
      <CModalBody>
        <SecureFormInput
          label="User Name"
          value={form.loginName}
          onChange={(e) => setForm({ ...form, loginName: e.target.value })}
        />
        <CFormInput
          type="password"
          className="mb-3"
          label="Password"
          placeholder="Change current password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {form.password &&
          <CFormInput
            type="password"
            className="mb-3"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        }
        <CFormInput
          label="Email"
          className="mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <LogoInput
          path={userAvatars}
          prefix={'large-'}
          value={form.avatar}
          onChange={(v) => setForm({ ...form, avatar: v })}
        />
        {errorMessage && (
          <CAlert color="danger" className="show mb-0 mt-3">
            {errorMessage}
          </CAlert>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ProfileModal
