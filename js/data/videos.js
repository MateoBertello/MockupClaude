// Videos tutoriales de la Caja. Las transcripciones salen de los subtítulos de cada video.
// Cada paso es [segundo, texto]; *texto* marca un rótulo de la pantalla.

export const VIDEOS = {
  '01': {
    file: '01-venta', title: 'Cómo hacer una venta', dur: 83.8,
    chapters: [[0, 'Cargar el artículo'], [28.5, 'Pagar'], [52.5, 'Efectivo y vuelto']],
    spots: ['codigo', 'carrito', 'totales', 'titulo', 'pagar'],
    cues: [
      [0, 'Veamos una venta completa en la *Caja* de principio a fin.'],
      [4.5, 'Escanee el código de barras del artículo.'],
      [7.5, 'Si no tiene lector escriba el código en este campo y presione Enter.'],
      [13.5, 'El artículo entra al carrito con su precio.'],
      [16.5, 'A la derecha se actualiza el total de la venta.'],
      [19.5, 'Mire siempre el título de arriba.'],
      [21, '*Factura electrónica manual* significa que esta venta se factura a mano en la página de ARCA.'],
      [28.5, 'Cuando termine de cargar presione *Pagar*.'],
      [33, 'Se abre directamente *Pago detallado*. A la izquierda están los medios de pago.'],
      [39, 'Puede cobrar en *Efectivo* con tarjeta de débito o de crédito y también por transferencia.'],
      [46.5, 'A la derecha figuran el *Total* y el *Saldo* que falta cobrar.'],
      [51, 'Veamos un cobro en efectivo.'],
      [52.5, 'Elija *Efectivo* y escriba el importe que le entregan.'],
      [58.5, 'Después presione *Aceptar*.'],
      [61.5, 'El pago aparece en la lista. El *Vuelto* indica cuánto hay que devolver.'],
      [66, 'Para cerrar la venta presione *Pagar*.'],
      [70.5, 'La caja pregunta si quiere imprimir el comprobante.'],
      [73.5, 'Elija lo que prefiera. En este ejemplo no se imprime.'],
      [78, 'La venta queda registrada.'],
      [79.5, 'La caja vuelve a cero para el próximo cliente.']
    ]
  },
  '02': {
    file: '02-botones', title: 'Botones y atajos', dur: 71.1,
    chapters: [[0, 'Botones del renglón'], [24, 'Productos, Cancelar y Pagar'], [46.5, 'Menú y atajos']],
    spots: ['mas', 'menos', 'cantidad', 'lapiz', 'tacho', 'etiqueta', 'arriba', 'abajo', 'productos', 'cancelar', 'pagar', 'cliente', 'factura', 'menu'],
    cues: [
      [0, 'Recorramos los botones y atajos de la *Caja*.'],
      [3, 'Empecemos por la barra de la izquierda.'],
      [6, 'Más y menos suben o bajan la cantidad del renglón.'],
      [9, 'El tercero abre *Cantidad* para escribir el número exacto.'],
      [13.5, 'Con el lápiz se cambia el precio.'],
      [16.5, 'El tacho quita el renglón.'],
      [18, 'La etiqueta aplica un descuento.'],
      [21, 'Y las flechas mueven la selección entre renglones.'],
      [24, 'A la derecha está *Productos*.'],
      [27, 'Busca artículos por su nombre y también se abre con la tecla B.'],
      [31.5, '*Cancelar* descarta la venta entera.'],
      [34.5, '*Pagar* abre la ventana de cobro.'],
      [37.5, 'Abajo el panel *Cliente* asigna un cliente a la venta.'],
      [42, 'El panel *Factura* define el tipo de comprobante.'],
      [46.5, 'El botón de tres rayas abre el menú. Ahí están las demás funciones de la caja.'],
      [51, 'Cada opción muestra su atajo entre paréntesis.'],
      [55.5, 'Control C abre el cobro de cuenta corriente.'],
      [58.5, 'Control G declara un gasto.'],
      [61.5, 'La letra F registra un ingreso de dinero.'],
      [64.5, 'Y Control Q recarga los artículos.'],
      [67.5, '*Cancelar* cierra el menú sin elegir nada.']
    ]
  },
  '03': {
    file: '03-buscar-cantidad', title: 'Buscar artículos y cambiar cantidades', dur: 51.9,
    chapters: [[0, 'Productos'], [22.5, 'Cantidad']],
    spots: ['productos', 'carrito', 'mas', 'menos', 'cantidad'],
    cues: [
      [0, '¿No recuerda el código de un artículo? Lo puede buscar por su nombre.'],
      [4.5, 'Presione *Productos* o la tecla B. Se abre la lista de artículos.'],
      [10.5, 'Escriba parte del nombre en el filtro. La lista se achica a medida que escribe.'],
      [16.5, 'Haga clic en el artículo que busca.'],
      [19.5, 'Presione *Aceptar* y el artículo pasa al carrito.'],
      [22.5, 'Para cambiar una cantidad primero seleccione el renglón.'],
      [27, 'Con más y menos la cantidad sube o baja de a uno.'],
      [33, 'El total se recalcula con cada clic.'],
      [37.5, 'El tercer botón abre *Cantidad*. Ahí se escribe el número exacto.'],
      [43.5, 'Presione *Aceptar*.'],
      [45, 'Si el artículo tiene una promoción la caja la agrega sola en otro renglón.']
    ]
  },
  '04': {
    file: '04-descuentos', title: 'Descuentos y cambio de precio', dur: 49.9,
    chapters: [[0, 'Descuento'], [25.5, 'Cambio de precio']],
    spots: ['etiqueta', 'totales', 'lapiz'],
    cues: [
      [0, 'Ahora vamos a descontar un solo artículo.'],
      [3, 'Seleccione el renglón y presione la etiqueta verde.'],
      [7.5, 'Se abre la ventana *Descuento*.'],
      [10.5, 'En *Valor* escriba cuánto quiere descontar.'],
      [13.5, 'En el tipo elija si es un porcentaje o un monto fijo.'],
      [19.5, 'Al aceptar aparece un renglón de descuento.'],
      [22.5, 'El total baja en ese mismo momento.'],
      [25.5, '¿Hay que corregir un precio? Seleccione el renglón.'],
      [30, 'Presione el lápiz y se abre *Cambio de precio*.'],
      [34.5, 'Puede escribir directamente el monto nuevo.'],
      [37.5, 'O elegir un recargo o un descuento.'],
      [40.5, 'Y expresarlo como porcentaje.'],
      [45, 'Esta vez cerramos con *Cancelar* y el precio queda igual.']
    ]
  },
  '06': {
    file: '06-medios-pago', title: 'Combinar medios de pago', dur: 46.7,
    chapters: [[0, 'Pago detallado'], [27, 'Limpiar y Volver']],
    spots: ['pagar'],
    cues: [
      [0, '¿El cliente paga una parte en efectivo y otra con tarjeta?'],
      [4.5, 'Para eso está *Pago detallado*.'],
      [6, 'A la izquierda están los medios de pago. Primero *Efectivo* y *Cta Cte*.'],
      [12, 'Siguen las tarjetas de débito y de crédito.'],
      [15, 'Después *Transferencia* y *MercadoPago*.'],
      [18, 'Elija un medio y escriba el monto que se paga con él.'],
      [21, 'Al aceptar el pago se suma a la lista. *Saldo* muestra lo que falta cobrar.'],
      [27, '¿Se equivocó al cargar un pago? *Limpiar* borra todos los pagos de la lista.'],
      [33, 'Antes pide confirmación.'],
      [34.5, 'Al aceptar la lista queda vacía otra vez.'],
      [37.5, 'Cuando el *Saldo* llega a cero *Pagar* registra la venta.'],
      [42, '*Volver* regresa a la venta sin cobrar nada.']
    ]
  }
};

export const UPCOMING = [
  '05 · Quitar artículos y cancelar la venta', '07 · Agregar un cliente', '08 · Cliente y tipo de comprobante',
  '09 · Arqueo y nota de crédito', '10 · Ingresos y retiros de dinero', '11 · Declarar un gasto',
  '12 · Cobro de cuenta corriente', '13 · Opciones durante la venta', '14 · Reimprimir comprobantes',
  '15 · Recargar artículos y clientes', '16 · Arqueo de caja'
];

export const videoSrc = id => `videos/${VIDEOS[id].file}.mp4`;
export const posterSrc = id => `posters/${VIDEOS[id].file}.jpg`;

/** Segundo en que termina el paso i (el comienzo del siguiente). */
export const cueEnd = (id, i) => (i + 1 < VIDEOS[id].cues.length ? VIDEOS[id].cues[i + 1][0] : VIDEOS[id].dur);

/** Índice del paso que se está narrando en el segundo t. */
export function cueAt(id, t) {
  const cues = VIDEOS[id].cues;
  let k = -1;
  for (let i = 0; i < cues.length; i++) if (cues[i][0] <= t + 0.7) k = i;
  return k;
}
