// "dev": "vite --host 0.0.0.0",
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '@descope/react-sdk';
import './editor-theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider projectId={import.meta.env.VITE_AUTHENTICATION_DESCOPE_ID}>
        <App />
      </AuthProvider>
    </BrowserRouter> 
    
  //</React.StrictMode>,
)