// Puntos interactivos del mapa de la Caja.
// box: [x, y, ancho, alto] en píxeles de la pantalla real de la Caja (1040 x 655, salexDesign.xml).
// keys: atajos reales en la pantalla de venta.
// refs: tramos de video donde se ve el elemento ({ v: video, a: desde, b: hasta }); el primero es el principal.

import { I } from '../icons.js';

export const GROUPS = {
  bar: ['Barra superior', 'g-bar'],
  row: ['Botones del renglón', 'g-row'],
  sale: ['Venta en curso', 'g-sale'],
  act: ['Acciones de la venta', 'g-act'],
  panel: ['Paneles inferiores', 'g-panel']
};

export const SPOTS = {
  menu: {
    label: 'Menú de tres rayas', g: 'bar', icon: I.burger, keys: ['CTRL+M'], box: [10, 6, 40, 40],
    what: 'Abre el menú con el resto de las funciones de la Caja: arqueo, gastos, ingresos y retiros de dinero, reimpresiones y más. Tiene un filtro para encontrar la opción escribiendo, y cada opción muestra su atajo entre paréntesis.',
    tips: ['Con la práctica conviene ir directo con el atajo, sin abrir el menú.', 'Las opciones cambian según haya o no una venta en curso.'],
    refs: [{ v: '02', a: 46.5, b: 71 }, { v: '07', a: 10.5, b: 27 }]
  },
  titulo: {
    label: 'Título de la venta', g: 'bar', icon: I.title, box: [190, 10, 463, 56],
    what: 'Te dice cómo se va a facturar la venta en curso. VENTA FAC. ELECTRONICA MANUAL significa que la factura se hace a mano en la página de ARCA. VENTA AFIP con Factura Electrónica significa que la emite el sistema al cobrar.',
    tips: ['Miralo siempre antes de cobrar.'],
    refs: [{ v: '08', a: 0, b: 19.5 }, { v: '01', a: 19.5, b: 28.5 }]
  },
  mas: {
    label: 'Más', g: 'row', icon: I.plus, keys: ['Num +'], box: [11, 87, 49, 41],
    what: 'Sube en uno la cantidad del renglón seleccionado. El total se recalcula con cada clic.',
    tips: ['Primero seleccioná el renglón con un clic o con las flechas.'],
    refs: [{ v: '03', a: 22.5, b: 37.5 }, { v: '02', a: 6, b: 9 }]
  },
  menos: {
    label: 'Menos', g: 'row', icon: I.minus, keys: ['Num −'], box: [11, 130, 49, 41],
    what: 'Baja en uno la cantidad del renglón seleccionado. El total se recalcula con cada clic.',
    tips: ['Para sacar el artículo entero usá el tacho rojo.'],
    refs: [{ v: '03', a: 22.5, b: 37.5 }, { v: '02', a: 6, b: 9 }]
  },
  cantidad: {
    label: 'Cantidad', g: 'row', icon: I.qty, keys: ['CTRL+Q'], box: [11, 173, 49, 41],
    what: 'Abre la ventana Cantidad para escribir el número exacto de una vez. Por ejemplo, veinte unidades sin tocar veinte veces el botón Más. Presioná Aceptar para confirmar.',
    tips: ['Si el artículo tiene una promoción, la Caja la agrega sola en otro renglón.'],
    refs: [{ v: '03', a: 37.5, b: 51.9 }, { v: '02', a: 9, b: 13.5 }]
  },
  lapiz: {
    label: 'Cambio de precio', g: 'row', icon: I.pencil, keys: ['S'], box: [11, 216, 49, 41],
    what: 'El lápiz naranja abre Cambio de precio. Podés escribir directamente el monto modificado, o elegir en Tipo de Ajuste un recargo o un descuento en porcentaje.',
    tips: ['Seleccioná antes el renglón que querés corregir.', 'Cancelar cierra la ventana y el precio queda igual.'],
    refs: [{ v: '04', a: 25.5, b: 49.9 }, { v: '02', a: 13.5, b: 16.5 }]
  },
  tacho: {
    label: 'Quitar renglón', g: 'row', icon: I.trash, keys: ['Supr'], box: [11, 259, 49, 41],
    what: 'El tacho rojo quita el renglón seleccionado. La Caja pide confirmación antes de borrarlo.',
    warn: 'Si el artículo tiene un descuento, quitá primero el renglón del descuento y después el artículo. Así la venta no queda con saldo negativo.',
    tips: ['Para descartar toda la venta usá Cancelar.'],
    refs: [{ v: '05', a: 0, b: 24 }, { v: '02', a: 16.5, b: 18 }]
  },
  etiqueta: {
    label: 'Descuento', g: 'row', icon: I.tag, keys: ['H'], box: [11, 302, 49, 41],
    what: 'La etiqueta verde abre la ventana Descuento para un solo artículo. En Valor escribí cuánto descontar y en Tipo de descuento elegí porcentaje o monto fijo. Al aceptar aparece un renglón de descuento y el total baja en el momento.',
    tips: ['Seleccioná antes el renglón del artículo.'],
    refs: [{ v: '04', a: 0, b: 25.5 }, { v: '02', a: 18, b: 21 }]
  },
  arriba: {
    label: 'Flecha arriba', g: 'row', icon: I.up, keys: ['CTRL+Num −'], box: [11, 345, 49, 41],
    what: 'Mueve la selección al renglón anterior. Los botones de esta barra siempre actúan sobre el renglón seleccionado, el que se ve en celeste.',
    tips: [], refs: [{ v: '02', a: 21, b: 24 }]
  },
  abajo: {
    label: 'Flecha abajo', g: 'row', icon: I.down, keys: ['CTRL+Num +'], box: [11, 388, 49, 41],
    what: 'Mueve la selección al renglón siguiente. Los botones de esta barra siempre actúan sobre el renglón seleccionado, el que se ve en celeste.',
    tips: [], refs: [{ v: '02', a: 21, b: 24 }]
  },
  articulo: {
    label: 'Artículo seleccionado', g: 'sale', icon: I.cart, box: [71, 76, 701, 50],
    what: 'Muestra la cantidad, el nombre y el precio del renglón seleccionado. Sirve para confirmar de un vistazo qué acabás de cargar.',
    tips: [], refs: [{ v: '01', a: 13.5, b: 16.5 }]
  },
  carrito: {
    label: 'Carrito', g: 'sale', icon: I.rows, box: [71, 170, 701, 261],
    what: 'Lista los renglones de la venta con Cant., Codigo, Descripcion, P. Unitario y P. Total. El renglón seleccionado se ve en celeste. Los descuentos aparecen como renglones propios, con código Manual y la descripción en azul.',
    tips: ['En Practicar podés tocar un renglón para seleccionarlo.'],
    refs: [{ v: '01', a: 13.5, b: 19.5 }, { v: '04', a: 19.5, b: 25.5 }]
  },
  codigo: {
    label: 'Código de barras', g: 'sale', icon: I.cart, keys: ['Enter'], box: [72, 434, 700, 50],
    what: 'Escaneá el código de barras del artículo. Si no tenés lector, escribí el código en este campo y presioná Enter. El artículo entra al carrito con su precio.',
    tips: ['En Practicar probá con los códigos 8902, 1 o 206.'],
    refs: [{ v: '01', a: 4.5, b: 16.5 }]
  },
  totales: {
    label: 'Totales', g: 'sale', icon: I.totals, box: [793, 65, 220, 290],
    what: 'Arriba el importe de los artículos, al medio los descuentos y abajo, en negro, el total a cobrar. Se actualizan con cada cambio en el carrito.',
    tips: [], refs: [{ v: '01', a: 16.5, b: 19.5 }, { v: '04', a: 19.5, b: 25.5 }]
  },
  productos: {
    label: 'Productos', g: 'act', icon: I.search, keys: ['B', 'V'], sw: 'var(--act-blue)', box: [793, 425, 220, 50],
    what: 'Abre la lista de artículos para buscarlos por nombre. Escribí parte del nombre en el filtro y la lista se achica mientras escribís. Hacé clic en el artículo y presioná Aceptar.',
    tips: ['Sirve cuando no te acordás del código.', 'B abre la lista con el filtro vacío y V conserva la última búsqueda. Probá ahora: presioná B.'],
    refs: [{ v: '03', a: 0, b: 22.5 }, { v: '02', a: 24, b: 31.5 }]
  },
  cancelar: {
    label: 'Cancelar venta', g: 'act', icon: I.cancel, keys: ['C'], sw: 'var(--act-red)', box: [793, 485, 220, 50],
    what: 'Descarta la venta entera. Antes pide confirmación, y al aceptar se vacían el carrito, el cliente y la factura.',
    tips: ['Para sacar un solo artículo usá el tacho rojo.'],
    refs: [{ v: '05', a: 24, b: 40 }, { v: '02', a: 31.5, b: 34.5 }]
  },
  pagar: {
    label: 'Pagar', g: 'act', icon: I.check, keys: ['P', 'Espacio', 'Num .'], sw: 'var(--act-green)', box: [793, 545, 220, 50],
    what: 'Abre la ventana de cobro, Pago detallado. A la izquierda están los medios de pago y a la derecha el Total, el Saldo que falta cobrar y el Vuelto. Cuando el Saldo llega a cero, Pagar registra la venta.',
    tips: ['Podés combinar medios: una parte en efectivo y otra con tarjeta.', 'Limpiar borra todos los pagos cargados. Volver regresa a la venta sin cobrar.'],
    refs: [{ v: '01', a: 28.5, b: 83.8 }, { v: '06', a: 0, b: 46.7 }, { v: '02', a: 34.5, b: 37.5 }]
  },
  stock: {
    label: 'Detalle de stock', g: 'row', icon: I.chart, keys: ['CTRL+S'], box: [11, 431, 49, 41],
    what: 'Muestra el stock del artículo seleccionado, sin salir de la venta.',
    tips: ['Sirve para avisarle al cliente si quedan unidades antes de cobrar.'], refs: []
  },
  clienteBuscar: {
    label: 'Buscar cliente', g: 'panel', icon: I.person, keys: ['X'], box: [492, 511, 24, 24],
    what: 'El primer ícono del panel Cliente abre la lista de clientes. Buscá por nombre o por documento, elegí el cliente y presioná Aceptar.',
    tips: ['El panel muestra sus datos y el Balance de su cuenta corriente.'], refs: [{ v: '08', a: 28.5, b: 43.5 }]
  },
  copiar: {
    label: 'Copiar a la factura', g: 'panel', icon: I.chev2, keys: ['E'], box: [519, 511, 24, 24],
    what: 'La flecha » copia el cliente de la venta al panel Factura. Es la forma más rápida de facturar a nombre de esa persona.',
    tips: [], refs: [{ v: '08', a: 85.5, b: 96 }]
  },
  comprobante: {
    label: 'Tipo de comprobante', g: 'panel', icon: I.doc, keys: ['Z'], box: [722, 511, 24, 24],
    what: 'El primer ícono del panel Factura abre el tipo de comprobante, por ejemplo Factura B. El título de la venta cambia a VENTA AFIP y la factura la emite el sistema al cobrar.',
    tips: ['Después cargá el cliente de facturación con el ícono de al lado o con la flecha » del panel Cliente.'], refs: [{ v: '08', a: 46.5, b: 63 }]
  },
  clienteFact: {
    label: 'Cliente de facturación', g: 'panel', icon: I.person, keys: ['O'], box: [749, 511, 24, 24],
    what: 'El segundo ícono del panel Factura carga a quién se factura: tipo de documento, número y condición de IVA.',
    tips: ['Podés cargar el CUIT o el CUIL que te da la persona.'], refs: [{ v: '08', a: 63, b: 85.5 }]
  },
  cliente: {
    label: 'Panel Cliente', g: 'panel', icon: I.person, keys: ['X', 'E'], box: [333, 504, 220, 90],
    what: 'Asigna a la venta un cliente del local, para cuenta corriente, puntos o fidelización. La flecha » copia ese cliente al panel Factura.',
    tips: [], refs: [{ v: '08', a: 19.5, b: 43.5 }, { v: '02', a: 37.5, b: 42 }]
  },
  factura: {
    label: 'Panel Factura', g: 'panel', icon: I.doc, keys: ['Z', 'O'], box: [563, 505, 220, 90],
    what: 'Define el tipo de comprobante y el cliente de facturación: tipo y número de documento y condición de IVA.',
    tips: ['Si el cliente de la venta es el mismo, copialo con la flecha » del panel Cliente.'],
    refs: [{ v: '08', a: 43.5, b: 109.4 }, { v: '02', a: 42, b: 46.5 }]
  }
};

export const SPOT_IDS = Object.keys(SPOTS);
