import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext'
import { UsageLimitProvider } from './context/UsageLimitContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsageLimitProvider>
          <App />
        </UsageLimitProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
