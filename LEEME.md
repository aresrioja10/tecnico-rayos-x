# ¡Visión de Rayos X! · Presentación para la clase de 5 años

Presentación interactiva para explicar el trabajo de técnica de rayos X a peques de 5 años (20–30 min), siguiendo el guion en 6 partes (12 diapositivas).

## Cómo abrirla

1. Copia **`presentacion-rayos-x.html`** al portátil que vayas a llevar al cole (o a un USB).
2. Ábrela con doble clic. Mejor en **Google Chrome** o **Edge**. **No necesita internet.**
3. Pulsa **F** para pantalla completa.

## Cómo se maneja

Cada clic (o flecha →) avanza **un paso**: dentro de una diapositiva van apareciendo cosas, igual que en PowerPoint. Funciona con el mando/puntero de presentaciones.

| Tecla | Qué hace |
|---|---|
| → · Espacio · AvPág | Siguiente |
| ← · RePág | Anterior |
| F | Pantalla completa |
| N | Enseña el guion abajo (los peques no saben leer 😉) y un cronómetro |
| G o Esc | Ver todas las diapositivas y saltar a cualquiera |
| B | Pantalla en negro (para pedir atención) |
| M | Quitar o poner el sonido |
| S | Ajustes |

## Antes del día (5 minutos)

En **Ajustes (tecla S)**:

- **Usar la cámara del portátil** (viene apagada): si la activas, al acabar el juego de la estatua sale una foto de la clase en modo radiografía. Con la cámara apagada el juego funciona igual, solo que sin foto. Si la activas, pulsa «Probar la cámara» antes de empezar para dar permiso.
- **Regalos para imprimir**: el dibujo de Esqueletín para colorear y una hoja con 6 medallas «Súper valiente · Rayos X». También van ya listos en `regalos-para-imprimir.pdf`.

Para el día: las **placas de verdad** (para «¿Qué ves en esta radiografía?»), las piezas del **puzzle** y, para cada peque, **cartulina negra, lápiz blanco, bastoncillos y pegamento**.

## Lo que hay en cada parte

1. **¿Qué es una técnica de rayos?** (≈6 min): «¡Hola! Soy Bea», la pregunta y, al hacer clic, la cámara hace ¡CLACK! y se ve al niño por dentro: «¡una fotógrafa de huesos!». Después, la lupa mágica (se mueve con el ratón o se pasea sola) enseña por dentro una mano (los huesos), el pecho (los pulmones que se hinchan y el corazón que late) y «¿y aquí?»: la tripa.
2. **La cámara gigante** (≈4 min): la caída en el patio («¡ay!», ¿cómo está el hueso?) y la cámara gigante, sin textos: una placa del brazo. La placa va a la mesa, el niño, sentado, apoya el brazo encima, ¡CLACK!, y la radiografía del brazo y la mano aparece en la pantalla de luz. Para repetirlo, toca la máquina o el botón 📸.
3. **El chaleco protector** (≈3 min): «esta máquina tiene una luz invisible muy potente», el chaleco cae sobre la niña («¡pesa un poco!») y la luz que rebota se queda en el chaleco: solo sale en la foto la mano.
4. **Quietos como estatuas** (≈5 min): no duele, es muy rápido (¡CLACK! y ya está) y solo hay que quedarse quieto como una estatua. Luego el juego: suena música para bailar, «una, dos y… ¡tres!» y todos congelados 5 segundos. Con «¡Otra vez!» se repite.
5. **¿Qué ves en esta radiografía?** (≈5 min): una pantalla de luz con interrogantes mientras enseñas las placas de verdad. Con un clic la pantalla se pone blanca, como un negatoscopio, para ponerlas delante; tocándola vuelve.
6. **¡A jugar!** (≈6 min): el puzzle de radiografías (en pantalla salen las piezas sueltas: cabeza, pecho, manos, tripa y piernas; lo montan los peques en la mesa) y «haz tu radiografía de la mano»: los materiales, dibujar la mano, pegar los bastoncillos como huesos y… ¡radiografía terminada!

## Para quien quiera tocar el código

Es un proyecto React + Vite: el código está en esta misma carpeta.

```bash
npm install
npm run dev      # para verla mientras se edita
npm run build    # genera dist/index.html (un único archivo, sin internet)
```

- Diapositivas, orden, pasos y notas del guion: `src/slides/index.js`
- Diapositivas nuevas (pregunta, lupa de pulmones y tripa, cámara gigante, chaleco, «no duele», «¿qué ves?», puzzle y bastoncillos): `src/slides/nuevas.jsx`
- Las demás (lupa de la mano, patio, estatua) y las antiguas que ya no salen pero se pueden recuperar (portada, superpoder, espejo, animales, báscula, medalla…): `src/slides/s1.jsx` … `s6.jsx`
- Dibujos (personajes, mano, animales, máquina, medalla): `src/art/`
- Sonidos (todos sintetizados, sin archivos): `src/lib/sound.js`
