import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CFormLabel,
  CCard, CCardHeader, CCardBody, CFormTextarea, CAlert
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus, cilPen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchPages, createPage, patchPage, deletePage, fetchError } from 'src/api/pages'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'

const Pages = () => {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editLang, setEditLang] = useState(null)
  const [textModalVisible, setTextModalVisible] = useState(false)
  const [textEditingItem, setTextEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const selectedLanguage = useSelector(state => state.selectedLanguage)
  const langId = selectedLanguage?.id

  const fetchData = async () => {
    try {
      const data = await fetchPages()
      setItems(data)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const findSeoByLang = (seoArray, langId) => {
    return seoArray.find(seo => seo.language?.id === langId)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setErrorMessage(null)
    setVisible(true)
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return
    try {
      await deletePage(id)
      fetchData()
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleAdd = () => {
    setEditingItem({ id: null, url: '', seo: [], contents: [] })
    setErrorMessage(null)
    setVisible(true)
  }

  const handleSave = async () => {
    if (!editingItem.url) {
      setErrorMessage('Url is required.')
      return
    }
    try {
      if (editingItem.id) {
        await patchPage(editingItem.id, editingItem)
      } else {
        await createPage(editingItem)
      }
      setVisible(false)
      fetchData()
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const handleEditText = (item) => {
    setTextEditingItem({ ...item })
    setEditLang(selectedLanguage)
    setErrorMessage(null)
    setTextModalVisible(true)
  }

  const handleSaveText = async () => {
    try {
      const updated = { ...textEditingItem }

      const existingSeoIndex = updated.seo.findIndex(seo => seo.language?.id === editLang?.id)
      if (existingSeoIndex === -1) {
        updated.seo.push({ language: editLang, breadcrumbs: '', title: '', keywords: '', description: '' })
      }

      await patchPage(updated.id, updated)
      setTextModalVisible(false)
      fetchData()
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  const handleTextChange = (field, value) => {
    try {
      setTextEditingItem((prev) => {
        const updatedSeo = [...prev.seo]
        const idx = updatedSeo.findIndex(seo => seo.language?.id === editLang?.id)
        if (idx !== -1) {
          updatedSeo[idx] = { ...updatedSeo[idx], [field]: value }
        } else {
          updatedSeo.push({ language: editLang, [field]: value })
        }
        return { ...prev, seo: updatedSeo }
      })
    } catch (error) {
      setErrorMessage(fetchError(error))
    }
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Pages</h4>
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-1" /> Add page
        </CButton>
      </div>
      <CCardBody>
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>URL</CTableHeaderCell>
              <CTableHeaderCell>Breadcrumbs</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Keywords</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => {
              const seo = findSeoByLang(item.seo, langId)
              return (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.url || <i className="text-muted">[empty]</i>}</CTableDataCell>
                  <CTableDataCell>{seo?.breadcrumbs || <i className="text-muted">no breadcrumbs</i>}</CTableDataCell>
                  <CTableDataCell>{seo?.title || <i className="text-muted">no title</i>}</CTableDataCell>
                  <CTableDataCell>{seo?.keywords || <i className="text-muted">no keywords</i>}</CTableDataCell>
                  <CTableDataCell>{seo?.description || <i className="text-muted">no description</i>}</CTableDataCell>
                  <CTableDataCell className="text-nowrap" style={{ width: 1 }}>
                    <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton size="sm" color="info" className="me-2" onClick={() => handleEditText(item)}>
                      <CIcon icon={cilPen} />
                    </CButton>
                    <CButton size="sm" color="danger" onClick={() => handleRemove(item.id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Modal: URL Add/Edit */}
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
          {errorMessage && (
            <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal: Multilingual SEO content */}
      <CModal visible={textModalVisible} onClose={() => setTextModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Edit SEO Content ({editLang?.name || 'No Language'})</div>
            <LanguageSelector selected={editLang} onChange={(lang) => setEditLang(lang)} />
          </div>
        </CModalHeader>
        <CModalBody>
          {(() => {
            const seo = findSeoByLang(textEditingItem?.seo || [], editLang?.id) || {}
            return (
              <>
                <div className="mb-3">
                  <CFormLabel>Breadcrumbs</CFormLabel>
                  <CFormInput
                    value={seo?.breadcrumbs || ''}
                    onChange={(e) => handleTextChange('breadcrumbs', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Title</CFormLabel>
                  <CFormInput
                    value={seo?.title || ''}
                    onChange={(e) => handleTextChange('title', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Keywords</CFormLabel>
                  <CFormTextarea
                    value={seo?.keywords || ''}
                    onChange={(e) => handleTextChange('keywords', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Description</CFormLabel>
                  <CFormTextarea
                    value={seo?.description || ''}
                    onChange={(e) => handleTextChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )
          })()}
          {errorMessage && <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setTextModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveText}>Save</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Pages
