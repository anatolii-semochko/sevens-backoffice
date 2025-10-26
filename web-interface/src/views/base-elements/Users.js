import React, { useEffect, useState } from 'react'
import store from 'src/store'
import { roles } from 'src/components/utils/Permissions'
import { fetchUsers, createUser, updateUser, patchUser, deleteUser, fetchError } from 'src/api/users'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CCardBody,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import { TfiReload } from 'react-icons/tfi'
import { UserAvatar } from 'src/components/table/UserAvatar'
import { LogoInput } from 'src/components/input-fields/LogoInput'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { BooleanTrigger, BooleanStatusIcon } from 'src/components/table/CustomTableElements'
import { dateTime, timeAgo, isRecent } from 'src/components/utils/DateTime'

const Users = () => {
  const isSuperAdmin = roles().superAdmin
  const userAvatars = store.getState().path.userAvatars
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchData = async () => {
    try {
      const data = await fetchUsers()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  useEffect(() => {
    fetchData()
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
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleAdd = () => {
    setErrorMessage('')
    setEditingItem({
      id: null,
      password: null,
      confirmPassword: null,
      loginName: '',
      fullName: '',
      email: '',
      avatar: null,
      active: false,
      createdAt: '',
      lastActivityAt: '',
      roles: [],
    })
    setVisible(true)
  }

  const handleSave = async () => {
    setErrorMessage(null)
    try {
      if (editingItem.password && editingItem.password !== editingItem.confirmPassword) {
        return setErrorMessage('Incorrect password')
      }
      if (editingItem.id) {
        await updateUser(editingItem.id, editingItem)
      } else {
        await createUser(editingItem)
      }
      setVisible(false)
      fetchData()
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const rolesString = (roles) => {
    if (!roles?.length) return ''
    const map = store.getState().userRoles
    return roles.map((r) => map[r] || r).join(', ')
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Users</h4>
        <div className="d-flex gap-2">
          <CButton size="sm" title="Reload" onClick={() => fetchData()}>
            <TfiReload />
          </CButton>
          {isSuperAdmin &&
            <CButton color="success" size="sm" onClick={handleAdd} disabled={!isSuperAdmin}>
              <CIcon icon={cilPlus} className="me-1 pt-1" /> Add User
            </CButton>
          }
        </div>
      </div>
      <CCardBody>
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell><div className="row-cell-center-50">Avatar</div></CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Login</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Created</CTableHeaderCell>
              <CTableHeaderCell>Last Activity</CTableHeaderCell>
              <CTableHeaderCell>
                <div className="row-cell-center-50">Active</div>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <div className="row-cell-center-50">Authorized</div>
              </CTableHeaderCell>
              {isSuperAdmin && <CTableHeaderCell style={{ width: 1 }}>Actions</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Array.isArray(items) && items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>
                  <UserAvatar user={item} showStatus={true} />
                </CTableDataCell>
                <CTableDataCell>{item.fullName}</CTableDataCell>
                <CTableDataCell>{item.loginName}</CTableDataCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>{rolesString(item.roles)}</CTableDataCell>
                <CTableDataCell>{dateTime(item.createdAt)}</CTableDataCell>
                <CTableDataCell title={dateTime(item.lastActivityAt)}>
                  {timeAgo(item.lastActivityAt)}
                </CTableDataCell>
                <CTableDataCell>
                  <BooleanTrigger
                    item={item}
                    isActive={(i) => i.active}
                    disabled={!isSuperAdmin}
                    onToggle={async (i) => {
                      if (!isSuperAdmin) return
                      await patchUser(i.id, { active: i.active ? 0 : 1 })
                      fetchData()
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <BooleanStatusIcon
                    status={item.authorized}
                    color={
                      item.authorized
                        ? isRecent(item.lastActivityAt)
                          ? 'text-success'
                          : 'text-warning'
                        : 'text-danger'
                    }
                    title={item.authorized ? 'Authorized' : 'Not Authorized'}
                  />
                </CTableDataCell>
                {isSuperAdmin &&
                  <CTableDataCell className="text-nowrap">
                    <CButton
                      size="sm"
                      color="warning"
                      className="me-2"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleRemove(item)}
                      title="Remove"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                }
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>{editingItem?.id ? 'Edit User' : 'Add User'}</CModalHeader>
        <CModalBody>
          <SecureFormInput
            label="Name"
            value={editingItem?.fullName || ''}
            onChange={(e) => setEditingItem({ ...editingItem, fullName: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Login"
            secured={editingItem?.id}
            value={editingItem?.loginName || ''}
            onChange={(e) => setEditingItem({ ...editingItem, loginName: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Email"
            value={editingItem?.email || ''}
            onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Password"
            type="password"
            placeholder="Set password"
            secured={editingItem?.id}
            value={editingItem?.password || ''}
            onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })}
          />
          {editingItem?.password &&
            <CFormInput
              className="mb-3"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              secured={editingItem?.id}
              value={editingItem?.confirmPassword || ''}
              onChange={(e) => setEditingItem({ ...editingItem, confirmPassword: e.target.value })}
            />
          }
          <LogoInput
            path={userAvatars}
            prefix={'large-'}
            value={editingItem?.avatar || null}
            onChange={(file) => setEditingItem({ ...editingItem, avatar: file })}
          />
          <div className="mb-3">
            <label className="form-label">Roles</label>
            {Object.entries(store.getState().userRoles).map(([role, title]) => (
              <div className="form-check" key={role}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`role-${role}`}
                  name="roles"
                  value={role}
                  checked={editingItem?.roles?.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditingItem({
                        ...editingItem,
                        roles: [...(editingItem?.roles || []), role],
                      })
                    } else {
                      setEditingItem({
                        ...editingItem,
                        roles: editingItem.roles.filter((r) => r !== role),
                      })
                    }
                  }}
                />
                <label className="form-check-label ms-2" htmlFor={`role-${role}`}>
                  {title}
                </label>
              </div>
            ))}
          </div>
          {errorMessage && (
            <CAlert color="danger" className="show mb-0 mt-3">
              {errorMessage}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Users
