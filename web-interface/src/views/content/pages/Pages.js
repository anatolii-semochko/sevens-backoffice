import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCard, CCardHeader, CCardBody
} from '@coreui/react'
import {
  cilPencil, cilTrash, cilPlus
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchPages, createPage, patchPage, deletePage } from 'src/api/pages'

const Pages = () => {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchAndSetPages = async () => {
    const data = await fetchPages()
    setItems(data)
  }

  useEffect(() => {
    fetchAndSetPages()
  }, [])

  const handleEdit = (item) => {
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (id) => {
    await deletePage(id)
    fetchAndSetPages()
  }

  const handleAdd = () => {
    setEditingItem({ id: null, url: '' })
    setVisible(true)
  }

  const handleSave = async () => {
    if (editingItem.id) {
      await patchPage(editingItem.id, editingItem)
    } else {
      await createPage(editingItem)
    }
    setVisible(false)
    fetchAndSetPages()
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Pages</span>
        <CButton color="primary" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-2" />Add
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>URL</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.url || <i className="text-muted">[empty]</i>}</CTableDataCell>
                <CTableDataCell>
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
          {editingItem?.id ? 'Edit Page' : 'Add Page'}
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-2"
            label="URL"
            value={editingItem?.url || ''}
            onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
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

export default Pages
