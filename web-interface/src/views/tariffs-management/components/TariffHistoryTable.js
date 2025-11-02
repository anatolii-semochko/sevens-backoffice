import React, {useEffect, useState} from 'react'
import { formatedDateTime } from '@js/components/utils/DateTime'
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { FormattedSevens } from '@js/components/utils/Currency'
import { EmptyDataRow } from '@js/components/table/CustomTableElements'
import { PaginatorControls, PaginatorInfo } from '@js/components/table/Paginator'
import { UserAvatar } from '@js/components/table/UserAvatar'
import { Filter } from '@js/views/tariffs-management/components/TariffsManagementHeader'

export const TariffHistoryTable = ({items, totalItems, currentPage, setCurrentPage, setItemsFilter, loading}) => {
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState('last-month')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    setItemsFilter({page: currentPage, pageSize, filter, dateFrom, dateTo})
  }, [currentPage, pageSize, filter, dateFrom, dateTo])

  useEffect(() => {
    setItemsFilter({page: 1, pageSize, filter, dateFrom, dateTo})
  }, [])

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
        <Filter {...{filter, setFilter, dateFrom, setDateFrom, dateTo, setDateTo, setCurrentPage}} />
      </div>
      {loading ? (
        <EmptyDataRow loading={true} text={'Loading...'} />
      ) : !items.length ? (
        <EmptyDataRow text="No tariffs history" />
      ) : (
        <CTable striped hover responsive align={'middle'}>
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
              <CTableRow key={index}>
                <CTableDataCell>{formatedDateTime(item.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  <UserAvatar user={item.adminUser} showStatus={true} />
                  <span className="ms-3">{item.adminUser?.fullName}</span>
                </CTableDataCell>
                <CTableDataCell className={'text-primary'}>{item.buy}%</CTableDataCell>
                <CTableDataCell><FormattedSevens sevens={item.mint} /></CTableDataCell>
                <CTableDataCell><FormattedSevens sevens={item.setSale} /></CTableDataCell>
                <CTableDataCell><FormattedSevens sevens={item.burn} /></CTableDataCell>
                <CTableDataCell>
                  <small className="font-monospace text-break">{item.targetWallet}</small>
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
