import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

// La cámara del ordenador, compartida entre diapositivas (espejo de rayos X y juego de la estatua).
const Ctx = createContext(null)

export function CameraProvider({ children }) {
  const [stream, setStream] = useState(null)
  const [status, setStatus] = useState('off') // off | asking | on | error
  const [error, setError] = useState('')
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    if (streamRef.current) return streamRef.current
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('error'); setError('Este navegador no deja usar la cámara.'); return null }
    setStatus('asking')
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      streamRef.current = s; setStream(s); setStatus('on'); return s
    } catch (e) {
      setStatus('error'); setError(e?.name === 'NotAllowedError' ? 'No hay permiso para usar la cámara.' : 'No se encuentra ninguna cámara.')
      return null
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop())
    streamRef.current = null; setStream(null); setStatus('off')
  }, [])

  useEffect(() => () => streamRef.current?.getTracks().forEach((tr) => tr.stop()), [])

  return <Ctx.Provider value={{ stream, status, error, start, stop }}>{children}</Ctx.Provider>
}

export const useCamera = () => useContext(Ctx)

// Vídeo de la cámara con filtro "rayos X" (negativo azulado)
export function XrayVideo({ className = '', style, videoRef, xray = true }) {
  const { stream } = useCamera()
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (v && stream && v.srcObject !== stream) { v.srcObject = stream; v.play().catch(() => {}) }
  }, [stream])
  useEffect(() => { if (videoRef) videoRef.current = ref.current })
  return (
    <div className={`xray-video ${xray ? 'is-xray' : ''} ${className}`} style={style}>
      <video ref={ref} muted playsInline autoPlay />
      {xray && <div className="xray-video-tint" />}
      {xray && <div className="xray-video-scan" />}
    </div>
  )
}
