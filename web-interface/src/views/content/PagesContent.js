import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { roles, AccessDeniedBlock } from 'src/components/utils/Permissions'
import { fetchPages } from 'src/api/pages'
import {
  fetchContent, patchContent, deleteContent,
  createContent, generateContent, fetchError
} from 'src/api/pages-content'
import {
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput,
  CCardBody, CFormSelect, CAlert
} from '@coreui/react'
import { cilPen, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { LanguageSelector } from 'src/components/AppLanguageSelector'
import { CompletedChart, EmptyDataRow } from 'src/components/table/CustomTableElements'
import { PaginatorControls, PaginatorInfo } from 'src/components/table/Paginator'
import { TextEditorMCE } from 'src/components/input-fields/TextEditorMCE'

const PagesContent = () => {
  if (!roles().editor) {
    return <AccessDeniedBlock />
  }
  const [items, setItems] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editLang, setEditLang] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const languages = useSelector(state => state.languages)
  const selectedLanguage = useSelector((state) => state.selectedLanguage)
  const langId = selectedLanguage?.id

  const [termFilter, setTermFilter] = useState('')
  const [pageUrlFilter, setPageUrlFilter] = useState('')
  const [translationFilter, setTranslationFilter] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [debouncedPageUrl, setDebouncedPageUrl] = useState('')
  const [debouncedTranslation, setDebouncedTranslation] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(termFilter)
      setDebouncedPageUrl(pageUrlFilter)
      setDebouncedTranslation(translationFilter)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(handler)
  }, [termFilter, pageUrlFilter, translationFilter])
  const isFiltered = termFilter || pageUrlFilter || translationFilter
  const handleClearFilter = () => {
    setTermFilter('')
    setPageUrlFilter('')
    setTranslationFilter('')
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetchContent({
        page: currentPage,
        limit: pageSize,
        term: debouncedTerm,
        pageUrl: debouncedPageUrl,
        translation: debouncedTranslation,
      })
      setItems(response.items)
      setTotalItems(response.total)
      if (!response.items.length) {
        setCurrentPage(1)
      }
    } catch (e) {
      window.toast.error(fetchError(e))
    }
    setLoading(false)
  }

  const fetchPagesData = async () => {
    try {
      const data = await fetchPages()
      setPages(data.items)
    } catch (e) {
      window.toast.error(fetchError(e))
    }
  }

  useEffect(() => {
    fetchData()
    fetchPagesData()
  }, [currentPage, pageSize, debouncedTerm, debouncedPageUrl, debouncedTranslation])

  const findTranslation = (translations, langId) => translations?.find(t => t.language?.id === langId)?.translation || ''

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

  const handleDelete = async (term) => {
    if (!window.confirm(`Are you sure you want to delete term "${term.term}"?`)) return
    try {
      await deleteContent(term.id)
      fetchData()
    } catch (e) {
      window.toast.error(fetchError(e))
    }
  }

  const handleGenerate = async () => {
    try {
      await generateContent().then((result) => window.toast.success(result.data?.message))
    } catch (error) {
      window.toast.error(fetchError(error))
    }
  }

  const getCompletedValue = (translationsArray) => {
    if (!languages?.length) return 0

    const totalFields = languages.length
    let filledFields = 0

    for (const lang of languages) {
      const entry = translationsArray.find(translation => translation.language?.id === lang.id)
      if (entry?.translation?.trim()) {
        filledFields++
      }
    }

    return Math.round((filledFields / totalFields) * 100)
  }

  return (
    <div className="card p-4 pb-0 mb-4">
      <div className="d-flex justify-content-between align-items-center mt-2 mx-4">
        <h4 className="mb-0">Terms and Translations</h4>
        <PaginatorInfo
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
        <div className="d-flex gap-2">
          {isFiltered && <CButton color="danger" size="sm" onClick={handleClearFilter}>Clear Filter</CButton>}
          <div className="d-flex gap-2">
            <CButton color="success" size="sm" onClick={handleCreate}>
              <CIcon icon={cilPlus} className="me-1 pt-1"/> Add Term
            </CButton>
            <CButton color="warning" size="sm" onClick={handleGenerate}>
              Generate Term Translation Files
            </CButton>
          </div>
        </div>
        </div>
        <CCardBody>
          <CTable className="no-border-last" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>
                  <CFormInput
                    type="text"
                    size="sm"
                    placeholder="Term"
                    value={termFilter}
                    onChange={(e) => setTermFilter(e.target.value)}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>
                  <CFormInput
                    type="text"
                    size="sm"
                    placeholder="Page URL"
                    value={pageUrlFilter}
                    onChange={(e) => setPageUrlFilter(e.target.value)}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>
                  <CFormInput
                    type="text"
                    size="sm"
                    placeholder="Translation"
                    value={translationFilter}
                    onChange={(e) => setTranslationFilter(e.target.value)}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 60}}></CTableHeaderCell>
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
                      <span dangerouslySetInnerHTML={{__html: findTranslation(item.translations, langId)}}/>
                    ) : (
                      <i className="text-muted">no translation</i>
                    )}
                  </CTableDataCell>
                  <CTableDataCell><CompletedChart value={getCompletedValue(item.translations)}/></CTableDataCell>
                  <CTableDataCell className="text-nowrap" style={{width: 1}}>
                    <CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(item)}>
                      <CIcon icon={cilPen}/>
                    </CButton>
                    <CButton size="sm" color="danger" onClick={() => handleDelete(item)}>
                      <CIcon icon={cilTrash}/>
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {!items.length && <EmptyDataRow loading={loading} text={'No results found.'}/>}
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

        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader closeButton>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>{editingItem?.id ? 'Edit Term' : 'Create Term'}</div>
              <LanguageSelector selected={editLang} onChange={setEditLang}/>
            </div>
          </CModalHeader>
          <CModalBody>
            <CFormInput
              label="Term"
              className="mb-3"
              value={editingItem?.term || ''}
              onChange={(e) => setEditingItem({...editingItem, term: e.target.value})}
            />
            <CFormSelect
              label="Page"
              className="mb-3"
              value={editingItem?.page?.id || ''}
              onChange={(e) => {
                const selectedPage = pages.find(p => p.id === e.target.value)
                setEditingItem({
                  ...editingItem,
                  page: selectedPage || {id: '', url: ''},
                })
              }}
            >
              <option value=""></option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.url}</option>
              ))}
            </CFormSelect>
            <TextEditorMCE
              label={'Translation ' + (editLang?.name || 'No Language')}
              className="mb-3"
              rows={5}
              value={findTranslation(editingItem?.translations || [], editLang?.id)}
              onChange={(e) => {
                const updatedTranslations = updateTranslation(editingItem.translations || [], editLang.id, e.target.value)
                setEditingItem({...editingItem, translations: updatedTranslations})
              }}
            />
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
