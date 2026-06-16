import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPersistence } from './lib/persistence'

// Em modo Electron, hidrata o store a partir do banco local antes de renderizar
// (evita "piscar" os dados de seed). Em modo web, initPersistence resolve
// imediatamente sem efeito.
initPersistence().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
