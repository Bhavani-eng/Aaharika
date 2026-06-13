import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#1F2937',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)',
        },
        success: { iconTheme: { primary: '#2F855A', secondary: '#FFFFFF' } },
        error: { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
      }}
    />
  </StrictMode>,
)
