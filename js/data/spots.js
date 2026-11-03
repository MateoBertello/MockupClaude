// Puntos interactivos del mapa de la Caja.
// box: [x, y, ancho, alto] en unidades del lienzo de 1000 x 600.
// refs: tramos de video donde se ve el elemento ({ v: video, a: desde, b: hasta }).

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
    label: 'Menú de tres rayas', g: 'bar', icon: I.burger, box: [12, 12, 34, 26],
    what: 'Abre el menú con las demás funciones de la Caja: arqueo, gastos, ingresos de dinero, reimpresiones y más. Cada opción muestra su atajo entre paréntesis.',
    tips: ['Con el uso conviene ir directo con el atajo, sin abrir el menú.', 'Cancelar cierra el menú sin elegir nada.'],
    keysNote: 'Al tocarlo se abre la hoja de atajos',
    refs: [{ v: '02', a: 46.5, b: 71 }]
  },
  titulo: {
    label: 'Título de la venta', g: 'bar', icon: I.title, box: [250, 6, 520, 46],
    what: 'Indica cómo se va a facturar la venta en curso. VENTA FAC. ELECTRONICA MANUAL significa que la factura se hace a mano en la página de ARCA. VENTA AFIP con Factura Electrónica significa que la emite el sistema al cobrar.',
    tips: ['Mírelo siempre antes de cobrar.'],
    refs: [{ v: '01', a: 19.5, b: 28.5 }]
  },
  mas: {
    label: 'Más', g: 'row', icon: I.plus, box: [10, 83, 48, 42],
    what: 'Sube en uno la cantidad del renglón seleccionado. El total se recalcula con cada clic.',
    tips: ['Primero seleccione el renglón con un clic o con las flechas.'],
    refs: [{ v: '02', a: 6, b: 9 }, { v: '03', a: 27, b: 37.5 }]
  },
  menos: {
    label: 'Menos', g: 'row', icon: I.minus, box: [10, 125, 48, 42],
    what: 'Baja en uno la cantidad del renglón seleccionado. El total se recalcula con cada clic.',
    tips: ['Para sacar el artículo entero use el tacho rojo.'],
    refs: [{ v: '02', a: 6, b: 9 }, { v: '03', a: 27, b: 37.5 }]
  },
  cantidad: {
    label: 'Cantidad', g: 'row', icon: I.qty, box: [10, 167, 48, 42],
    what: 'Abre la ventana Cantidad para escribir el número exacto de una vez. Por ejemplo, veinte unidades sin tocar veinte veces el botón Más. Presione Aceptar para confirmar.',
    tips: ['Si el artículo tiene una promoción, la caja la agrega sola en otro renglón.'],
    refs: [{ v: '02', a: 9, b: 13.5 }, { v: '03', a: 37.5, b: 51.9 }]
  },
  lapiz: {
    label: 'Cambio de precio', g: 'row', icon: I.pencil, box: [10, 209, 48, 42],
    what: 'El lápiz naranja abre Cambio de precio. Puede escribir directamente el monto modificado, o elegir en Tipo de Ajuste un recargo o un descuento y expresarlo como porcentaje.',
    tips: ['Seleccione antes el renglón que quiere corregir.', 'Cancelar cierra la ventana y el precio queda igual.'],
    refs: [{ v: '02', a: 13.5, b: 16.5 }, { v: '04', a: 25.5, b: 49.9 }]
  },
  tacho: {
    label: 'Quitar renglón', g: 'row', icon: I.trash, box: [10, 251, 48, 42],
    what: 'El tacho rojo quita el renglón seleccionado. La caja pide confirmación antes de borrarlo.',
    warn: 'Si el artículo tiene un descuento, quite primero el renglón del descuento y después el artículo. Así la venta no queda con saldo negativo.',
    tips: ['Para descartar toda la venta use Cancelar.'],
    refs: [{ v: '02', a: 16.5, b: 18 }]
  },
  etiqueta: {
    label: 'Descuento', g: 'row', icon: I.tag, box: [10, 293, 48, 42],
    what: 'La etiqueta verde abre la ventana Descuento para un solo artículo. En Valor escriba cuánto descontar y en Tipo de descuento elija porcentaje o monto fijo. Al aceptar aparece un renglón de descuento y el total baja en el momento.',
    tips: ['Seleccione antes el renglón del artículo.'],
    refs: [{ v: '02', a: 18, b: 21 }, { v: '04', a: 0, b: 25.5 }]
  },
  arriba: {
    label: 'Flecha arriba', g: 'row', icon: I.up, box: [10, 335, 48, 42],
    what: 'Mueve la selección al renglón anterior. Los botones de esta barra siempre actúan sobre el renglón seleccionado, el que se ve en celeste.',
    tips: [], refs: [{ v: '02', a: 21, b: 24 }]
  },
  abajo: {
    label: 'Flecha abajo', g: 'row', icon: I.down, box: [10, 377, 48, 42],
    what: 'Mueve la selección al renglón siguiente. Los botones de esta barra siempre actúan sobre el renglón seleccionado, el que se ve en celeste.',
    tips: [], refs: [{ v: '02', a: 21, b: 24 }]
  },
  articulo: {
    label: 'Artículo seleccionado', g: 'sale', icon: I.cart, box: [69, 74, 684, 49],
    what: 'Muestra la cantidad, el nombre y el precio del renglón seleccionado. Sirve para confirmar de un vistazo qué se acaba de cargar.',
    tips: [], refs: [{ v: '01', a: 13.5, b: 16.5 }]
  },
  carrito: {
    label: 'Carrito', g: 'sale', icon: I.rows, box: [69, 134, 683, 286],
    what: 'Lista los renglones de la venta con Cant., Codigo, Descripcion, P. Unitario y P. Total. El renglón seleccionado se ve en celeste. Los descuentos aparecen como renglones propios, con código Manual y la descripción en azul.',
    tips: ['En Practicar puede tocar un renglón para seleccionarlo.'],
    refs: [{ v: '01', a: 13.5, b: 19.5 }, { v: '04', a: 19.5, b: 25.5 }]
  },
  codigo: {
    label: 'Código de barras', g: 'sale', icon: I.cart, box: [69, 423, 685, 49],
    what: 'Escanee el código de barras del artículo. Si no tiene lector, escriba el código en este campo y presione Enter. El artículo entra al carrito con su precio.',
    tips: ['En Practicar pruebe con los códigos 8902, 1 o 206.'],
    refs: [{ v: '01', a: 4.5, b: 16.5 }]
  },
  totales: {
    label: 'Totales', g: 'sale', icon: I.totals, box: [774, 63, 215, 276],
    what: 'Arriba el importe de los artículos, al medio los descuentos y abajo, en negro, el total a cobrar. Se actualizan con cada cambio en el carrito.',
    tips: [], refs: [{ v: '01', a: 16.5, b: 19.5 }, { v: '04', a: 19.5, b: 25.5 }]
  },
  productos: {
    label: 'Productos', g: 'act', icon: I.search, sw: 'var(--act-blue)', key: ['B'], box: [774, 415, 215, 49],
    what: 'Abre la lista de artículos para buscarlos por nombre. Escriba parte del nombre en el filtro y la lista se achica a medida que escribe. Haga clic en el artículo y presione Aceptar.',
    tips: ['Sirve cuando no recuerda el código.', 'Pruebe ahora: presione la tecla B.'],
    refs: [{ v: '02', a: 24, b: 31.5 }, { v: '03', a: 0, b: 22.5 }]
  },
  cancelar: {
    label: 'Cancelar venta', g: 'act', icon: I.cancel, sw: 'var(--act-red)', box: [774, 473, 215, 49],
    what: 'Descarta la venta entera. Antes pide confirmación, y al aceptar se vacían el carrito, el cliente y la factura.',
    tips: ['Para sacar un solo artículo use el tacho rojo.'],
    refs: [{ v: '02', a: 31.5, b: 34.5 }]
  },
  pagar: {
    label: 'Pagar', g: 'act', icon: I.check, sw: 'var(--act-green)', box: [774, 532, 215, 49],
    what: 'Abre la ventana de cobro, Pago detallado. A la izquierda están los medios de pago y a la derecha el Total, el Saldo que falta cobrar y el Vuelto. Cuando el Saldo llega a cero, Pagar registra la venta.',
    tips: ['Puede combinar medios: una parte en efectivo y otra con tarjeta.', 'Limpiar borra todos los pagos cargados. Volver regresa a la venta sin cobrar.'],
    refs: [{ v: '02', a: 34.5, b: 37.5 }, { v: '01', a: 28.5, b: 83.8 }, { v: '06', a: 0, b: 46.7 }]
  },
  cliente: {
    label: 'Panel Cliente', g: 'panel', icon: I.person, box: [325, 493, 214, 86],
    what: 'Asigna a la venta un cliente del local, para cuenta corriente, puntos o fidelización. La flecha » copia ese cliente al panel Factura.',
    tips: [], refs: [{ v: '02', a: 37.5, b: 42 }]
  },
  factura: {
    label: 'Panel Factura', g: 'panel', icon: I.doc, box: [550, 493, 214, 86],
    what: 'Define el tipo de comprobante y el cliente de facturación: tipo y número de documento y condición de IVA.',
    tips: ['Si el cliente de la venta es el mismo, cópielo con la flecha » del panel Cliente.'],
    refs: [{ v: '02', a: 42, b: 46.5 }]
  }
};

export const SPOT_IDS = Object.keys(SPOTS);
