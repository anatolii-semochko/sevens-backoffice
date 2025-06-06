import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CCard,
  CCardHeader, CCardBody, CFormSelect
} from '@coreui/react'
import { cilPen, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchPages } from 'src/api/pages'
import { fetchContent, patchContent, deleteContent, createContent } from 'src/api/pages-content'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'

const PagesContent = () => {
  const [items, setItems] = useState([])
  const [pages, setPages] = useState([])
  const [editLang, setEditLang] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [termDisabled, setTermDisabled] = useState(false)
  const [pageDisabled, setPageDisabled] = useState(false)

  const selectedLanguage = useSelector((state) => state.selectedLanguage)
  const langId = selectedLanguage?.id

  const fetchData = async () => {
    try {
      const data = await fetchContent()
      setItems(data)
    } catch (e) {
      console.error('Failed to fetch content', e)
    }
  }

  const fetchPagesData = async () => {
    try {
      const data = await fetchPages()
      setPages(data)
    } catch (e) {
      console.error('Failed to fetch pages', e)
    }
  }

  useEffect(() => {
    fetchData()
    fetchPagesData()
  }, [])

  const handleEdit = (item) => {
    setEditingItem({
      ...item,
      page: {
        id: String(item.page?.id || ''),
        url: item.page?.url || '',
      },
    })
    setEditLang(selectedLanguage)
    setTermDisabled(true)
    setPageDisabled(true)
    setModalVisible(true)
  }

  const handleCreate = () => {
    setEditingItem({
      term: '',
      page: { id: '', url: '' },
      translations: {},
    })
    setEditLang(selectedLanguage)
    setTermDisabled(false)
    setPageDisabled(false)
    setModalVisible(true)
  }

  const handleTermChange = (value) => {
    setEditingItem((prev) => ({
      ...prev,
      term: value,
    }))
  }

  const handlePageChange = (pageId) => {
    // Знайти сторінку за id
    const selectedPage = pages.find((p) => p.id === pageId)
    if (selectedPage) {
      setEditingItem((prev) => ({
        ...prev,
        page: {
          id: selectedPage.id,
          url: selectedPage.url,
        },
      }))
    } else {
      setEditingItem((prev) => ({
        ...prev,
        page: { id: '', url: '' },
      }))
    }
  }

  const handleTranslationChange = (value) => {
    setEditingItem((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [editLang?.id]: value,
      },
    }))
  }

  const handleSave = async () => {
    try {
      if (!editingItem || !editLang?.id) return

      if (editingItem.id) {
        await patchContent(editingItem.id, editingItem)
      } else {
        await createContent(editingItem)
      }

      setModalVisible(false)
      fetchData()
    } catch (e) {
      console.error('Failed to save content', e)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this term?')) return
    try {
      await deleteContent(id)
      fetchData()
    } catch (e) {
      console.error('Failed to delete content', e)
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>Pages Content</div>
        <CButton color="success" size="sm" onClick={handleCreate}>
          <CIcon icon={cilPlus} className="me-1" />
          Create Term
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable hover responsive>
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
                <CTableDataCell>{item.term || <i className="text-muted">[no term]</i>}</CTableDataCell>
                <CTableDataCell>{item.page?.url || <i className="text-muted">[no url]</i>}</CTableDataCell>
                <CTableDataCell>
                  {item.translations?.[langId] ? (
                    <span dangerouslySetInnerHTML={{ __html: item.translations[langId] }} />
                  ) : (
                    <i className="text-muted">[no translation]</i>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(item)}>
                    <CIcon icon={cilPen} />
                  </CButton>
                  <CButton size="sm" color="danger" className="me-2" onClick={() => handleDelete(item.id)}>
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
            <LanguageSelector
              selected={editLang}
              onChange={(lang) => setEditLang(lang)}
            />
          </div>
        </CModalHeader>
        <CModalBody>
          {/* TERM FIELD */}
          <div className="mb-3">
            <label className="form-label">Term</label>
            <div className="input-group">
              <CFormInput
                disabled={termDisabled}
                value={editingItem?.term || ''}
                onChange={(e) => handleTermChange(e.target.value)}
              />
              <CButton type="button" color="secondary" onClick={() => setTermDisabled(false)}>
                <CIcon icon={cilPen} />
              </CButton>
            </div>
          </div>

          {/* PAGE URL FIELD */}
          <div className="mb-3">
            <label className="form-label">Page URL</label>
            <div className="input-group">
              <CFormSelect
                disabled={pageDisabled}
                value={editingItem?.page?.id || ''}
                onChange={(e) => handlePageChange(e.target.value)}
              >
                <option value=""></option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.url}
                  </option>
                ))}
              </CFormSelect>
              <CButton type="button" color="secondary" onClick={() => setPageDisabled(false)}>
                <CIcon icon={cilPen} />
              </CButton>
            </div>
          </div>

          {/* TRANSLATION FIELD */}
          <div className="mb-3">
            <label className="form-label">
              Translation ({editLang?.name || 'No Language'})
            </label>
            <textarea
              className="form-control"
              rows={6}
              value={editingItem?.translations?.[editLang?.id] || ''}
              onChange={(e) => handleTranslationChange(e.target.value)}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default PagesContent
