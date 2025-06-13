import React, { useEffect, useState, useRef } from 'react'
import { CFormLabel, CFormInput, CButton, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'

const LogoInput = ({ path = '', value, onChange, maxSize = 1024 }) => {
  const [initialValue, setInitialValue] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialValue === null && typeof value === 'string') {
      setInitialValue(value)
    }

    if (typeof value === 'string') {
      if (value.startsWith('data:')) {
        setPreview(value)
      } else {
        setPreview(path + value)
      }
    } else if (typeof value === 'object' && value !== null) {
      setPreview(value)
    } else {
      setPreview(null)
    }

    setError(null) // clear error on value change
  }, [value, path, initialValue])

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > maxSize * 1024) {
        setError(`File is too large, max size is ${maxSize} KB`)
        fileInputRef.current.value = ''
        return
      }
      const base64 = await fileToBase64(file)
      if (initialValue && base64 === initialValue) {
        onChange(initialValue)
      } else {
        onChange(base64)
      }
    }
  }

  const handleClear = () => {
    fileInputRef.current.value = ''
    setPreview(null)
    setError(null)
    onChange(false)
  }

  return (
    <div className="mb-3 logo-input">
      <CFormLabel>Logo</CFormLabel>
      <div className="input-group">
        <CFormInput
          type="file"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
          disabled={!!preview}
        />
        {preview && (
          <CButton
            type="button"
            color="danger"
            onClick={handleClear}
            className="input-group-text"
          >
            <CIcon icon={cilX} />
          </CButton>
        )}
      </div>
      {error && (
        <CAlert color="danger" className="show mb-0 mt-3">{error}</CAlert>
      )}
      {preview && (
        <div className="mt-3 d-flex justify-content-center">
          <img
            src={preview}
            alt="Logo preview"
          />
        </div>
      )}
    </div>
  )
}

export { LogoInput }
