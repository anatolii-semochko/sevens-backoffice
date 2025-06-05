import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CIcon } from '@coreui/icons-react'
import { flagSet } from '@coreui/icons'
import { fetchLanguages } from 'src/api/languages'

const LanguageSelector = ({ size = 'xl', selected, onChange }) => {
  const dispatch = useDispatch()
  const allLanguages = useSelector((state) => state.languages)
  const selectedLanguage = useSelector((state) => state.selectedLanguage)

  // 🔁 Load languages if not loaded
  useEffect(() => {
    if (!allLanguages || allLanguages.length === 0) {
      fetchLanguages().then((langs) => {
        dispatch({ type: 'set', languages: langs })
      })
    }
  }, [allLanguages, dispatch])

  // ✅ Only active languages
  const languages = useMemo(
    () => allLanguages.filter((lang) => lang.active),
    [allLanguages]
  )

  const currentLang = selected || selectedLanguage

  const handleLanguageChange = (lang) => {
    onChange ? onChange(lang) : dispatch({ type: 'set', selectedLanguage: lang })
  }

  // ✅ Set default main language if none selected
  useEffect(() => {
    if (!currentLang && languages.length) {
      const mainLang = languages.find((lang) => lang.main === 1)
      if (mainLang) {
        handleLanguageChange(mainLang)
      }
    }
  }, [currentLang, languages])

  const getIconKey = (code) => `cif${code[0].toUpperCase()}${code.slice(1).toLowerCase()}`

  return (
    <div className="d-flex align-items-center gap-3">
      {languages.map((lang) => {
        const iconKey = getIconKey(lang.code)
        const isSelected = currentLang?.code === lang.code
        const flagIcon = flagSet[iconKey]
        return flagIcon ? (
          <CIcon
            key={lang.id}
            icon={flagIcon}
            size={size}
            title={lang.name}
            onClick={() => handleLanguageChange(lang)}
            style={{
              cursor: 'pointer',
              opacity: isSelected ? 1 : 0.5,
              border: isSelected ? '1px solid #007bff' : 'none',
              borderRadius: '3px',
            }}
          />
        ) : (
          <span key={lang.id}>{lang.code}</span>
        )
      })}
    </div>
  )
}

export { LanguageSelector }
