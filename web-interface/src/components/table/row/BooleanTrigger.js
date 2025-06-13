import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

const BooleanTrigger = ({
  item,
  isActive,
  onToggle,
  className = '',
  title = 'Toggle status',
}) => {
  const active = typeof isActive === 'function' ? isActive(item) : Boolean(isActive)

  const handleClick = async () => {
    try {
      await onToggle(item)
    } catch (error) {
      window.toast?.error?.(error.message || 'Error while toggling')
    }
  }

  return (
    <div className={`row-cell-center-50 ${className}`}>
      <CIcon
        icon={active ? cilCheckCircle : cilXCircle}
        className={active ? 'text-success' : 'text-danger'}
        title={title}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )
}

export { BooleanTrigger }
