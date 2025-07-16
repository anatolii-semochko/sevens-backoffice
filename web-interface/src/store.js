import { legacy_createStore as createStore } from 'redux'

const initialState = {
  path: { // TODO - move to environment constants
    userAvatars: '/images/user-avatars/',
    storageImages: '/storage/images/',
    languageFlags: '/storage/images/language-flags/',
    categoryLogos: '/storage/images/category-logos/',
  },
  user: {
    id: null,
    loginName: '',
    fullName: null,
    email: null,
    avatar: null,
    roles: [],
  },
  userRoles: {},
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
