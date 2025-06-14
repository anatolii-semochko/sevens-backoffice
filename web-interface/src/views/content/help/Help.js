import React, { useState, useEffect } from 'react'
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter,
  CFormInput, CFormLabel, CFormTextarea, CAlert, CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilArrowTop } from '@coreui/icons'

import { EmptyDataRow, CompletedChart } from 'src/components/table/CustomTableElements'
import {
  fetchHelps, createHelp, putHelp, patchHelp, deleteHelp, swapHelpOrder, fetchError
} from 'src/api/help'
import { useSelector } from "react-redux";

// API-методи: fetchHelps, createHelp, updateHelp, deleteHelp, reorderHelp

const Help = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const languages = useSelector(state => state.languages)
  const selectedLanguage = useSelector(state => state.selectedLanguage)
  const langId = selectedLanguage?.id

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (parentId = null, path = []) => {
    try {
      setLoading(true)
      const data = await fetchHelps({ parentId: parentId ?? 'root' })
      setItems(data)
      setCurrentParent(parentId)
      setBreadcrumb(path)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const findTranslation = (translations, langId) => translations.find(t => t.language?.id === langId)

  const handleAdd = () => {
    setError('')
    const maxOrder = Math.max(0, ...items.map(i => i.order || 0))
    setEditing({
      id: null,
      name: '',
      url: '',
      order: maxOrder + 1,
      parentId: currentParent,
      contents: [{
        language: [],
        title: '',
        seoKeywords: '',
        seoDescription: '',
        shortDescription: '',
        description: ''
      }]
    })
    setVisible(true)
  }

  const handleEdit = (item) => {
    setError('')
    setEditing({ ...item })
    setVisible(true)
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Ви дійсно хочете видалити?')) return
    await deleteHelp(id)
    loadData(currentParent, breadcrumb)
  }

  const handleSave = async () => {
    if (!editing.name) {
      setError('Name is required')
      return
    }
    try {
      editing.id
        ? await updateHelp(editing.id, editing)
        : await createHelp(editing)
      setVisible(false)
      loadData(currentParent, breadcrumb)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleNameClick = (item) => {
    const newPath = [...breadcrumb, { id: item.id, name: item.name }]
    loadData(item.id, newPath)
  }

  const handleGoUp = () => {
    const newPath = breadcrumb.slice(0, -1)
    const parent = newPath.length ? newPath[newPath.length - 1].id : null
    loadData(parent, newPath)
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return
    await reorderHelp(items[index].id, items[index - 1].id)
    loadData(currentParent, breadcrumb)
  }

  const getCompletedValue = (translations) => {

    return 20

    // const totalFields = 5 * languages.length
    // if (totalFields === 0) return 0
    //
    // let filledFields = 0
    // for (const lang of languages) {
    //   const entry = translations.find(seo => seo.language?.id === lang.id)
    //   if (!entry) continue
    //   if (entry.name?.trim()) filledFields++
    //   if (entry.title?.trim()) filledFields++
    //   if (entry.logoAlt?.trim()) filledFields++
    //   if (entry.shortDescription?.trim()) filledFields++
    //   if (entry.description?.trim()) filledFields++
    // }
    //
    // return Math.round((filledFields / totalFields) * 100)
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
        <a className={breadcrumb.length ? 'text-link-active' : 'text-link'} onClick={() => loadData(null, [])}>Root</a>
        {breadcrumb.map((b, i) => (
          <span key={b.id}>
            {' / '}
            {i === breadcrumb.length - 1 ? (
              <span>{b.name}</span>
            ) : (
              <a className="text-link-active" onClick={() => loadData(b.id, breadcrumb.slice(0, i + 1))}>{b.name}</a>
            )}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Help Sections</h4>
        <CButton color="success" size="sm" onClick={handleAdd}>
          <CIcon icon={cilPlus} /> Add
        </CButton>
      </div>
      <CCardBody>
        <Breadcrumbs />
        <CTable className="no-border-last" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>URL</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Short Description</CTableHeaderCell>
              <CTableHeaderCell style={{ width: 60 }}></CTableHeaderCell>
              <CTableHeaderCell style={{ width: 1 }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item, idx) => {
              const translation = findTranslation(item.contents || [], langId)
              return (
                <CTableRow key={item.id}>
                  <CTableDataCell>
                    <a href="#" onClick={e => { e.preventDefault(); handleNameClick(item) }}>
                      {item.name}
                    </a>
                  </CTableDataCell>
                  <CTableDataCell>{item.url}</CTableDataCell>
                  <CTableDataCell>{translation?.title || empty('description')}</CTableDataCell>
                  <CTableDataCell>{translation?.shortDescription || empty('description')}</CTableDataCell>
                  <CTableDataCell><CompletedChart value={getCompletedValue(item.translations)} /></CTableDataCell>
                  <CTableDataCell className="text-nowrap">
                    <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="secondary" size="sm" className="me-2" onClick={() => handleMoveUp(index)} title="Move Up">
                      <CIcon icon={cilArrowTop} />
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
        {!items.length && <EmptyDataRow loading={loading} />}
      </CCardBody>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          {editing?.id ? 'Edit Help' : 'Add Help'}
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}

          <CFormLabel>Name</CFormLabel>
          <CFormInput
            value={editing?.name || ''}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            className="mb-2"
          />

          <CFormLabel>URL</CFormLabel>
          <CFormInput
            value={editing?.url || ''}
            onChange={e => setEditing({ ...editing, url: e.target.value })}
            className="mb-2"
          />

          <CFormLabel>Description</CFormLabel>
          <CFormTextarea
            rows={4}
            value={editing?.contents?.[0]?.description || ''}
            onChange={e => {
              const c = { ...editing }
              c.contents[0].description = e.target.value
              setEditing(c)
            }}
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Help
