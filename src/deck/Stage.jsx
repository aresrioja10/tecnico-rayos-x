import React, { useEffect, useState } from 'react'

export const W = 1920, H = 1080

export function useStageScale() {
  const get = () => Math.min(window.innerWidth / W, window.innerHeight / H)
  const [s, setS] = useState(get)
  useEffect(() => {
    const f = () => setS(get())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return s
}

export function Stage({ children, style }) {
  const s = useStageScale()
  return (
    <div className="stage" style={{ transform: `scale(${s}) translate(-50%, -50%)`, ...style }}>
      {children}
    </div>
  )
}
