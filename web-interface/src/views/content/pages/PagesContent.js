import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCard, CCardHeader, CCardBody, CFormSelect, CFormTextarea, CAlert
} from '@coreui/react'
import { cilPen, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchContent, patchContent, deleteContent, createContent, fetchError } from 'src/api/pages-content'
import { fetchPages } from 'src/api/pages'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'

const PagesContent = () => {
  const [items, setItems] = useState([])
  const [pages, setPages] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editLang, setEditLang] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const selectedLanguage = useSelector((state) => state.selectedLanguage)
  const langId = selectedLanguage?.id

  const fetchData = async () => {
    try {
      const data = await fetchContent()
      setItems(data)
    } catch (e) {
      window.toast.error(fetchError(e))
    }
  }

  const fetchPagesData = async () => {
    try {
      const data = await fetchPages()
      setPages(data)
    } catch (e) {
      window.toast.error(fetchError(e))
    }
  }

  useEffect(() => {
    fetchData()
    fetchPagesData()
  }, [])

  const findTranslation = (translations, langId) =>
    translations?.find(t => t.language?.id === langId)?.translation || ''

  const updateTranslation = (translations, langId, value) => {
    const otherTranslations = translations.filter(t => t.language?.id !== langId)
    return [...otherTranslations, { language: { id: langId }, translation: value }]
  }

  const handleEdit = (item) => {
    setEditingItem({
      ...item,
      translations: item.translations || [],
      page: item.page || { id: '', url: '' }
    })
    setEditLang(selectedLanguage)
    setErrorMessage(null)
    setModalVisible(true)
  }

  const handleCreate = () => {
    setEditingItem({
      term: '',
      page: { id: '', url: '' },
      translations: []
    })
    setEditLang(selectedLanguage)
    setErrorMessage(null)
    setModalVisible(true)
  }

  const handleSave = async () => {
    try {
      if (!editingItem.term) {
        setErrorMessage('Term is required.')
        return
      }
      if (!editLang?.id) {
        setErrorMessage('Language is not selected.')
        return
      }

      const updatedItem = {
        ...editingItem,
        translations: updateTranslation(editingItem.translations, editLang.id, findTranslation(editingItem.translations, editLang.id))
      }

      if (editingItem.id) {
        await patchContent(editingItem.id, updatedItem)
      } else {
        await createContent(updatedItem)
      }

      setModalVisible(false)
      fetchData()
    } catch (e) {
      setErrorMessage(fetchError(e))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this term?')) return
    try {
      await deleteContent(id)
      fetchData()
    } catch (e) {
      window.toast.error(fetchError(e))
    }
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Pages Content</h4>
        <CButton color="success" size="sm" onClick={handleCreate}>
          <CIcon icon={cilPlus} className="me-1" /> Add Term
        </CButton>
      </div>
      <CCardBody>
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Term</CTableHeaderCell>
              <CTableHeaderCell>Page URL</CTableHeaderCell>
              <CTableHeaderCell>Translation</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.term || <i className="text-muted">no term</i>}</CTableDataCell>
                <CTableDataCell>{item.page?.url || <i className="text-muted"></i>}</CTableDataCell>
                <CTableDataCell>
                  {findTranslation(item.translations, langId) ? (
                    <span dangerouslySetInnerHTML={{ __html: findTranslation(item.translations, langId) }} />
                  ) : (
                    <i className="text-muted">no translation</i>
                  )}
                </CTableDataCell>
                <CTableDataCell className="text-nowrap" style={{ width: 1 }}>
                  <CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(item)}>
                    <CIcon icon={cilPen} />
                  </CButton>
                  <CButton size="sm" color="danger" onClick={() => handleDelete(item.id)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>{editingItem?.id ? 'Edit Term' : 'Create Term'}</div>
            <LanguageSelector selected={editLang} onChange={setEditLang} />
          </div>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Term</label>
            <CFormInput
              value={editingItem?.term || ''}
              onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Page URL</label>
            <CFormSelect
              value={editingItem?.page?.id || ''}
              onChange={(e) => {
                const selectedPage = pages.find(p => p.id === e.target.value)
                setEditingItem({
                  ...editingItem,
                  page: selectedPage || { id: '', url: '' },
                })
              }}
            >
              <option value=""></option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.url}</option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <label className="form-label">Translation ({editLang?.name || 'No Language'})</label>
            <CFormTextarea
              rows={5}
              value={findTranslation(editingItem?.translations || [], editLang?.id)}
              onChange={(e) => {
                const updatedTranslations = updateTranslation(editingItem.translations || [], editLang.id, e.target.value)
                setEditingItem({ ...editingItem, translations: updatedTranslations })
              }}
            />
          </div>
          {errorMessage && <CAlert color="danger" className="show mb-0 mt-3">{errorMessage}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PagesContent
