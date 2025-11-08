import React, { useEffect, useState } from 'react'
import { formatedDateTime } from '@js/components/utils/DateTime'
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { $Sevens } from '@js/components/utils/Currency'
import { EmptyDataRow } from '@js/components/table/CustomTableElements'
import { PaginatorControls, PaginatorInfo } from '@js/components/table/Paginator'
import { UserAvatar } from '@js/components/table/UserAvatar'
import { DateRangeFilter } from '@js/components/table/Filters'

export const TariffHistoryTable = ({items, totalItems, currentPage, setCurrentPage, setItemsFilter, loading}) => {
  const [pageSize, setPageSize] = useState(20)
  const [filterParams, setFilterParams] = useState(null)

  useEffect(() => {
    if (filterParams !== null) {
      setItemsFilter({page: currentPage, pageSize, ...filterParams})
    }
  }, [currentPage, pageSize, filterParams])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <PaginatorInfo
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
        />
        <DateRangeFilter
          propertyName="createdAt"
          defaultFilter="this-month"
          onChange={(params) => {
            setFilterParams(params)
            setCurrentPage(1)
          }}
        />
      </div>
      {loading ? (
        <EmptyDataRow loading={true} text={'Loading...'} />
      ) : !items.length ? (
        <EmptyDataRow text="No tariffs history" />
      ) : (
        <CTable hover responsive align={'middle'}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Operator</CTableHeaderCell>
              <CTableHeaderCell scope="col">Buy (%)</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mint Fee</CTableHeaderCell>
              <CTableHeaderCell scope="col">Set Buy</CTableHeaderCell>
              <CTableHeaderCell scope="col">Burn Fee</CTableHeaderCell>
              <CTableHeaderCell scope="col">Target Wallet</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item, index) => (
              <CTableRow key={index} className={item.paused ? 'child-background-danger' : ''}>
                <CTableDataCell >{formatedDateTime(item.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  <UserAvatar user={item.adminUser} showStatus={true} />
                  <span className="ms-3">{item.adminUser?.fullName}</span>
                </CTableDataCell>
                <CTableDataCell className={'text-primary'}>{item.buy}%</CTableDataCell>
                <CTableDataCell><$Sevens sevens={item.mint} color /></CTableDataCell>
                <CTableDataCell><$Sevens sevens={item.setSale} color /></CTableDataCell>
                <CTableDataCell><$Sevens sevens={item.burn} color /></CTableDataCell>
                <CTableDataCell>
                  <small className="font-monospace text-break">
                    {item.paused ? 'Token operations on pause' : item.targetWallet}
                  </small>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
      {!loading && items.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <PaginatorControls
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
