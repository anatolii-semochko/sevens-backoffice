import React, { useEffect, useState } from 'react'
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
import { EmptyDataRow } from 'src/components/table/CustomTableElements'
import { PaginatorControls, PaginatorInfo } from 'src/components/table/Paginator'
import { UserAvatar } from 'src/components/table/UserAvatar'
import { fetchTokenTransactions, fetchError } from 'src/api/tokenManageApi'
import {FormattedSevens} from "@js/components/utils/Currency";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";

const TokenTransactions = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [totalItems, setTotalItems] = useState(0)
  const [incomeSum, setIncomeSum] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await fetchTokenTransactions({ page: currentPage, pageSize })
      setItems(Array.isArray(data.items) ? data.items : [])
      setTotalItems(data.total || 0)
      setIncomeSum(data.incomeSum || 0)
    } catch (error) {
      window.toast.error(fetchError(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  const formatNumber = (value) => {
    if (!value && value !== 0) return '0.000000000'
    return parseFloat(value).toFixed(9)
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Token Transactions</h4>
        <div className="d-flex gap-2 align-items-center">
          <div className="me-3 fw-bold">
            <strong className="me-2">Total Income:</strong>
            <FormattedSevens lamports={incomeSum * LAMPORTS_PER_SOL} showUsd={true} />
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
        </div>
        {loading ? (
          <EmptyDataRow loading={true} text={'Loading...'} />
        ) : !items.length ? (
          <EmptyDataRow text="No transactions found" />
        ) : (
          <CTable className="no-border-last" striped hover responsive align={'middle'}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">User</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Token</CTableHeaderCell>
                <CTableHeaderCell scope="col">Target Wallet</CTableHeaderCell>
                <CTableHeaderCell scope="col">Income</CTableHeaderCell>
                <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{formatedDateTime(item.createdAt)}</CTableDataCell>
                  <CTableDataCell>
                    <span className="text-primary fw-bold">{item.type}</span>
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
                  <CTableDataCell>{formatNumber(item.income)}</CTableDataCell>
                  <CTableDataCell>{formatNumber(item.targetWalletBalance)}</CTableDataCell>
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
      </CCardBody>
    </div>
  )
}

export default TokenTransactions
