import React, { useEffect, useState } from 'react'
import TokenManagementApi from '@js/api/tokenManagementApi'
import { formatedDateTime } from 'src/components/utils/DateTime'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCardBody,
  CButton,
} from '@coreui/react'
import { TfiReload } from 'react-icons/tfi'
import { $Sevens, $Usd } from '@js/components/utils/Currency'
import { EmptyDataRow } from 'src/components/table/CustomTableElements'
import { PaginatorControls, PaginatorInfo } from 'src/components/table/Paginator'
import { DateRangeFilter } from '@js/components/table/Filters'

const tokenManagementApi = new TokenManagementApi()

const TokenTransactions = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [totalItems, setTotalItems] = useState(0)
  const [incomeSum, setIncomeSum] = useState(0)
  const [filterParams, setFilterParams] = useState(null)

  const fetchData = async () => {
    // Only load if filterParams is initialized
    if (filterParams === null) {
      return
    }

    try {
      setLoading(true)
      const data = await tokenManagementApi.fetchTokenTransactions({
        page: currentPage,
        pageSize,
        ...filterParams
      })
      setItems(Array.isArray(data.items) ? data.items : [])
      setTotalItems(data.total || 0)
      setIncomeSum(data.incomeSum || 0)
    } catch (error) {
      window.toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData().catch()
  }, [currentPage, pageSize, filterParams])

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Token Transactions</h4>
        <div className="d-flex gap-2 align-items-center">
          <div className="me-3 fw-bold">
            <strong className="me-2">Total Income:</strong>
            <$Sevens sevens={incomeSum} label color bold /> - <$Usd sevens={incomeSum} label color bold />
          </div>
          <CButton size="sm" className={'btn-warning btn-sm px-4'} title="Reload" onClick={() => fetchData()}>
            <TfiReload />
          </CButton>
        </div>
      </div>
      <CCardBody>
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
          <EmptyDataRow text="No transactions found" />
        ) : (
          <TransactionTable items={items} />
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
      </CCardBody>
    </div>
  )
}

const TransactionTable = ({items}) => {
  const types = {
    'token-mint': 'Mint',
    'token-sale': 'Sale',
    'token-buy': 'Buy',
    'token-burn': 'Burn',
  }

  return (
    <CTable className="no-border-last" hover responsive align={'middle'}>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Date</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
          <CTableHeaderCell>User</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Token</CTableHeaderCell>
          <CTableHeaderCell>Target Wallet</CTableHeaderCell>
          <CTableHeaderCell>Income</CTableHeaderCell>
          <CTableHeaderCell>Balance</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {items.map((item, index) => (
          <CTableRow key={index}>
            <CTableDataCell>{formatedDateTime(item.createdAt)}</CTableDataCell>
            <CTableDataCell>
              <span className="text-primary">{types[item.type]}</span>
            </CTableDataCell>
            <CTableDataCell>
              {item.user ? (
                <span>{item.user?.firstName} {item.user?.lastName}</span>
              ) : (
                <span className="text-muted">-</span>
              )}
            </CTableDataCell>
            <CTableDataCell>
              {item.user ? (
                <span>{item.user?.email}</span>
              ) : (
                <span className="text-muted">-</span>
              )}
            </CTableDataCell>
            <CTableDataCell>
              {item.token ? (
                <small className="font-monospace text-break">{item.token}</small>
              ) : (
                <span className="text-muted">-</span>
              )}
            </CTableDataCell>
            <CTableDataCell>
              <small className="font-monospace text-break">{item.targetWallet}</small>
            </CTableDataCell>
            <CTableDataCell><$Sevens sevens={item.income} color /></CTableDataCell>
            <CTableDataCell><$Sevens sevens={item.targetWalletBalance} color /></CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default TokenTransactions
