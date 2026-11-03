# ¡Visión de Rayos X! · Presentación para la clase de 5 años

Presentación interactiva para explicar el trabajo de técnica de rayos X a peques de 5 años (20–30 min), siguiendo el guion en 6 partes.

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

- **Tu nombre**: sale en la portada («¡Hola! Soy …»).
- **Probar la cámara**: para la sorpresa del «espejo de rayos X» (los peques se ven en la pantalla en modo radiografía) y para la foto de la clase al final del juego de la estatua. Si en el cole no hay cámara o no da permiso, esas diapositivas funcionan igual con dibujos.
- **Tus radiografías (opcional)**: arrastra fotos de radiografías reales o divertidas (el truco final de Homer o del muñeco de Lego que buscabas en internet, o radiografías del trabajo). Escribe debajo de cada una la respuesta. Aparecen en «Adivina el esqueleto» justo antes del robot. Se guardan en ese ordenador, así que hazlo en el portátil que vayas a usar.
- **Regalos para imprimir**: el dibujo de Esqueletín para colorear y una hoja con 6 medallas «Súper valiente · Rayos X». También van ya listos en `regalos-para-imprimir.pdf`.

## Lo que hay en cada parte

1. **¡Mi superpoder!** (≈3 min): portada con un escáner que va enseñando el esqueleto, «¿qué vemos en la mano?», la lupa mágica que enseña los huesos (se mueve con el ratón), la superheroína de los rayos X y la sorpresa del espejo de rayos X con la cámara.
2. **Fotógrafa de huesos** (≈5 min): la cámara que hace fotos de huesos, la caída en el patio («¡ay!»), y la cámara gigante y mágica: no hace daño, no toca, no pincha… ¡CLACK! y la foto aparece en el ordenador. El botón rojo repite el CLACK.
3. **¡Adivina el esqueleto!** (≈10 min): la mano (contamos los dedos juntos), perro, gato, pez, osito de peluche («¡no tiene huesos!»), tus radiografías y el truco final: ¡un robot con engranajes!
4. **Juego de la estatua** (≈5 min): si te mueves, la foto sale borrosa; quieto, sale perfecta. Luego el juego: suena música para bailar, «una, dos y… ¡tres!» y todos congelados 5 segundos. Con «¡Otra vez!» se repite.
5. **El súper traje** (≈5 min): la armadura mágica cae sobre una niña («¡pesa un poco!»), los rayos rebotan y es ¡invencible! Luego la balanza: pesa más que una pluma… ¡pesa como un gato! y «¿quién se lo prueba?».
6. **¡Un regalo!** (≈5 min): «no hay que tener miedo», la tira de tres viñetas (¡ay! → ¡clack! → ¡curado!), la medalla de superhéroes y la despedida con lluvia de huesos.

Algunos personajes reaccionan si los tocas (el niño de la portada, la superheroína, la medalla, la pantalla final).

## Para quien quiera tocar el código

Es un proyecto React + Vite: el código está en esta misma carpeta.

```bash
npm install
npm run dev      # para verla mientras se edita
npm run build    # genera dist/index.html (un único archivo, sin internet)
```

- Diapositivas, orden, pasos y notas del guion: `src/slides/index.js`
- Cada parte: `src/slides/s1.jsx` … `s6.jsx`
- Dibujos (personajes, mano, animales, máquina, medalla): `src/art/`
- Sonidos (todos sintetizados, sin archivos): `src/lib/sound.js`
