import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CFormLabel,
  CCardBody, CFormTextarea, CAlert,
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { fetchPages, createPage, patchPage, deletePage, fetchError } from 'src/api/pages'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'
import { CompletedChart } from "src/components//Table/Row/CompletedChart"
import { PaginatorInfo, PaginatorControls } from "../../../components/Table/Paginator"

const Pages = () => {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editLang, setEditLang] = useState(null)
  const [textModalVisible, setTextModalVisible] = useState(false)
  const [textEditingItem, setTextEditingItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const languages = useSelector(state => state.languages)
  const selectedLanguage = useSelector(state => state.selectedLanguage)
  const langId = selectedLanguage?.id

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const fetchData = async () => {
    try {
      const response = await fetchPages({ page: currentPage, limit: pageSize })
      setItems(response.items)
      setTotalItems(response.total)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

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

  const getCompletedValue = (seoArray) => {
    const totalFields = 4 * languages.length
    if (totalFields === 0) return 0

    let filledFields = 0
    for (const lang of languages) {
      const entry = seoArray.find(seo => seo.language?.id === lang.id)
      if (!entry) continue
      if (entry.breadcrumbs?.trim()) filledFields++
      if (entry.title?.trim()) filledFields++
      if (entry.keywords?.trim()) filledFields++
      if (entry.description?.trim()) filledFields++
    }

    return Math.round((filledFields / totalFields) * 100)
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Pages</h4>
        <PaginatorInfo
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} className="me-1 pt-1" /> Add page
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
              <CTableHeaderCell style={{ width: 60 }}></CTableHeaderCell>
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
                  <CTableDataCell><CompletedChart value={getCompletedValue(item.seo)} /></CTableDataCell>
                  <CTableDataCell className="text-nowrap" style={{ width: 1 }}>
                    <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton size="sm" color="info" className="me-2" onClick={() => handleEditText(item)}>
                      SEO
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
        <PaginatorControls
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
        />
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
