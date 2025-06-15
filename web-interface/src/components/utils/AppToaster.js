import React, { useEffect, useState } from 'react'
import { CToast, CToastHeader, CToastBody, CToaster } from '@coreui/react'

const AppToaster = () => {
  const [toasts, setToasts] = useState([]) // масив React-елементів

  useEffect(() => {
    window.toast = {
      success: (msg) => show(msg, 'success', 'Success'),
      error: (msg) => show(msg, 'danger', 'Error'),
      info: (msg) => show(msg, 'info', 'Info'),
      warn: (msg) => show(msg, 'warning', 'Warning'),
    }
  }, [])

  const show = (message, color = 'info', title = 'Info') => {
    const id = Date.now() + Math.random()
    const newToast = (
      <CToast
        key={id}
        color={color}
        autohide={true}
        delay={5000}
        onClose={() => removeToast(id)}
      >
        <CToastHeader closeButton>
          <strong className="me-auto">{title}</strong>
          <small>now</small>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.key !== id.toString()))
  }

  return (
    <CToaster placement="top-end" className="p-3">
      {toasts.map((toast) =>
        React.cloneElement(toast, { visible: true })
      )}
    </CToaster>
  )
}

export { AppToaster }
