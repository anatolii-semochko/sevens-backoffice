import React, { useState, useEffect } from 'react'
import { roles, AccessDeniedBlock } from 'src/components/utils/Permissions'
import { fetchTariffHistory, fetchError } from 'src/api/tariff-history'
import { fetchCurrentTariffs } from 'src/api/tariffs'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { TariffHistoryTable } from '@js/views/tariffs-management/components/TariffHistoryTable'
import { EditTariffModal } from '@js/views/tariffs-management/components/TariffForm'
import { CurrentTariffs } from '@js/views/tariffs-management/components/TariffsManagementHeader'

const TariffsManagement = () => {
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsFilter, setItemsFilter] = useState({})
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentTariffs, setCurrentTariffs] = useState(null)
  const [error, setError] = useState(null)

  if (!roles().admin) {
    return <AccessDeniedBlock />
  }

  const loadCurrentTariffs = async () => {
    try {
      const tariffs = await fetchCurrentTariffs()
      setCurrentTariffs(tariffs)
    } catch (error) {
      console.error('Failed to load current tariffs:', error)
    }
  }

  useEffect(() => {
    loadCurrentTariffs().catch(setError)
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await fetchTariffHistory(itemsFilter)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadHistory().catch(setError)
  }, [itemsFilter])

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Sevens Token Management</h4>
            <CButton color="primary" onClick={() => setShowEditModal(true)}>
              Set Tariffs
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
        <CurrentTariffs currentTariffs={currentTariffs} />
        <TariffHistoryTable {...{items, totalItems, currentPage, setCurrentPage, setItemsFilter, loading}} />
        </CCardBody>
      </CCard>

      <EditTariffModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={async () => {
          await loadCurrentTariffs()
          if (currentPage === 1) {
            await loadHistory()
          } else {
            setCurrentPage(1)
          }
        }}
        initialData={currentTariffs}
      />
    </>
  )
}

export default TariffsManagement
