import React, { createContext, useContext, useEffect, useState } from 'react'
import { setMuted } from './sound.js'

const KEY = 'rayosx-ajustes-v1'
const DEFAULTS = { nombre: '', sonido: true, notas: false }

function load() {
  try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) } } catch { return { ...DEFAULTS } }
}

const Ctx = createContext(null)

export function SettingsProvider({ children }) {
  const [s, setS] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* sin almacenamiento: no pasa nada */ }
    setMuted(!s.sonido)
  }, [s])
  const update = (patch) => setS((prev) => ({ ...prev, ...patch }))
  return <Ctx.Provider value={[s, update]}>{children}</Ctx.Provider>
}

export const useSettings = () => useContext(Ctx)
