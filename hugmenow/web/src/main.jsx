import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/auth.css'

// Log that the app is starting
console.log('HugMeNow app initializing...')

// Set up the root
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('Found root element, initializing React app')
  
  // Create and render the React root
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('Root element not found! Make sure there is a div with id="root" in the HTML file.')
}