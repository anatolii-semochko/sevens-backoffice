import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { roles, AccessDeniedBlock } from 'src/components/utils/Permissions'
import {
  fetchLanguages,
  createLanguage,
  patchLanguage,
  deleteLanguage,
  swapLanguageOrder,
  fetchError,
} from 'src/api/languages'
import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCardBody, CAlert,
} from '@coreui/react'
import { cilCheckCircle, cilPencil, cilTrash, cilPlus, cilArrowTop } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { BooleanTrigger, LanguageFlag } from 'src/components/table/CustomTableElements'

const Languages = () => {
  if (!roles().editor) {
    return <AccessDeniedBlock />
  }
  const dispatch = useDispatch()
  const [rawItems, setRawItems] = useState([])
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchData = async () => {
    let data = []
    try {
      data = await fetchLanguages()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
    data.sort((a, b) => a.order - b.order)
    setRawItems(data)
    dispatch({ type: 'set', languages: data })

    const mapped = data.map((item) => {
      const code = item.code.toLowerCase()
      const iconKey = `cif${code.charAt(0).toUpperCase()}${code.slice(1)}`
      return {
        ...item,
        flag: <LanguageFlag language={item} />,
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
    fetchData()
  }, [])

  const handleEdit = (item) => {
    setErrorMessage('')
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (language) => {
    try {
      if (!window.confirm(`Are you sure you want to delete language "${language.name}"?`)) return
      await deleteLanguage(language.id)
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleAdd = () => {
    setErrorMessage('')
    const maxOrder = Math.max(0, ...rawItems.map(i => i.order || 0))
    setEditingItem({ id: null, name: '', code: '', active: 0, main: 0, order: maxOrder + 1 })
    setVisible(true)
  }

  const handleSave = async () => {
    setErrorMessage('')
    if (!editingItem.name || !editingItem.code) {
      setErrorMessage('Both Language Name and Code are required.')
      return
    }

    try {
      if (editingItem.id) {
        await patchLanguage(editingItem.id, {
          name: editingItem.name,
          code: editingItem.code,
        })
      } else {
        await createLanguage(editingItem)
      }
      await fetchData()
      setVisible(false)
      setEditingItem(null)
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const toggleActive = async (item) => {
    try {
      await patchLanguage(item.id, {
        active: item.active ? 0 : 1,
      })
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleSetMain = async (itemsList, id) => {
    try {
      await Promise.all(
        itemsList.map((item) =>
          patchLanguage(item.id, {
            main: item.id === id ? 1 : 0,
          })
        )
      )
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleOrderUp = async (index) => {
    try {
      if (index === 0) return
      const current = rawItems[index]
      const above = rawItems[index - 1]
      await swapLanguageOrder(current.id, above.id)
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Languages</h4>
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-1 pt-1" /> Add Language
        </CButton>
      </div>
      <CCardBody>
        <CTable className="align-middle no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Flag</CTableHeaderCell>
              <CTableHeaderCell>Language</CTableHeaderCell>
              <CTableHeaderCell>Code</CTableHeaderCell>
              <CTableHeaderCell><div className="row-cell-center-50">Active</div></CTableHeaderCell>
              <CTableHeaderCell><div className="row-cell-center-50">Main</div></CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item, index) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.flag}</CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.code}</CTableDataCell>
                <CTableDataCell>
                  <BooleanTrigger
                    item={item}
                    isActive={(i) => i.active}
                    onToggle={async (i) => {
                      await patchLanguage(i.id, { active: i.active ? 0 : 1 })
                      fetchData()
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell><div className="row-cell-center-50">{item.main}</div></CTableDataCell>
                <CTableDataCell className="text-nowrap" style={{ width: 1 }}>
                  <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)} title="Edit">
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    className="me-2"
                    size="sm"
                    title="Move Up"
                    disabled={index <= 0}
                    color={index <= 0 ? 'secondary' : 'info'}
                    onClick={() => handleOrderUp(index)}
                  >
                    <CIcon icon={cilArrowTop} />
                  </CButton>
                  <CButton size="sm" color="danger" onClick={() => handleRemove(item)} title="Remove">
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
            className="mb-3"
            label="Language Name"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Code"
            value={editingItem?.code || ''}
            onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
          />
          {errorMessage && (
            <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Languages
