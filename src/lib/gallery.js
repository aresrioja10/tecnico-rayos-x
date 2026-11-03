// Radiografías propias que añade la presentadora (se guardan en este navegador).
const DB = 'rayosx-galeria'
const STORE = 'fotos'
let memory = [] // por si el navegador no deja guardar

function open() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' })
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    } catch (e) { reject(e) }
  })
}

export async function listPhotos() {
  try {
    const db = await open()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).getAll()
      req.onsuccess = () => resolve(req.result.sort((a, b) => a.id - b.id))
      req.onerror = () => reject(req.error)
    })
  } catch { return memory }
}

export async function addPhoto(file) {
  const item = { id: Date.now() + Math.random(), name: file.name.replace(/\.[^.]+$/, ''), blob: file }
  try {
    const db = await open()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(item)
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error)
    })
  } catch { memory = [...memory, item] }
}

export async function removePhoto(id) {
  try {
    const db = await open()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error)
    })
  } catch { memory = memory.filter((m) => m.id !== id) }
}

export async function renamePhoto(id, name) {
  try {
    const db = await open()
    const all = await listPhotos()
    const item = all.find((p) => p.id === id); if (!item) return
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ ...item, name })
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error)
    })
  } catch { memory = memory.map((m) => (m.id === id ? { ...m, name } : m)) }
}

// Avisa a quien escuche cuando cambian las fotos
const listeners = new Set()
export const onGalleryChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
export const emitGalleryChange = () => listeners.forEach((fn) => fn())
