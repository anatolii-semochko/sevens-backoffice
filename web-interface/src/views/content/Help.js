import React, { useState, useEffect } from 'react'
import { fetchHelps, createHelp, putHelp, deleteHelp, swapHelpOrder, generateHelp , fetchError } from 'src/api/help'
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter,
  CFormInput, CFormTextarea, CAlert, CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilArrowTop } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { LanguageSelector } from 'src/components/AppLanguageSelector'
import { EmptyDataRow, CompletedChart } from 'src/components/table/CustomTableElements'
import { TextEditorMCE } from 'src/components/input-fields/TextEditorMCE'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'

const Help = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])
  const [visible, setVisible] = useState(false)
  const [contentModalVisible, setContentModalVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editLang, setEditLang] = useState(null)
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

  const handleEditContent = (item) => {
    setError('')
    setEditing({ ...item })
    setEditLang(selectedLanguage)
    setContentModalVisible(true)
  }

  const handleSaveContent = async () => {
    try {
      const updated = { ...editing }
      const idx = updated.contents.findIndex(t => t.language?.id === editLang?.id)
      if (idx === -1) {
        updated.contents.push({ language: editLang, name: '' })
      }
      await putHelp(updated.id, updated)
      setContentModalVisible(false)
      loadData(currentParent, breadcrumb)
    } catch (error) {
      setError(fetchError(error))
    }
  }

  const handleTextChange = (field, value) => {
    setEditing((prev) => {
      const updatedContents = [...prev.contents]
      const idx = updatedContents.findIndex(t => t.language?.id === editLang?.id)
      if (idx !== -1) {
        updatedContents[idx] = { ...updatedContents[idx], [field]: value }
      } else {
        updatedContents.push({ language: editLang, [field]: value })
      }
      return { ...prev, contents: updatedContents }
    })
  }

  const handleRemove = async (help) => {
    if (!window.confirm(`Are you sure you want to delete help "${help.name}"?`)) return
    await deleteHelp(help.id)
    loadData(currentParent, breadcrumb)
  }

  const handleSave = async () => {
    if (!editing.name) {
      setError('Name is required')
      return
    }
    try {
      editing.id
        ? await putHelp(editing.id, editing)
        : await createHelp(editing)
      setVisible(false)
      loadData(currentParent, breadcrumb)
    } catch (e) {
      setError(fetchError(e))
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

  const handleOrderUp = async (index) => {
    try {
      if (index === 0) return
      const current = items[index]
      const above = items[index - 1]
      await swapHelpOrder(current.id, above.id)
      loadData(currentParent, breadcrumb)
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const handleGenerate = async () => {
    try {
      await generateHelp().then((result) => window.toast.success(result.data?.message))
    } catch (e) {
      window.toast.error(fetchError(error))
    }
  }

  const getCompletedValue = (contents) => {
    const totalFields = 5 * languages.length
    if (totalFields === 0) return 0

    let filledFields = 0
    for (const lang of languages) {
      const entry = contents.find(content => content.language?.id === lang.id)
      if (!entry) continue
      if (entry.title?.trim()) filledFields++
      if (entry.seoKeywords?.trim()) filledFields++
      if (entry.seoDescription?.trim()) filledFields++
      if (entry.shortDescription?.trim()) filledFields++
      if (entry.description?.trim()) filledFields++
    }

    return Math.round((filledFields / totalFields) * 100)
  }

  const empty = (label) => (<i className="text-muted">no {label}</i>)

  const Breadcrumbs = () => (
    <div className="mb-3 d-flex align-items-center">
      <img
        src="/src/assets/images/up.png"
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
        <h4 className="mb-0">Help Section</h4>
        <div className="d-flex gap-2">
          <CButton color="success" size="sm" onClick={handleAdd}>
            <CIcon icon={cilPlus} /> Add
          </CButton>
          <CButton color="warning" size="sm" onClick={handleGenerate}>
            Generate Help Link Files
          </CButton>
        </div>
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
                    {item.url ? (
                      <a href="#" className="text-link-active" onClick={e => { e.preventDefault(); handleNameClick(item) }}>
                        {item.name}
                      </a>
                    ) : item.name}
                  </CTableDataCell>
                  <CTableDataCell>{item.url}</CTableDataCell>
                  <CTableDataCell>{translation?.title || empty('title')}</CTableDataCell>
                  <CTableDataCell>{translation?.shortDescription || empty('description')}</CTableDataCell>
                  <CTableDataCell><CompletedChart value={getCompletedValue(item.contents)} /></CTableDataCell>
                  <CTableDataCell className="text-nowrap">
                    <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="info" size="sm" className="me-2" onClick={() => handleEditContent(item)}>
                      Content
                    </CButton>
                    <CButton
                      className="me-2"
                      title="Move Up"
                      size="sm"
                      disabled={idx <= 0 || !item.url}
                      color={idx <= 0 || !item.url ? 'secondary' : 'info'}
                      onClick={() => handleOrderUp(idx)}
                    >
                      <CIcon icon={cilArrowTop} />
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleRemove(item)}>
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
          <CFormInput
            className="mb-3"
            value={editing?.name || ''}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            label="Name"
          />
          {editing?.id ? (
            <SecureFormInput
              value={editing?.url || ''}
              onChange={e => setEditing({ ...editing, url: e.target.value })}
              label="URL"
            />
          ) : (
            <CFormInput
              value={editing?.url || ''}
              onChange={e => setEditing({ ...editing, url: e.target.value })}
              label="URL"
            />
          )}
          {error && <CAlert color="danger" className="show mb-0 mt-3">{error}</CAlert>}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={contentModalVisible} onClose={() => setContentModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Edit <b>"{editing?.name}"</b> Content ({editLang?.name || 'No Language'})</div>
            <LanguageSelector selected={editLang} onChange={setEditLang} />
          </div>
        </CModalHeader>
        <CModalBody>
            <CFormInput
              label="Title"
              className="mb-3"
              value={editing?.contents.find(t => t.language?.id === editLang?.id)?.title || ''}
              onChange={(e) => handleTextChange('title', e.target.value)}
          />
          <CFormInput
            label="Seo Keywords"
            className="mb-3"
            value={editing?.contents.find(t => t.language?.id === editLang?.id)?.seoKeywords || ''}
            onChange={(e) => handleTextChange('seoKeywords', e.target.value)}
          />
          <CFormInput
            label="Seo Description"
            value={editing?.contents.find(t => t.language?.id === editLang?.id)?.seoDescription || ''}
            onChange={(e) => handleTextChange('seoDescription', e.target.value)}
          />
          <CFormTextarea
            rows={3}
            label="Short Description"
            className="mb-3"
            value={editing?.contents.find(t => t.language?.id === editLang?.id)?.shortDescription || ''}
            onChange={(e) => handleTextChange('shortDescription', e.target.value)}
          />
          <TextEditorMCE
            rows={5}
            label="Description"
            className="mb-3"
            value={editing?.contents.find(t => t.language?.id === editLang?.id)?.description || ''}
            onChange={(e) => handleTextChange('description', e.target.value)}
          />
          {error && <CAlert color="danger" className="show mb-0 mt-3">{error}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setContentModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveContent}>Save</CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default Help
