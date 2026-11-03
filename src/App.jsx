import React, { useEffect, useState } from 'react'
import { SettingsProvider } from './lib/settings.jsx'
import { CameraProvider } from './lib/camera.jsx'
import Defs from './art/Defs.jsx'
import Deck from './deck/Deck.jsx'
import PrintPage from './print/PrintPage.jsx'

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const f = () => setHash(location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return (
    <SettingsProvider>
      <CameraProvider>
        <Defs />
        {hash.startsWith('#imprimir') ? <PrintPage /> : <Deck />}
      </CameraProvider>
    </SettingsProvider>
  )
}
