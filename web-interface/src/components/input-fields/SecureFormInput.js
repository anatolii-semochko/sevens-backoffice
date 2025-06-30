import React, { useState } from 'react'
import { CFormLabel, CFormInput, CInputGroup, CButton } from '@coreui/react'
import { FaLock, FaUnlock } from 'react-icons/fa'

const SecureFormInput = ({ label, value, onChange, type = 'text', ...props }) => {
  const [editable, setEditable] = useState(false)

  return (
    <div className="mb-3">
      {label && <CFormLabel>{label}</CFormLabel>}
      <CInputGroup>
        <CFormInput
          type={type}
          value={value}
          disabled={!editable}
          onChange={onChange}
          {...props}
        />
        <CButton
          type="button"
          color={editable ? 'danger' : 'success'}
          variant="outline"
          onClick={() => setEditable(!editable)}
          title="Unlock for editing"
        >
          {editable ? <FaUnlock /> : <FaLock />}
        </CButton>
      </CInputGroup>
    </div>
  )
}

export { SecureFormInput }
