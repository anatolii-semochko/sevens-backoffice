import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { FormattedSevens } from '@js/components/utils/Currency'


export const Filter = ({filter, setFilter, dateFrom, setDateFrom, dateTo, setDateTo, setCurrentPage}) => {
  const handleFilterChange = (e) => {
    const value = e.target.value
    setFilter(value)
    setCurrentPage(1)

    // Clear custom dates when predefined filter is selected
    if (value !== 'custom') {
      setDateFrom('')
      setDateTo('')
    }
  }

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value)
    setFilter('custom')
    setCurrentPage(1)
  }

  const handleDateToChange = (e) => {
    setDateTo(e.target.value)
    setFilter('custom')
    setCurrentPage(1)
  }

  return (
    <CRow className="align-items-center g-3">
      <CCol xs="auto">
        <CFormLabel className="me-2 mb-0">Filter:</CFormLabel>
      </CCol>
      <CCol xs="auto">
        <CFormSelect
          value={filter}
          onChange={handleFilterChange}
          className={'form-select-sm'}
        >
          <option value="last-day">Last Day</option>
          <option value="last-week">Last Week</option>
          <option value="last-month">Last Month</option>
          <option value="last-year">Last Year</option>
          <option value="custom">Custom Period</option>
        </CFormSelect>
      </CCol>
      {filter === 'custom' && (
        <>
          <CCol xs="auto">
            <CFormLabel className="me-2 mb-0">Date From:</CFormLabel>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              className={'form-control-sm'}
            />
          </CCol>
          <CCol xs="auto">
            <CFormLabel className="me-2 mb-0">Date To:</CFormLabel>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
              className={'form-control-sm'}
            />
          </CCol>
        </>
      )}
    </CRow>
  )
}

export const CurrentTariffs = ({currentTariffs}) => currentTariffs && (
  <CRow className="mb-3">
    <CCol>
      <CCard className="border-primary">
        <CCardHeader className="bg-light">
          <strong>Current Tariffs</strong>
        </CCardHeader>
        <CCardBody className={'fw-bold d-grid gap-2'} style={{gridTemplateColumns: 'auto 1fr'}}>

          <div>Sale token operation fee:</div>
          <div className="text-primary ms-3">{currentTariffs.buy}%</div>

          <div>Mint token fee:</div>
          <div className="ms-3">
            <FormattedSevens sevens={currentTariffs.mint} showUsd={true} />
          </div>

          <div>Set token for sale operation fee:</div>
          <div className="ms-3">
            <FormattedSevens sevens={currentTariffs.setSale} showUsd={true} />
          </div>

          <div>Burn token operation fee:</div>
          <div className="ms-3">
            <FormattedSevens sevens={currentTariffs.burn} showUsd={true} />
          </div>

          <div>Target wallet for fees income:</div>
          <div className="text-primary ms-3">{currentTariffs.targetWallet}</div>

        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
)
