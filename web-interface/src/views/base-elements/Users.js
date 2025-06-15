import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCard, CCardHeader, CCardBody, CAvatar
} from '@coreui/react'
import {
  cilXCircle, cilCheckCircle, cilPencil, cilTrash, cilPlus
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchUsers, createUser, patchUser, deleteUser } from 'src/api/users'

const Users = () => {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchAndSetUsers = async () => {
    const data = await fetchUsers()
    setItems(data)
  }

  useEffect(() => {
    fetchAndSetUsers()
  }, [])

  const handleEdit = (item) => {
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    await deleteUser(id)
    fetchAndSetUsers()
  }

  const handleAdd = () => {
    setEditingItem({ id: null, name: '', lastName: '', email: '', avatar: '', active: 1 })
    setVisible(true)
  }

  const handleSave = async () => {
    if (editingItem.id) {
      await patchUser(editingItem.id, editingItem)
    } else {
      await createUser(editingItem)
    }
    setVisible(false)
    fetchAndSetUsers()
  }

  const toggleActive = async (item) => {
    await patchUser(item.id, {
      active: item.active ? 0 : 1,
    })
    fetchAndSetUsers()
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Users</span>
        <CButton color="primary" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-2" />Add
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Avatar</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Last Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Created</CTableHeaderCell>
              <CTableHeaderCell>Updated</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>
                  <CAvatar size="md" src={`/src/assets/images/avatars/${item.avatar}`} status={item.active ? 'success' : 'secondary'} />
                </CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.lastName}</CTableDataCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>
                  <CIcon
                    icon={item.active ? cilCheckCircle : cilXCircle}
                    className={item.active ? 'text-success' : 'text-danger'}
                    style={{ cursor: 'pointer' }}
                    title="Toggle active"
                    onClick={() => toggleActive(item)}
                  />
                </CTableDataCell>
                <CTableDataCell>{item.created}</CTableDataCell>
                <CTableDataCell>{item.updated}</CTableDataCell>
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
          {editingItem?.id ? 'Edit User' : 'Add User'}
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-2"
            label="Name"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Last Name"
            value={editingItem?.lastName || ''}
            onChange={(e) => setEditingItem({ ...editingItem, lastName: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Email"
            value={editingItem?.email || ''}
            onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Avatar File Name"
            value={editingItem?.avatar || ''}
            onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
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

export default Users
