# Centro de Ayuda BuhoManager · mockup

Mockup interactivo del Centro de Ayuda de BuhoManager. Es un sitio estático: HTML, CSS y módulos de JavaScript, sin paso de compilación ni dependencias.

## Estructura

```
index.html              Marcado de la página (pestañas, réplica, overlays)
favicon.svg
vercel.json             Configuración de Vercel (URLs limpias, caché de videos)
css/
  tokens.css            Paleta oficial y tema claro/oscuro
  base.css              Reset, encabezado, pestañas, píldoras, controles
  caja.css              Mapa de la Caja, réplica, ventanas de práctica, inspector
  secciones.css         Respuestas rápidas, Videos, Sistema web
  overlays.css          Hoja de atajos y buscador
js/
  main.js               Punto de entrada y teclado global
  router.js             Pestañas y enlaces directos (#caja, #videos, #web, #punto-<id>, #video-<nn>)
  state.js              Estado de la venta de práctica
  utils.js              Utilidades (DOM, formato, búsqueda sin tildes)
  icons.js              Íconos SVG
  data/
    spots.js            Los 19 puntos del mapa: textos, atajos, tramos de video
    videos.js           Videos, capítulos y transcripciones con tiempos
    content.js          Atajos, catálogo de ejemplo, medios de pago, respuestas rápidas, módulos web
  caja/
    index.js            Arma la pestaña Mapa de la Caja
    replica.js          Dibuja la réplica y recibe los toques
    actions.js          Qué hace cada botón en el modo Practicar
    dialogs.js          Cantidad, Descuento, Cambio de precio, Productos, Pago detallado
    inspector.js        Panel lateral
    player.js           Video sincronizado del panel lateral
  videos.js             Pestaña Videos tutoriales
  web.js                Pestaña Sistema web
  cheatsheet.js         Hoja de atajos
  search.js             Buscador instantáneo (Ctrl K)
  overlay.js            Abrir y cerrar capas devolviendo el foco
videos/                 Tutoriales de la Caja en 720p
posters/                Portadas de los videos
```

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

## Pendiente de confirmar

El menú que se ve en el video 02 (Caja 4.44.3) muestra otros atajos que la lista usada en el mockup:
Arqueo Caja (A), Factura Electrónica (Z), Imprimir Ticket (I), Reimpresión Local (D), Reimpresión Server (CTRL+D) y Resumir Venta (J).
En la lista del mockup además Arqueo Caja y Nota Crédito Libre comparten la N. La hoja de atajos marca estas diferencias.
