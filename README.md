# Centro de Ayuda BuhoManager · mockup

Mockup interactivo del Centro de Ayuda de BuhoManager. Es un sitio estático: HTML, CSS y módulos de JavaScript, sin paso de compilación ni dependencias.

Fusiona dos propuestas: de MockupChatGPT toma el selector Caja POS / Sistema Web, la ruta de videos con progreso, el paso a paso por capítulo y la grilla de módulos; de este repo, el mapa interactivo de la Caja con modo Practicar, la narración sincronizada, la hoja de atajos y la guía de Artículos.

## Recorrido

- **Caja POS** (`#caja`): portada con buscador, ruta de los videos 01 a 08 con progreso, accesos directos, la Caja de práctica (`#mapa`, `#punto-<id>`) y respuestas rápidas.
- **Caja de práctica**: réplica con la piel real de la Caja (`assets/caja`, de `light_small`) y las medidas de sus archivos `designx` (venta, cobro, búsquedas y ventanas). En Practicar responden los botones y las teclas reales del keymap.
- **Lección** (`#video-01` … `#video-08`): video, capítulos, paso a paso que se marca solo, la narración literal desplegable, "Ver en la Caja" en cada paso y "Probalo en la Caja" al final.
- **Sistema Web** (`#web`, `#web-<módulo>`): grilla de los 12 módulos y, al entrar, el menú real con la guía del módulo.

## Estructura

```
index.html              Marcado de la página
favicon.svg
vercel.json             Configuración de Vercel (URLs limpias, caché de videos)
css/
  tokens.css            Paleta oficial, colores de tarjetas y tema claro/oscuro
  base.css              Reset, encabezado con selector de entorno, portada, píldoras, controles
  caja.css              Mapa de la Caja, réplica, ventanas de práctica, inspector
  secciones.css         Ruta, accesos, respuestas, lección y Sistema Web
  overlays.css          Hoja de atajos y buscador
js/
  main.js               Punto de entrada y teclado global
  router.js             Entornos, vistas y enlaces directos
  state.js              Estado de la venta de práctica
  progress.js           Videos vistos (localStorage)
  lesson.js             Vista de lección
  web.js                Sistema Web: grilla y módulo
  cheatsheet.js         Hoja de atajos
  search.js             Buscador instantáneo (Ctrl K o /)
  overlay.js            Abrir y cerrar capas devolviendo el foco
  keys.js               Traduce las teclas del navegador al keymap de la Caja
  utils.js, icons.js    Utilidades e íconos
  data/
    videos.js           Videos: capítulos, paso a paso y narración con tiempos
    spots.js            Los 19 puntos del mapa
    content.js          Keymap real por pantalla, menú, catálogo y clientes de ejemplo, accesos, respuestas y módulos web
  caja/
    index.js            Inicio de Caja POS
    replica.js          Dibuja la réplica y recibe los toques
    actions.js          Qué hace cada botón en el modo Practicar
    dialogs.js          Cantidad, Descuento, Cambio de precio, Productos, Pago detallado
    inspector.js        Panel lateral del mapa
    player.js           Video sincronizado del panel lateral
assets/caja/            Imágenes reales de la Caja (fondos y botones de light_small)
videos/                 Tutoriales 01 a 08 en 720p
posters/                Portadas de los videos
```

El paso a paso está escrito de vos para la ayuda; la narración se transcribe literal, de usted, como suena en el video.

Para cambiar contenido casi siempre alcanza con editar `js/data/`.

## Verlo en la computadora

Los módulos de JavaScript no funcionan abriendo el archivo con doble clic; hay que servir la carpeta:

```bash
npx serve .
```

## Publicar en Vercel

El proyecto de Vercel ya está conectado a este repositorio, así que cada push publica solo.

En el proyecto, en Settings → Build and Deployment, conviene revisar:

- Framework Preset: **Other**
- Build Command: vacío
- Output Directory: vacío (la raíz del repositorio)
- Install Command: vacío

En Settings → Git, la rama de producción tiene que ser la rama donde está este código.

## Atajos

Los atajos salen del keymap de la Caja (`retail33.pos.actions`), separados por pantalla: en venta, sin venta, en el cobro y otras (arqueo, cierre de día, horario y CAEA). Las teclas "Num" son las del teclado numérico.
