import React, { useState, useEffect } from 'react'
import TokenManagementApi from '@js/api/tokenManagementApi'
import { roles, AccessDeniedBlock } from 'src/components/utils/Permissions'
import { CButton, CCardBody } from '@coreui/react'
import { TariffHistoryTable } from '@js/views/tariffs-management/components/TariffHistoryTable'
import { EditTariffModal } from '@js/views/tariffs-management/components/TariffForm'
import { CurrentTariffs } from '@js/views/tariffs-management/components/TariffsManagementHeader'

const tokenManagementApi = new TokenManagementApi()

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
      const tariffs = await tokenManagementApi.fetchCurrentTariffs()
      setCurrentTariffs(tariffs)
    } catch (error) {
      setCurrentTariffs({})
    }
  }

  useEffect(() => {
    loadCurrentTariffs().catch(setError)
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await tokenManagementApi.fetchTariffHistory(itemsFilter)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (error) {
      window.toast.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadHistory().catch(setError)
  }, [itemsFilter])

  return (
    <>
      <div className="card p-4 pb-0 mb-4">
        <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
          <h4 className="mb-0">Tariffs Management</h4>
          <div className="d-flex gap-2 align-items-center">
            <CButton color="success" size={'sm'} onClick={() => setShowEditModal(true)}>
              Set Tariffs
            </CButton>
          </div>
        </div>
        <CCardBody>
        <CurrentTariffs currentTariffs={currentTariffs} />
        <TariffHistoryTable {...{items, totalItems, currentPage, setCurrentPage, setItemsFilter, loading}} />
        </CCardBody>
      </div>

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
