import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCardBody, CAlert
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import { TfiReload } from 'react-icons/tfi'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import store from 'src/store'
import { fetchUsers, createUser, patchUser, deleteUser, fetchError } from 'src/api/users'
import { UserAvatar } from 'src/components/table/UserAvatar'
import { LogoInput } from 'src/components/input-fields/LogoInput'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { BooleanTrigger, BooleanStatusIcon } from 'src/components/table/CustomTableElements'
import { dateTime } from 'src/components/utils/DateTime'

const Users = () => {
  const userAvatars = store.getState().path.userAvatars
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchData = async () => {
    try {
      const data = await fetchUsers()
      setItems(data)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  useEffect(() => fetchData(), [])

  const handleEdit = (item) => {
    setErrorMessage('')
    setEditingItem(item)
    setVisible(true)
  }

  const handleRemove = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.fullName}"?`)) return
    try {
      await deleteUser(item.id)
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleAdd = () => {
    setErrorMessage('')
    setEditingItem({ id: null, fullName: '', email: '', avatar: null, active: false, createdAt: '',  lastActivityAt: ''})
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
      fetchData()
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Users</h4>
        <div className="d-flex gap-2">
          <CButton size="sm" title="Reload" onClick={() => fetchData()}>
            <TfiReload />
          </CButton>
          <CButton color="success" size="sm" onClick={handleAdd}>
            <CIcon icon={cilPlus} className="me-1 pt-1" /> Add User
          </CButton>
        </div>
      </div>
      <CCardBody>
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell><div className="row-cell-center-50">Avatar</div></CTableHeaderCell>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Created</CTableHeaderCell>
              <CTableHeaderCell>Last Active</CTableHeaderCell>
              <CTableHeaderCell><div className="row-cell-center-50">Active</div></CTableHeaderCell>
              <CTableHeaderCell><div className="row-cell-center-50">Authorized</div></CTableHeaderCell>
              <CTableHeaderCell style={{ width: 1 }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell><UserAvatar user={item} showStatus={true} /></CTableDataCell>
                <CTableDataCell>{item.fullName}</CTableDataCell>
                <CTableDataCell>Admin</CTableDataCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>{dateTime(item.createdAt)}</CTableDataCell>
                <CTableDataCell>{dateTime(item.lastActivityAt)}</CTableDataCell>
                <CTableDataCell>
                  <BooleanTrigger
                    item={item}
                    isActive={(i) => i.active}
                    onToggle={async (i) => {
                      await patchUser(i.id, { active: i.active ? 0 : 1 })
                      fetchData()
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <BooleanStatusIcon
                    status={item.authorized}
                    color={'text-warning'}
                    title={item.authorized ? 'Authorized' : 'Not Authorized'}
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
          <SecureFormInput
            label="Password"
            type="password"
            secured={editingItem?.id}
            value={editingItem?.password || ''}
            onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })}
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
