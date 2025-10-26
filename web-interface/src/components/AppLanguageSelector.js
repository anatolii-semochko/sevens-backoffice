import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLanguages } from 'src/api/languages'

const LanguageSelector = ({ selected, onChange }) => {
  const dispatch = useDispatch()
  const flagsPath = useSelector((state) => state.path.languageFlags)
  const allLanguages = useSelector((state) => state.languages)
  const selectedLanguage = useSelector((state) => state.selectedLanguage)

  // 🔁 Load languages if not loaded
  useEffect(() => {
    if (!Array.isArray(allLanguages) || allLanguages.length === 0) {
      fetchLanguages().then((langs) => {
        dispatch({ type: 'set', languages: langs })
      })
    }
  }, [allLanguages, dispatch])

  // ✅ Only active languages
  const languages = useMemo(
    () => (Array.isArray(allLanguages) ? allLanguages.filter((lang) => lang.active) : []),
    [allLanguages]
  )

  const currentLang = selected || selectedLanguage

  const handleLanguageChange = (lang) => {
    onChange ? onChange(lang) : dispatch({ type: 'set', selectedLanguage: lang })
  }

  // ✅ Set default main language if none selected
  useEffect(() => {
    if (!currentLang && languages.length) {
      const mainLang = languages.find((lang) => lang.main === true)
      if (mainLang) {
        handleLanguageChange(mainLang)
      }
    }
  }, [currentLang, languages])

  const getIconKey = (code) => `cif${code[0].toUpperCase()}${code.slice(1).toLowerCase()}`

  return (
    <div className="d-flex align-items-center gap-3 mx-3">
      {languages.map((lang) => {
        const isSelected = currentLang?.code === lang.code
        return (
          <img
            key={lang.id}
            src={`${flagsPath}/${lang.code}.png`}
            title={lang.name}
            alt={lang.name}
            style={{
              cursor: 'pointer',
              opacity: isSelected ? 1 : 0.3,
              border: isSelected ? '1px solid #007bff' : 'none',
              borderRadius: '2px',
              height: '15px'
            }}
            onClick={() => handleLanguageChange(lang)}
          />
        )
      })}
    </div>
  )
}

export { LanguageSelector }
