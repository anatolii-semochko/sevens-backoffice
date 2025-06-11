import React, { useEffect, useState, useRef } from 'react'
import { CFormLabel, CFormInput, CButton } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilX } from '@coreui/icons'

const LogoInput = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value)
    } else if (value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onChange(file)
    }
  }

  const handleClear = () => {
    fileInputRef.current.value = ''
    onChange(null)
  }

  return (
    <div className="mb-3">
      <CFormLabel>Logo</CFormLabel>
      <div className="input-group">
        <CFormInput
          type="file"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
        />
        {preview && (
          <CButton
            type="button"
            color="danger"
            onClick={handleClear}
            className="input-group-text"
            style={{ padding: '0.375rem 0.75rem' }}
          >
            <CIcon icon={cilX} />
          </CButton>
        )}
      </div>
      {preview && (
        <div className="mt-2 border-light">
          <img
            src={preview}
            alt="Logo preview"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </div>
      )}
    </div>
  )
}

export { LogoInput }
