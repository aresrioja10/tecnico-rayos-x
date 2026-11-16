import React from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useCamera } from '../lib/camera.jsx'

export default function Settings({ onClose }) {
  const [s, update] = useSettings()
  const cam = useCamera()

  return (
    <div className="panel-wrap" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2>Ajustes de la presentación</h2>
          <button className="btn ghost" onClick={onClose}>Cerrar (Esc)</button>
        </div>
        <p className="muted">Todo lo que cambies aquí se guarda en este ordenador.</p>

        <h3>Sonido y notas</h3>
        <div className="row">
          <label><input type="checkbox" checked={s.sonido} onChange={(e) => update({ sonido: e.target.checked })} /> Sonidos activados</label>
          <label><input type="checkbox" checked={s.notas} onChange={(e) => update({ notas: e.target.checked })} /> Mostrar el guion abajo (notas)</label>
        </div>

        <h3>Cámara</h3>
        <label className="switch-row">
          <input type="checkbox" checked={!!s.camara} onChange={(e) => { update({ camara: e.target.checked }); if (!e.target.checked) cam.stop() }} />
          <span><b>Usar la cámara del portátil</b><br />
            <span className="muted">Al acabar el juego de la estatua sale una foto de la clase en rayos X.
            Si la dejas apagada, el juego funciona igual, solo que sin foto.</span></span>
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
