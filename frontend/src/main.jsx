import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { legacy_createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import Reducers from './reducers'
import App from './App.jsx'
import './index.css'

// Initialize your Redux store just like you did in index.js
const store = legacy_createStore(Reducers, compose(applyMiddleware(thunk)))

createRoot(document.getElementById('root')).render(
  <Provider store={store}>  
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
)