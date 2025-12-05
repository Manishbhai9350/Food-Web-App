import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { AuthStore } from './redux/store/auth.store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={AuthStore} >
    <Toaster position="top-center" />
    <App />
  </Provider>
)
