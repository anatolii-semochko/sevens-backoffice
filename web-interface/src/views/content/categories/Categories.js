import React, { useState, useEffect } from 'react'
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter,
  CFormInput, CFormLabel, CAlert, CCardBody, CFormTextarea
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilPen, cilArrowTop } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'
import {
  fetchCategories, createCategory, patchCategory, deleteCategory, swapCategoryOrder, fetchError
} from 'src/api/categories'

const Categories = () => {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [textModalVisible, setTextModalVisible] = useState(false)
  const [textEditingItem, setTextEditingItem] = useState(null)
  const [editLang, setEditLang] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentParent, setCurrentParent] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])

  const selectedLanguage = useSelector(state => state.selectedLanguage)
  const langId = selectedLanguage?.id

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (parent = null, path = []) => {
    try {
      const filter = { parentId: parent ?? 'root' }
      const data = await fetchCategories(filter)
      setItems(data)
      setCurrentParent(parent)
      setBreadcrumb(path)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const findTranslation = (translations, langId) =>
    translations.find(t => t.language?.id === langId)

  const handleAdd = () => {
    setErrorMessage('')
    const maxOrder = Math.max(0, ...items.map(i => i.order || 0))
    setEditingItem({
      id: null,
      name: '',
      url: '',
      parentId: currentParent ?? null,
      mainParent: null,
      activityParent: null,
      order: maxOrder + 1,
      translations: [],
  })
    setVisible(true)
  }

  const handleEdit = (item) => {
    setErrorMessage('')
    setEditingItem({ ...item })
    setVisible(true)
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      fetchData(currentParent, breadcrumb)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleSave = async () => {
    if (!editingItem.name) {
      setErrorMessage('Name is required.')
      return
    }
    try {
      editingItem.id
        ? await patchCategory(editingItem.id, editingItem)
        : await createCategory(editingItem)
      setVisible(false)
      fetchData(currentParent, breadcrumb)
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const handleEditText = (item) => {
    setErrorMessage('')
    setTextEditingItem({ ...item })
    setEditLang(selectedLanguage)
    setTextModalVisible(true)
  }

  const handleSaveText = async () => {
    try {
      const updated = { ...textEditingItem }
      const idx = updated.translations.findIndex(t => t.language?.id === editLang?.id)
      if (idx === -1) {
        updated.translations.push({ language: editLang, name: '' })
      }
      await patchCategory(updated.id, updated)
      setTextModalVisible(false)
      fetchData(currentParent, breadcrumb)
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const handleTextChange = (field, value) => {
    setTextEditingItem((prev) => {
      const updatedTranslations = [...prev.translations]
      const idx = updatedTranslations.findIndex(t => t.language?.id === editLang?.id)
      if (idx !== -1) {
        updatedTranslations[idx] = { ...updatedTranslations[idx], [field]: value }
      } else {
        updatedTranslations.push({ language: editLang, [field]: value })
      }
      return { ...prev, translations: updatedTranslations }
    })
  }

  const handleNameClick = (item) => {
    // const translation = findTranslation(item.translations || [], langId)
    // const name = translation?.name || item.name || 'no name'
    const newPath = [...breadcrumb, { id: item.id, name: item.name }]
    fetchData(item.id, newPath)
  }

  const handleGoUp = () => {
    const newPath = breadcrumb.slice(0, -1)
    const parent = newPath.length ? newPath[newPath.length - 1].id : null
    fetchData(parent, newPath)
  }

  const handleOrderUp = async (index) => {
    try {
      if (index === 0) return
      const current = items[index]
      const above = items[index - 1]
      await swapCategoryOrder(current.id, above.id)
      fetchData(currentParent, breadcrumb)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const empty = (label) => (<i className="text-muted">no {label}</i>)

  const Breadcrumbs = () => (
    <div className="mb-3 d-flex align-items-center">
      <img
        src="/src/assets/images/custom/up.png"
        onClick={breadcrumb.length ? handleGoUp : undefined}
        className={breadcrumb.length ? 'c_pointer' : ''}
        style={{ opacity: breadcrumb.length ? 1 : 0.4, cursor: breadcrumb.length ? 'pointer' : 'default' }}
      />
      <div className="ms-2" style={{ fontSize: '20px' }}>
        <a className={breadcrumb.length ? 'text-link-active' : 'text-link'} onClick={() => fetchData(null, [])}>Root</a>
        {breadcrumb.map((b, i) => (
          <span key={b.id}>
            {' / '}
            {i === breadcrumb.length - 1 ? (
              <strong>{b.name}</strong>
            ) : (
              <a className="text-link-active" onClick={() => fetchData(b.id, breadcrumb.slice(0, i + 1))}>{b.name}</a>
            )}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Categories</h4>
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-1" /> Add category
        </CButton>
      </div>
      <CCardBody>
        <Breadcrumbs />
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Logo</CTableHeaderCell>
              <CTableHeaderCell>Category</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>URL</CTableHeaderCell>
              <CTableHeaderCell>Short Description</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item, index) => {
              const translation = findTranslation(item.translations || [], langId)
              return (
                <CTableRow key={item.id}>
                  <CTableDataCell><i className="text-muted">Logo</i></CTableDataCell>
                  <CTableDataCell>
                    <a href="#" className="text-link-active" onClick={(e) => { e.preventDefault(); handleNameClick(item) }}>
                      {item.name}
                    </a>
                  </CTableDataCell>
                  <CTableDataCell>{translation?.name || empty('name')}</CTableDataCell>
                  <CTableDataCell>{translation?.title || empty('title')}</CTableDataCell>
                  <CTableDataCell>{item.url || empty('url')}</CTableDataCell>
                  <CTableDataCell>{translation?.shortDescription || empty('description')}</CTableDataCell>
                  <CTableDataCell className="text-nowrap" style={{ width: 1 }}>
                    <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="info" size="sm" className="me-2" onClick={() => handleEditText(item)}>
                      <CIcon icon={cilPen} />
                    </CButton>
                    <CButton color="secondary" size="sm" className="me-2" onClick={() => handleOrderUp(index)} title="Move Up">
                      <CIcon icon={cilArrowTop} />
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleRemove(item.id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Modals (simplified) */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>{editingItem?.id ? 'Edit Category' : 'Add Category'}</CModalHeader>
        <CModalBody>
          <CFormLabel>Name</CFormLabel>
          <CFormInput
            className="mb-2"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <CFormLabel>URL</CFormLabel>
          <CFormInput
            className="mb-2"
            value={editingItem?.url || ''}
            onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
          />
          {errorMessage && <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal: Edit Translations */}
      <CModal visible={textModalVisible} onClose={() => setTextModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Edit Translations ({editLang?.name || 'No Language'})</div>
            <LanguageSelector selected={editLang} onChange={setEditLang} />
          </div>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Name</CFormLabel>
          <CFormInput
            value={
              textEditingItem?.translations.find(t => t.language?.id === editLang?.id)?.name || ''
            }
            onChange={(e) => handleTextChange('name', e.target.value)}
          />
          <CFormLabel>Title</CFormLabel>
          <CFormInput
            value={
              textEditingItem?.translations.find(t => t.language?.id === editLang?.id)?.title || ''
            }
            onChange={(e) => handleTextChange('title', e.target.value)}
          />
          <CFormLabel>Logo Alt</CFormLabel>
          <CFormInput
            value={
              textEditingItem?.translations.find(t => t.language?.id === editLang?.id)?.logoAlt || ''
            }
            onChange={(e) => handleTextChange('logoAlt', e.target.value)}
          />
          <CFormLabel>Short Description</CFormLabel>
          <CFormInput
            value={
              textEditingItem?.translations.find(t => t.language?.id === editLang?.id)?.shortDescription || ''
            }
            onChange={(e) => handleTextChange('shortDescription', e.target.value)}
          />
          <CFormLabel>Description</CFormLabel>
          <CFormTextarea
            rows={10}
            value={
              textEditingItem?.translations.find(t => t.language?.id === editLang?.id)?.description || ''
            }
            onChange={(e) => handleTextChange('description', e.target.value)}
          />
          {errorMessage && (
            <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setTextModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveText}>Save</CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default Categories
