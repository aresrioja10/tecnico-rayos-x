import { Portada, Pregunta, Lupa, Superpoder, Espejo } from './s1.jsx'
import { Fotografa, Patio, CamaraMagica } from './s2.jsx'
import { AdivinaIntro, CuantosHuesos, Perro, Gato, Murcielago, RobotSlide, Galeria } from './s3.jsx'
import { Borrosa, Estatua } from './s4.jsx'
import { Armadura, Balanza } from './s5.jsx'
import { NoMiedo, Medalla, Adios } from './s6.jsx'

// Cada diapositiva: sección, nº de pasos (cada clic avanza un paso) y notas con el guion.
// En las notas, las líneas que empiezan por "·" son consejos para la presentadora.
export const SLIDES = [
  // 1. INTRODUCCIÓN: EL SUPERPODER (≈3 min)
  { id: 'portada', section: 1, title: '¡Hola! Visión de Rayos X', C: Portada, steps: 1,
    notes: 'Me presento: «¡Hola! Soy … y trabajo en el hospital».\n· Si tocas al niño de la derecha, salta. La barra azul va enseñando su esqueleto.\n· Tu nombre se pone en Ajustes (tecla S).' },
  { id: 'pregunta', section: 1, title: '¿Qué vemos en la mano?', C: Pregunta, steps: 3,
    notes: '«¿Alguien sabe qué pasa si nos miramos la mano?»\n(clic) «Vemos piel y uñas, ¿verdad?»\n(clic) «¿Y si os digo que yo puedo ver lo que hay DENTRO de la mano sin tocarla?»' },
  { id: 'lupa', section: 1, title: 'La lupa mágica', C: Lupa, steps: 2,
    notes: '«¡Mirad mi lupa mágica!» Mueve el ratón por la mano y la lupa enseña los huesos (si no lo mueves, se pasea sola).\n(clic) ¡Se ven todos los huesos!' },
  { id: 'superpoder', section: 1, title: '¡Tengo visión de Rayos X!', C: Superpoder, steps: 1,
    notes: '«¡Tengo el poder de la visión de Rayos X, como los superhéroes!»\n· Si tocas a la superheroína, da una vuelta.' },
  { id: 'espejo', section: 1, title: 'Sorpresa: el espejo de rayos X', C: Espejo, steps: 2, skipIf: ({ settings }) => !settings.camara,
    notes: '«¿Queréis que os mire con mis rayos X?»\n(clic o botón) Se enciende la cámara del portátil con efecto rayos X y los peques se ven en la pantalla.\n· Solo aparece si activas la cámara en Ajustes (tecla S). Si aun así falla, salen esqueletos bailando.' },

  // 2. ¿QUÉ ES UN TÉCNICO DE RAYOS? (≈5 min)
  { id: 'fotografa', section: 2, title: 'Fotógrafa de huesos', C: Fotografa, steps: 4,
    notes: '«Mi trabajo es ser la fotógrafa de los huesos.»\n(clic, clic, clic) Cada clic hace una foto de huesos: una mano, un esqueleto y un hueso.' },
  { id: 'patio', section: 2, title: 'En el patio: ¡ay, mi brazo!', C: Patio, steps: 3,
    notes: '«Cuando nos caemos jugando en el patio…»\n(clic) «…y nos duele un brazo…»\n(clic) «…el médico necesita saber cómo está el hueso por dentro.»' },
  { id: 'camara', section: 2, title: 'La cámara gigante y mágica', C: CamaraMagica, steps: 5,
    notes: '«Para eso uso una cámara de fotos gigante y mágica.»\n(clic) «No hace daño…» (clic) «…no toca el cuerpo…» (clic) «…y no pincha.»\n(clic) «Solo hace un ruido divertido: ¡CLACK! y… ¡magia! La foto aparece en mi ordenador.»\n· El botón rojo ¡CLACK! repite la foto todas las veces que queráis.' },

  // 3. ADIVINA EL ESQUELETO (≈10 min)
  { id: 'adivina', section: 3, title: '¡Adivina el esqueleto!', C: AdivinaIntro, steps: 1,
    notes: '«Ahora vamos a jugar. Yo os enseño fotos de huesos y vosotros adivináis de quién son.»' },
  { id: 'mano', section: 3, title: 'Una mano: ¿cuántos huesos?', C: CuantosHuesos, steps: 4,
    notes: '«¿Qué es esto?» (dejar que adivinen)\n(clic) «¡Una mano!»\n(clic) «¿Cuántos huesos creéis que tiene una mano? ¿5? ¿10? ¿100?» (que digan números)\n(clic) Los huesos se encienden uno a uno y el número sube solo hasta… «¡27 huesos! ¡Y otros 27 en la otra mano!»' },
  { id: 'perro', section: 3, title: '¿Quién es? Un perro', C: Perro, steps: 2,
    notes: '«¿De quién son estos huesos?» (dejar que adivinen: tiene cola, cuatro patas…)\n(clic o tocar la foto) «¡Un perro! Los animales también tienen huesos.»' },
  { id: 'gato', section: 3, title: '¿Quién es? Un gato', C: Gato, steps: 2,
    notes: '«¿Y este? Tiene una cola muuuy larga y orejas puntiagudas…»\n(clic) «¡Un gato!»' },
  { id: 'murcielago', section: 3, title: '¿Quién es? Un murciélago (¡el difícil!)', C: Murcielago, steps: 3,
    notes: '«¡Este es muy difícil! ¿Quién será?» (pistas: tiene orejas grandes, vuela de noche, duerme boca abajo…)\n(clic o tocar la foto) «¡Un murciélago!»\n(clic) «¿Veis sus alas? ¡Son manos con dedos larguísimos! Tienen huesos como los nuestros.»' },
  { id: 'galeria', section: 3, title: 'Tus radiografías', C: Galeria,
    steps: ({ photos }) => Math.max(1, photos.length * 2), skipIf: ({ photos }) => photos.length === 0,
    notes: 'Tus propias radiografías (las añades en Ajustes, tecla S).\nCada foto: (clic) se muestra la respuesta que escribiste.' },
  { id: 'robot', section: 3, title: 'El truco final: ¡un robot!', C: RobotSlide, steps: 3,
    notes: 'EL TRUCO FINAL: «¿Y esto? ¡Qué huesos más raros!»\n(clic) «¡Un robot!»\n(clic) «Los robots no tienen huesos: ¡tienen engranajes y una pila!»' },

  // 4. EL JUEGO DE LA ESTATUA (≈5 min)
  { id: 'borrosa', section: 4, title: 'Si te mueves, sale borrosa', C: Borrosa, steps: 4,
    notes: '«Para que la foto de los huesos salga guapa y no salga borrosa…»\n(clic) Si nos movemos: ¡CLACK! sale borrosa.\n(clic) «…hay que hacer el juego de la estatua.»\n(clic) Quietos: ¡CLACK! ¡foto perfecta!' },
  { id: 'estatua', section: 4, title: '¡Juego de la estatua!', C: Estatua, steps: 4,
    notes: 'Suena música: ¡a bailar todos! (los peques pueden levantarse)\n«¡A la de tres, todos nos convertimos en estatuas de hielo! Una… (clic) dos… (clic) y… ¡TRES!» (clic)\nSe congelan 5 segundos, ¡CLACK! y «¡Perfecto! Así es exactamente como me ayudan los niños valientes en el hospital.»\n· Si activaste la cámara en Ajustes, sale una foto de la clase en rayos X. «¡Otra vez!» repite el juego.' },

  // 5. EL SÚPER TRAJE DE PLOMO (≈5 min)
  { id: 'armadura', section: 5, title: 'La armadura mágica', C: Armadura, steps: 3,
    notes: '«A veces, para protegernos de la súper energía de la cámara, nos ponemos una armadura mágica.»\n(clic) «¡Es un chaleco que pesa un poco…»\n(clic) «…pero nos hace INVENCIBLES!»\n· Enseña el delantal de plomo de verdad.' },
  { id: 'balanza', section: 5, title: '¡Pesa como un gato!', C: Balanza, steps: 4,
    notes: '«¿Cuánto pesará?» (clic) «¿Más que una pluma?» (clic) «¡Pesa como un gato!»\n(clic) «¿Quién se lo quiere probar?» Un voluntario (o la profe) se pone el chaleco.' },

  // 6. DESPEDIDA Y REGALO (≈5 min)
  { id: 'nomiedo', section: 6, title: '¡No hay que tener miedo!', C: NoMiedo, steps: 3,
    notes: '«Así que ya sabéis: si alguna vez os dais un golpe y tenéis que ir a ver a un fotógrafo de huesos como yo, ¡no hay que tener miedo!»\n(clic) «Es solo una foto mágica…» (clic) «…para curaros más rápido.»' },
  { id: 'medalla', section: 6, title: 'Medalla de superhéroe', C: Medalla, steps: 1,
    notes: 'Repartir el regalo: la medalla de superhéroe o el dibujo para colorear.\n· Se imprimen desde Ajustes (tecla S) → «Regalos para imprimir».' },
  { id: 'adios', section: 6, title: '¡Gracias y hasta pronto!', C: Adios, steps: 1,
    notes: '¡Gracias! Si tocas la pantalla, llueven huesos.' },
]
