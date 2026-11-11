import React, { useEffect, useRef, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useCamera } from '../lib/camera.jsx'
import { addPhoto, removePhoto, renamePhoto, emitGalleryChange } from '../lib/gallery.js'

function Thumb({ p }) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState(p.name)
  useEffect(() => { const u = URL.createObjectURL(p.blob); setUrl(u); return () => URL.revokeObjectURL(u) }, [p.blob])
  return (
    <div className="thumb">
      <img src={url} alt={p.name} />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => renamePhoto(p.id, name).then(emitGalleryChange)} placeholder="¿Qué es? (respuesta)" />
      <div className="row" style={{ marginTop: 6 }}>
        <button className="btn red" onClick={() => removePhoto(p.id).then(emitGalleryChange)}>Quitar</button>
      </div>
    </div>
  )
}

export default function Settings({ onClose, photos }) {
  const [s, update] = useSettings()
  const cam = useCamera()
  const [over, setOver] = useState(false)
  const fileRef = useRef(null)

  const addFiles = async (files) => {
    for (const f of files) if (f.type.startsWith('image/')) await addPhoto(f)
    emitGalleryChange()
  }

  return (
    <div className="panel-wrap" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2>Ajustes de la presentación</h2>
          <button className="btn ghost" onClick={onClose}>Cerrar (Esc)</button>
        </div>
        <p className="muted">Todo lo que cambies aquí se guarda en este ordenador.</p>

        <h3>Tu nombre</h3>
        <label>
          Aparece en la portada: «¡Hola! Soy …»
          <input type="text" value={s.nombre} placeholder="Por ejemplo: Laura, o la mamá de Hugo" onChange={(e) => update({ nombre: e.target.value })} />
        </label>

        <h3>Sonido y notas</h3>
        <div className="row">
          <label><input type="checkbox" checked={s.sonido} onChange={(e) => update({ sonido: e.target.checked })} /> Sonidos activados</label>
          <label><input type="checkbox" checked={s.notas} onChange={(e) => update({ notas: e.target.checked })} /> Mostrar el guion abajo (notas)</label>
        </div>

        <h3>Cámara</h3>
        <label className="switch-row">
          <input type="checkbox" checked={!!s.camara} onChange={(e) => { update({ camara: e.target.checked }); if (!e.target.checked) cam.stop() }} />
          <span><b>Usar la cámara del portátil</b><br />
            <span className="muted">Activa la sorpresa del «espejo de rayos X» (los peques se ven en la pantalla como en una radiografía) y la foto de la clase al acabar el juego de la estatua.
            Si la dejas apagada, la diapositiva del espejo no aparece y el resto funciona igual.</span></span>
        </label>
        {s.camara && (
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn" onClick={cam.start}>Probar la cámara</button>
            {cam.status === 'on' && <button className="btn ghost" onClick={cam.stop}>Apagar</button>}
            <span className="muted">
              {cam.status === 'on' ? '✅ Cámara lista' : cam.status === 'asking' ? 'Esperando permiso…' : cam.status === 'error' ? `⚠️ ${cam.error}` : 'Pruébala antes de empezar'}
            </span>
          </div>
        )}

        <h3>Tus radiografías (opcional)</h3>
        <p className="muted">Añade fotos de radiografías reales o divertidas (por ejemplo, las que tengas del trabajo o encuentres en internet).
          Aparecerán en la parte de «Adivina el esqueleto» justo antes del final. Escribe debajo de cada una la respuesta (se muestra al pulsar).</p>
        <div className={`drop ${over ? 'over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); addFiles([...e.dataTransfer.files]) }}>
          Arrastra aquí las imágenes o haz clic para elegirlas
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles([...e.target.files])} />
        </div>
        {photos.length > 0 && <div className="thumbs">{photos.map((p) => <Thumb key={p.id} p={p} />)}</div>}

        <h3>Regalos para imprimir</h3>
        <div className="row">
          <button className="btn" onClick={() => { location.hash = '#imprimir' }}>Abrir dibujo para colorear y medallas</button>
        </div>

        <h3>Teclas</h3>
        <table>
          <tbody>
            <tr><td><kbd>→</kbd> <kbd>Espacio</kbd> <kbd>AvPág</kbd></td><td>Siguiente (también sirve el mando/puntero de presentaciones)</td></tr>
            <tr><td><kbd>←</kbd> <kbd>RePág</kbd></td><td>Anterior</td></tr>
            <tr><td><kbd>F</kbd></td><td>Pantalla completa</td></tr>
            <tr><td><kbd>N</kbd></td><td>Mostrar u ocultar el guion (los peques no saben leer 😉)</td></tr>
            <tr><td><kbd>G</kbd> <kbd>Esc</kbd></td><td>Ver todas las diapositivas y saltar a cualquiera</td></tr>
            <tr><td><kbd>B</kbd></td><td>Pantalla en negro (para pedir atención)</td></tr>
            <tr><td><kbd>M</kbd></td><td>Quitar o poner el sonido</td></tr>
            <tr><td><kbd>S</kbd></td><td>Este panel</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
