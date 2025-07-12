import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCardBody, CAlert, CAvatar
} from '@coreui/react'
import {
  cilXCircle, cilCheckCircle, cilPencil, cilTrash, cilPlus
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import store from 'src/store'
import { fetchUsers, createUser, patchUser, deleteUser, fetchError } from 'src/api/users'
import { LogoInput } from 'src/components/input-fields/LogoInput'

const Users = () => {
  const userAvatars = store.getState().path.userAvatars
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchAndSetUsers = async () => {
    try {
      const data = await fetchUsers()
      setItems(data)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  useEffect(() => {
    fetchAndSetUsers()
  }, [])

  const handleEdit = (item) => {
    setErrorMessage('')
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.fullName}"?`)) return
    try {
      await deleteUser(item.id)
      fetchAndSetUsers()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleAdd = () => {
    setErrorMessage('')
    setEditingItem({ id: null, fullName: '', email: '', avatar: null, active: true })
    setVisible(true)
  }

  const handleSave = async () => {
    try {
      if (editingItem.id) {
        await patchUser(editingItem.id, editingItem)
      } else {
        await createUser(editingItem)
      }
      setVisible(false)
      fetchAndSetUsers()
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const toggleActive = async (item) => {
    try {
      await patchUser(item.id, {
        active: item.active ? 0 : 1,
      })
      fetchAndSetUsers()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const getInitials = (fullName) => fullName
      .split(' ')
      .filter(fullName => fullName.length > 0)
      .map(fullName => fullName[0].toUpperCase())
      .join('');

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Users</h4>
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-1 pt-1" /> Add User
        </CButton>
      </div>
      <CCardBody>
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell><div className="row-cell-center-50">Avatar</div></CTableHeaderCell>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell><div className="row-cell-center-50">Active</div></CTableHeaderCell>
              <CTableHeaderCell style={{ width: 1 }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>
                  {item.avatar ? (
                    <CAvatar src={userAvatars + 'small-' + item.avatar} status={item.active ? 'success' : 'danger'} />
                  ) : (
                    <CAvatar status={item.active ? 'success' : 'danger'}>{getInitials(item.fullName)}</CAvatar>
                  )}
                </CTableDataCell>
                <CTableDataCell>{item.fullName}</CTableDataCell>
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
                <CTableDataCell className="text-nowrap">
                  <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)} title="Edit">
                    <CIcon icon={cilPencil} />
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
          {editingItem?.id ? 'Edit User' : 'Add User'}
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-3"
            label="Full Name"
            value={editingItem?.fullName || ''}
            onChange={(e) => setEditingItem({ ...editingItem, fullName: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Email"
            value={editingItem?.email || ''}
            onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
          />
          <LogoInput
            path={userAvatars}
            prefix={'large-'}
            value={editingItem?.avatar || null}
            onChange={(file) => setEditingItem({ ...editingItem, avatar: file })}
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

export default Users
