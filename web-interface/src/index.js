import 'core-js'
import './wallet'
import App from './App'
import React from 'react'
import store from './store'
import { Buffer } from 'buffer'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import process from 'process'
import util from 'util'

window.Buffer = Buffer
window.process = process
window.util = util
if (!global) {
  window.global = window
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
