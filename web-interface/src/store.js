import { legacy_createStore as createStore } from 'redux'

const initialState = {
  path: { // TODO - move to environment constants
    userAvatars: '/images/user-avatars/',
    languageFlags: '/storage/images/language-flags/',
    categoryLogos: '/storage/images/category-logos/',
  },
  sidebarShow: true,
  theme: 'light',
  languages: [],
  selectedLanguage: null,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
