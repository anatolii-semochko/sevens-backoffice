import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchLanguages,
  createLanguage,
  patchLanguage,
  deleteLanguage,
  swapLanguageOrder,
} from 'src/api/languages'
import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCard, CCardHeader, CCardBody
} from '@coreui/react'
import { cilXCircle, cilCheckCircle, cilPencil, cilTrash, cilPlus, cilArrowTop } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { flagSet } from '@coreui/icons'

const Languages = () => {
  const dispatch = useDispatch()
  const [rawItems, setRawItems] = useState([])
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchAndSetLanguages = async () => {
    const data = await fetchLanguages()
    data.sort((a, b) => a.order - b.order)
    setRawItems(data)
    dispatch({ type: 'set', languages: data })

    const mapped = data.map((item) => {
      const code = item.code.toLowerCase()
      const iconKey = `cif${code.charAt(0).toUpperCase()}${code.slice(1)}`
      return {
        ...item,
        flag: flagSet[iconKey]
          ? <CIcon icon={flagSet[iconKey]} size="xl" title={item.code} />
          : item.code,

        active: (
          <CIcon
            icon={item.active ? cilCheckCircle : cilXCircle}
            className={item.active ? 'text-success' : 'text-danger'}
            title="Toggle status"
            onClick={() => toggleActive(item)}
            style={{ cursor: 'pointer' }}
          />
        ),

        main: item.main
          ? <CIcon icon={cilCheckCircle} className="text-success" title="Main" />
          : <CIcon
            icon={cilCheckCircle}
            className="text-secondary"
            title="Set as Main"
            onClick={() => handleSetMain(data, item.id)}
            style={{ cursor: 'pointer' }}
          />,
      }
    })

    setItems(mapped)
  }

  useEffect(() => {
    fetchAndSetLanguages()
  }, [])

  const handleEdit = (item) => {
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this language?')) return
    await deleteLanguage(id)
    fetchAndSetLanguages()
  }

  const handleAdd = () => {
    const maxOrder = Math.max(0, ...rawItems.map(i => i.order || 0))
    setEditingItem({ id: null, name: '', code: '', active: 0, main: 0, order: maxOrder + 1 })
    setVisible(true)
  }

  const handleSave = async () => {
    if (editingItem.id) {
      await patchLanguage(editingItem.id, {
        name: editingItem.name,
        code: editingItem.code,
      })
    } else {
      await createLanguage(editingItem)
    }
    await fetchAndSetLanguages()
    setVisible(false)
  }

  const toggleActive = async (item) => {
    await patchLanguage(item.id, {
      active: item.active ? 0 : 1,
    })
    fetchAndSetLanguages()
  }

  const handleSetMain = async (itemsList, id) => {
    await Promise.all(
      itemsList.map((item) =>
        patchLanguage(item.id, {
          main: item.id === id ? 1 : 0,
        })
      )
    )
    fetchAndSetLanguages()
  }

  const handleOrderUp = async (index) => {
    if (index === 0) return
    const current = rawItems[index]
    const above = rawItems[index - 1]

    await swapLanguageOrder(current.id, above.id)
    fetchAndSetLanguages()
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Languages</span>
        <CButton color="primary" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-2" />Add
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Flag</CTableHeaderCell>
              <CTableHeaderCell>Language</CTableHeaderCell>
              <CTableHeaderCell>Code</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Main</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item, index) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.flag}</CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.code}</CTableDataCell>
                <CTableDataCell>{item.active}</CTableDataCell>
                <CTableDataCell>{item.main}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color={index <= 0 ? 'secondary' : 'info'}
                    className="me-2"
                    title="Move Up"
                    disabled={index <= 0}
                    onClick={() => handleOrderUp(index)}
                  >
                    <CIcon icon={cilArrowTop} />
                  </CButton>
                  <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton size="sm" color="danger" onClick={() => handleRemove(item.id)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          {editingItem?.id ? 'Edit Language' : 'Add Language'}
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-2"
            label="Language Name"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Code"
            value={editingItem?.code || ''}
            onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Languages
