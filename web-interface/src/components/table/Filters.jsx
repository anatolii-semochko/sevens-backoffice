import React, { useEffect, useState } from 'react'
import { CCol, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { CDateRangePicker } from '@coreui/react-pro'

/**
 * Universal inline date range filter component
 *
 * @param {Object} props
 * @param {string} props.propertyName - Property name to send to the server for filtering
 * @param {function} props.onChange - Callback function that receives filter parameters {filter, dateFrom, dateTo, propertyName}
 * @param {string} props.defaultFilter - Default filter option (default: 'this-month')
 * @param {string} props.label - Label for the filter (default: 'Filter:')
 * @returns {JSX.Element}
 */
export const DateRangeFilter = ({
  propertyName = 'createdAt',
  onChange,
  defaultFilter = 'this-month',
  label = 'Filter:',
}) => {
  const [filter, setFilter] = useState(defaultFilter)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [initialized, setInitialized] = useState(false)

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Convert YYYY-MM-DD to YYYY/MM/DD for CDateRangePicker
  const toPickerFormat = (dateStr) => {
    return dateStr ? dateStr.replace(/-/g, '/') : null
  }

  // Calculate date ranges based on filter selection
  const calculateDateRange = (filterType) => {
    const now = new Date()

    switch (filterType) {
      case 'today':
        return {
          from: formatDate(now),
          to: formatDate(now)
        }

      case 'last-day':
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return {
          from: formatDate(yesterday),
          to: formatDate(now)
        }

      case 'this-week':
        const dayOfWeek = now.getDay()
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const monday = new Date(now)
        monday.setDate(monday.getDate() - daysFromMonday)
        return {
          from: formatDate(monday),
          to: formatDate(now)
        }

      case 'last-week':
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return {
          from: formatDate(weekAgo),
          to: formatDate(now)
        }

      case 'this-month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          from: formatDate(monthStart),
          to: formatDate(now)
        }

      case 'last-month':
        const monthAgo = new Date(now)
        monthAgo.setDate(monthAgo.getDate() - 30)
        return {
          from: formatDate(monthAgo),
          to: formatDate(now)
        }

      case 'not-limited':
        return {
          from: '',
          to: ''
        }

      case 'custom':
      default:
        return {
          from: dateFrom,
          to: dateTo
        }
    }
  }

  // Handle filter selection change
  const handleFilterChange = (e) => {
    const value = e.target.value
    setFilter(value)

    if (value !== 'custom') {
      const { from, to } = calculateDateRange(value)
      setDateFrom(from)
      setDateTo(to)
    }
  }

  // Handle date range picker change
  const handleDateChange = (type, date) => {
    if (date) {
      const parsedDate = new Date(date)
      if (type === 'start') {
        setDateFrom(formatDate(parsedDate))
      } else {
        setDateTo(formatDate(parsedDate))
      }
      setFilter('custom')
    }
  }

  // Initialize dates on mount
  useEffect(() => {
    if (!initialized) {
      const { from, to } = calculateDateRange(defaultFilter)
      setDateFrom(from)
      setDateTo(to)
      setInitialized(true)
    }
  }, [])

  // Notify parent component about changes
  useEffect(() => {
    if (onChange && initialized) {
      onChange({
        filter,
        dateFrom,
        dateTo,
        propertyName,
      })
    }
  }, [filter, dateFrom, dateTo, propertyName, initialized])

  return (
    <CRow className="align-items-center g-2">
      <CCol xs="auto">
        <CFormLabel className="me-2 mb-0">{label}</CFormLabel>
      </CCol>
      <CCol xs="auto">
        <CFormSelect
          value={filter}
          onChange={handleFilterChange}
          className="form-select-sm"
          style={{ minWidth: '150px' }}
        >
          <option value="today">Today</option>
          <option value="last-day">Last Day</option>
          <option value="this-week">This Week</option>
          <option value="last-week">Last Week</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="custom">Custom Period</option>
          <option value="not-limited">Not Limited</option>
        </CFormSelect>
      </CCol>
      {filter === 'custom' && (
        <CCol xs="auto">
          <CDateRangePicker
            startDate={toPickerFormat(dateFrom)}
            endDate={toPickerFormat(dateTo)}
            locale="en-GB"
            onStartDateChange={(date) => handleDateChange('start', date)}
            onEndDateChange={(date) => handleDateChange('end', date)}
            size="sm"
          />
        </CCol>
      )}
    </CRow>
  )
}
