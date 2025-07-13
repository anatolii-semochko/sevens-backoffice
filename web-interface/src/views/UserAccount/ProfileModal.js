import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { LogoInput } from 'src/components/input-fields/LogoInput'

const ProfileModal = ({ visible, onClose, user, onSave }) => {
  const [form, setForm] = React.useState({
    email: user.email,
    password: '',
    avatar: user.avatar,
  })

  const handleSave = () => {
    onSave(form)
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>Profile</CModalHeader>
      <CModalBody>
        <SecureFormInput label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <SecureFormInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <LogoInput value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        <CButton color="primary" onClick={handleSave}>Save</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ProfileModal
