# Centro de Ayuda BuhoManager · mockup

Mockup interactivo de alta fidelidad del Centro de Ayuda de BuhoManager.

- `index.html`: la página completa (HTML, CSS y JS en un solo archivo, Tailwind por CDN opcional).
- `videos/`: los tutoriales de la Caja recomprimidos a 720p para la web.
- `posters/`: cuadros de portada de cada video.

## Qué incluye

1. **Mapa de la Caja**: réplica esquemática de la pantalla de venta (4.46.1) con 19 puntos.
   - *Explorar*: al pasar el cursor el panel lateral explica el botón; al hacer clic se reproduce el tramo exacto del video, con la transcripción sincronizada.
   - *Practicar*: los botones funcionan con una venta de ejemplo (cantidades, descuento, cambio de precio, quitar renglón con la regla del descuento, Productos con la tecla B, Pago detallado con medios combinados, Limpiar, Volver y Pagar).
2. **Hoja de atajos** (menú de tres rayas o tecla `?`): teclado visual, presionar una tecla resalta su función.
3. **Videos tutoriales**: 01, 02, 03, 04 y 06 con transcripción paso a paso por capítulos.
4. **Sistema web**: menú de sistema.buhomanager.com con la guía interactiva de Artículos.
5. **Buscador instantáneo** (`Ctrl K` o `/`) sobre botones, atajos, respuestas rápidas, momentos de los videos y módulos web.

Para verlo localmente hace falta servir la carpeta (los videos se cargan por ruta relativa):

```bash
python3 -m http.server 8000
```

## Pendiente de confirmar

El menú que se ve en el video 02 (Caja 4.44.3) muestra otros atajos que la lista usada en el mockup:
Arqueo Caja (A), Factura Electrónica (Z), Imprimir Ticket (I), Reimpresión Local (D), Reimpresión Server (CTRL+D) y Resumir Venta (J).
En la lista del mockup además Arqueo Caja y Nota Crédito Libre comparten la N. La hoja de atajos marca estas diferencias.
