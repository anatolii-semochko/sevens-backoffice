import React, { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import tinymce from 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'

// Плагіни TinyMCE
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/charmap'

const TextEditorMCE = ({
  label,
  className = '',
  rows = 5,
  value = '',
  onChange,
}) => {
  const containsHTML = (text) => /<\/?[a-z][\s\S]*>/i.test(text)
  const [content, setContent] = useState(value)
  const [isPlainText, setIsPlainText] = useState(() => !containsHTML(value))

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent)
    onChange?.({ target: { value: newContent, name: editor.id } })
  }

  const handleTextareaChange = (e) => {
    setContent(e.target.value)
    onChange?.(e)
  }

  const toggleMode = () => setIsPlainText((prev) => !prev)

  return (
    <div className={`editor-wrapper ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        {label && <label className="form-label d-block mb-0">{label}</label>}
        <button
          type="button"
          className="btn btn-sm"
          style={{ marginRight: '1px' }}
          onClick={toggleMode}
        >
          {isPlainText ? '✏️ Text Mode' : '🖋 HTML Mode'}
        </button>
      </div>

      {isPlainText ? (
        <textarea
          className="form-control"
          style={{ height: rows * 100 }}
          rows={rows}
          value={content}
          onChange={handleTextareaChange}
        />
      ) : (
        <Editor
          id={`tinymce-editor-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            base_url: '/node_modules/tinymce',
            height: rows * 100,
            menubar: true,
            plugins: [
              'code', 'link', 'image', 'table', 'lists', 'color', 'advlist',
              'visualblocks', 'fullscreen', 'charmap',
            ],
            toolbar:
              'undo redo | styleselect | bold italic underline | forecolor backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | link image table | code fullscreen',
            branding: false,
          }}
        />
      )}
    </div>
  )
}

export { TextEditorMCE }
