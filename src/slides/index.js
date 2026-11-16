import { Lupa } from './s1.jsx'
import { Patio } from './s2.jsx'
import { Estatua } from './s4.jsx'
import { Balanza } from './s5.jsx'
import { QueEs, LupaPulmones, LupaTripa, CamaraGigante, LuzChaleco, NoDuele, QueVes, Puzzle, Bastoncillos } from './nuevas.jsx'

// Cada diapositiva: sección, nº de pasos (cada clic avanza un paso) y notas con el guion.
// En las notas, las líneas que empiezan por "·" son consejos para la presentadora.
// Las diapositivas antiguas que ya no salen (portada, superpoder, espejo, adivinanzas de
// animales, medalla…) siguen en s1…s6.jsx por si se quieren recuperar.
export const SLIDES = [
  // 1. ¿QUÉ ES UN TÉCNICO DE RAYOS? (≈6 min)
  { id: 'quees', section: 1, title: '¿Qué es un técnico de rayos?', C: QueEs, steps: 2,
    notes: '«¡Hola! Soy … y trabajo en el hospital. ¿Sabéis qué es un técnico de rayos?» (dejar que contesten)\n(clic) ¡CLACK! «¡Es un fotógrafo del interior del cuerpo! Hago fotos de lo que hay DENTRO de vosotros.»\n· Tu nombre se pone en Ajustes (tecla S) y sale en esta diapositiva.' },
  { id: 'lupa', section: 1, title: 'La lupa mágica: la mano', C: Lupa, steps: 2,
    notes: '«¡Mirad mi lupa mágica! ¿Qué veremos dentro de la mano?» Mueve el ratón por la mano y la lupa enseña los huesos (si no lo mueves, se pasea sola).\n(clic) «¡Huesos! La mano está llena de huesos pequeñitos.»' },
  { id: 'pulmones', section: 1, title: 'La lupa mágica: los pulmones', C: LupaPulmones, steps: 2,
    notes: '«¿Y si miramos en el pecho?» (la lupa se pasea; también la puedes mover con el ratón)\n(clic) «¡Los pulmones! Se hinchan como globos cuando respiramos. ¡Y ahí está el corazón latiendo!»\n· Que respiren hondo todos a la vez.' },
  { id: 'tripa', section: 1, title: 'La lupa mágica: la tripa', C: LupaTripa, steps: 2,
    notes: '«¿Y en la tripa? ¿Qué habrá?»\n(clic) «¡La tripa! Por aquí pasa la comida: primero el estómago y luego un tubo larguííísimo.»' },

  // 2. LA CÁMARA GIGANTE (≈4 min)
  { id: 'patio', section: 2, title: 'En el patio: ¡ay, mi brazo!', C: Patio, steps: 3,
    notes: '«Cuando nos caemos jugando en el patio…»\n(clic) «…y nos duele un brazo…»\n(clic) «…el médico necesita saber cómo está el hueso por dentro. ¡Y entonces vienen a verme a mí!»' },
  { id: 'camara', section: 2, title: 'La cámara gigante', C: CamaraGigante, steps: 2,
    notes: '«Para eso uso una cámara de fotos gigante. El niño se tumba en la camilla y debajo ponemos una placa.»\n(clic) «¡CLACK!» La placa sale y la foto se ve en la pantalla de luz.\n· Para repetir la foto, toca la máquina o el botón 📸.' },

  // 3. LUZ INVISIBLE Y CHALECO (≈4 min)
  { id: 'luz', section: 3, title: 'Luz invisible y chaleco protector', C: LuzChaleco, steps: 3,
    notes: '«Esta máquina de fotos tiene una luz invisible muy potente…»\n(clic) «…y el técnico os puede poner un chaleco…»\n(clic) «…para proteger las partes del cuerpo que no necesitan foto. Aquí solo hacemos foto de la mano.»\n· Enseña el chaleco de plomo de verdad.' },
  { id: 'balanza', section: 3, title: '¡El chaleco pesa como un gato!', C: Balanza, steps: 4,
    notes: '«¿Cuánto pesará el chaleco?» (clic) «¿Más que una pluma?» (clic) «¡Pesa como un gato!»\n(clic) «¿Quién se lo quiere probar?» Un voluntario (o la profe) se pone el chaleco.' },

  // 4. QUIETOS COMO ESTATUAS (≈5 min)
  { id: 'noduele', section: 4, title: 'No duele y es muy rápido', C: NoDuele, steps: 3,
    notes: '«Hacer estas fotos no duele nada…»\n(clic) «…y es muy rápido: ¡CLACK! y ya está.»\n(clic) «Solo tenéis que quedaros quietos como una estatua. ¿Jugamos?»' },
  { id: 'estatua', section: 4, title: '¡Juego de la estatua!', C: Estatua, steps: 4,
    notes: 'Suena música: ¡a bailar todos! (los peques pueden levantarse)\n«¡A la de tres, todos nos convertimos en estatuas de hielo! Una… (clic) dos… (clic) y… ¡TRES!» (clic)\nSe congelan 5 segundos, ¡CLACK! y «¡Perfecto! Así es exactamente como me ayudan los niños valientes en el hospital.»\n· Si activas la cámara en Ajustes, sale una foto de la clase en rayos X. «¡Otra vez!» repite el juego.' },

  // 5. ¿QUÉ VES EN LA RADIOGRAFÍA? (≈5 min)
  { id: 'queves', section: 5, title: '¿Qué ves en esta radiografía?', C: QueVes, steps: 2,
    notes: 'Enseña las placas de verdad, una a una: «¿Qué veis en esta radiografía?» (dejar que adivinen)\n(clic) La pantalla se pone blanca como una caja de luz: pon la placa delante del proyector o de la pantalla y se verá mejor. Toca la pantalla para volver.' },

  // 6. ¡A JUGAR! (≈6 min)
  { id: 'puzzle', section: 6, title: 'Juego: puzzle de radiografías', C: Puzzle, steps: 1,
    notes: '«¡Vamos a jugar! Tenemos un puzzle con radiografías de la cabeza, las manos, el cuerpo…» Repartid las piezas y que lo monten ellos en la mesa.\n· En pantalla solo salen las piezas sueltas; si tocas una, se menea.' },
  { id: 'bastoncillos', section: 6, title: 'Juego: tu radiografía con bastoncillos', C: Bastoncillos, steps: 4,
    notes: '«Ahora cada uno va a hacer su propia radiografía de la mano.» Materiales: cartulina negra, lápiz blanco, bastoncillos y pegamento.\n(clic) «Primero dibujamos el contorno de la mano.»\n(clic) «Luego pegamos los bastoncillos: son los huesos de los dedos.»\n(clic) «¡Ya tenéis vuestra radiografía de la mano!»' },
]
