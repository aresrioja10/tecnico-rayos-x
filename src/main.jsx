import React from 'react'
import { createRoot } from 'react-dom/client'
import fontUrl from '@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2'
import './styles.css'
import App from './App.jsx'

const fontStyle = document.createElement('style')
fontStyle.textContent = `@font-face{font-family:'Fredoka';font-style:normal;font-display:block;font-weight:300 700;src:url(${fontUrl}) format('woff2-variations'),url(${fontUrl}) format('woff2');}`
document.head.appendChild(fontStyle)

createRoot(document.getElementById('root')).render(<App />)
