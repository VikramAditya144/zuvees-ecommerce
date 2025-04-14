import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Prevent multiple renders by checking if root already exists
const rootElement = document.getElementById('root');

// Only create root if it hasn't been created already
if (!rootElement.hasChildNodes()) {
  // Register service worker
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline')
    },
  })

  ReactDOM.createRoot(rootElement).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}