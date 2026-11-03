// Contenido de la ayuda que no es la Caja ni los videos: atajos, catálogo de ejemplo,
// medios de pago, respuestas rápidas y módulos del sistema web.

import { I } from '../icons.js';

/* Atajos del menú de tres rayas. vid: lo que muestra el menú del video 02 (Caja 4.44.3) cuando difiere. */
export const SHORTCUTS = [
  { g: 'En la venta', label: 'Productos', keys: ['B'], desc: 'Busca artículos por nombre.' },
  { g: 'Clientes y cobros', label: 'Agregar cliente', keys: ['CTRL', 'A'], desc: 'Carga un cliente sin salir de la Caja.' },
  { g: 'Clientes y cobros', label: 'Cobro Cta Cte', keys: ['CTRL', 'C'], desc: 'Abre el cobro de cuenta corriente.' },
  { g: 'Dinero en caja', label: 'Arqueo Caja', keys: ['N'], vid: 'A', desc: 'Cuenta el dinero de la caja y lo compara con lo registrado.' },
  { g: 'Dinero en caja', label: 'Ingreso Dinero', keys: ['F'], desc: 'Registra un ingreso de dinero.' },
  { g: 'Dinero en caja', label: 'Gastos', keys: ['CTRL', 'G'], desc: 'Declara un gasto.' },
  { g: 'Comprobantes', label: 'Factura Electrónica', keys: ['E'], vid: 'Z', desc: 'Abre la factura electrónica.' },
  { g: 'Comprobantes', label: 'Imprimir', keys: ['P'], vid: 'I', desc: 'Imprime el ticket.' },
  { g: 'Comprobantes', label: 'Nota Crédito Libre', keys: ['N'], desc: 'Abre una nota de crédito libre.' },
  { g: 'Comprobantes', label: 'Reimpresión Local', keys: ['R'], vid: 'D', desc: 'Reimprime un comprobante guardado en esta PC.' },
  { g: 'Comprobantes', label: 'Reimpresión Server', keys: ['CTRL', 'R'], vid: 'CTRL+D', desc: 'Reimprime un comprobante guardado en el servidor.' },
  { g: 'Comprobantes', label: 'Resumen Venta', keys: ['X'], vid: 'J', desc: 'Muestra el resumen de la venta.' },
  { g: 'Datos de la Caja', label: 'Recargar Artículos', keys: ['CTRL', 'Q'], desc: 'Trae los artículos y precios actualizados desde la web.' },
  { g: 'Datos de la Caja', label: 'Recargar Clientes', keys: ['CTRL', 'L'], desc: 'Trae la lista de clientes actualizada.' }
];

/* Artículos de ejemplo tomados de las capturas: [código, nombre, precio]. */
export const CATALOG = [
  ['8902', '1/2 Pizza Big Muzza', 12000], ['8892', '1/2 Pizza Big Calabresa', 11500], ['8900', '1/2 Pizza Big 4 Quesos', 15000],
  ['8901', '1/2 Pizza Big Anana', 21450], ['8898', '1/2 Pizza Big Rucula & Crudo', 13900], ['1', '1/4 Muzza', 6200],
  ['16', '1/4 Palmitos', 9000], ['40', '1/4 Anana', 9000], ['206', 'Burger Mex', 14900], ['200', 'Hambur Simple', 13900],
  ['201', 'Hambur Completa', 14900], ['909', 'Campari', 6700], ['710', 'Checa Mesopotamia 1/2 Pinta', 2500],
  ['942', 'Combo Fernet Viernes', 31400], ['607', 'Limonada 1 lt', 5100]
];

/** La venta con la que arranca el mapa: la misma del video 04. */
export const sampleSale = () => [
  { t: 'i', id: 1, code: '8902', name: '1/2 Pizza Big Muzza', qty: 1, price: 12000 },
  { t: 'i', id: 2, code: '1', name: '1/4 Muzza', qty: 1, price: 6200 }
];

/* Medios de Pago detallado, en el orden de la Caja (teclas 1 a 6). */
export const MEDIOS = [['Efectivo', I.cash], ['Cta Cte', I.bank], ['T. Débito', I.card], ['T. Crédito', I.card], ['Transferencia', I.transfer], ['MercadoPago', I.mp]];

/* Respuestas rápidas. go: adónde lleva el botón. */
export const QUICK = [
  { q: 'La venta quedó con total negativo', a: 'Pasa al quitar un artículo que tenía descuento. Quite primero el renglón del descuento y después el artículo.', label: 'Ver el tacho rojo', go: { spot: 'tacho' } },
  { q: 'El cliente paga una parte en efectivo y otra con tarjeta', a: 'En Pago detallado elija un medio, escriba el monto y acepte. Repita hasta que el Saldo llegue a cero.', label: 'Ver en el video 06 · 0:18', go: { video: '06', t: 18 } },
  { q: 'No recuerdo el código del artículo', a: 'Presione Productos o la tecla B y escriba parte del nombre. La lista se achica mientras escribe.', label: 'Ver Productos', go: { spot: 'productos' } },
  { q: '¿Qué significa VENTA FAC. ELECTRONICA MANUAL?', a: 'Que esa venta se factura a mano en la página de ARCA. Mírelo siempre antes de cobrar.', label: 'Ver en el video 01 · 0:21', go: { video: '01', t: 21 } },
  { q: 'Me equivoqué al cargar un pago', a: 'Limpiar borra todos los pagos de la lista, previa confirmación. Después vuelva a cargarlos.', label: 'Ver en el video 06 · 0:27', go: { video: '06', t: 27 } },
  { q: 'Cambié precios en la web y la Caja no los muestra', a: 'Recargue los artículos con CTRL+Q, o desde el menú de tres rayas.', label: 'Ver los atajos', go: { shortcut: 'Recargar Artículos' } }
];

/* Menú de sistema.buhomanager.com. subs: [nombre, descripción, tiene guía interactiva]. */
export const WEB = [
  { id: 'transacciones', name: 'Gestión Transacciones', desc: 'Consulta de las ventas y los comprobantes que registran las cajas.' },
  {
    id: 'articulos', name: 'Gestión Artículos', desc: 'Alta y edición de artículos, precios, promociones y etiquetas. Lo que se cambia acá llega a la Caja.',
    subs: [
      ['Artículos', 'Lista de artículos con filtros, precios y fecha de actualización.', true],
      ['Insumos', 'Materias primas que componen los artículos.'], ['Carga Rápida', 'Alta de artículos en pocos pasos.'],
      ['Departamentos', 'Agrupan los artículos por rubro.'], ['Promociones', 'Las que la Caja agrega sola en otro renglón.'],
      ['Canasta', 'Conjuntos de artículos.'], ['Actualización Masiva', 'Cambiar precios de muchos artículos a la vez.'],
      ['Etiquetas', 'Impresión de etiquetas de precio.'], ['Consultar', 'Consulta rápida de un artículo.'],
      ['Vencimiento', 'Control de fechas de vencimiento.']
    ]
  },
  { id: 'stock', name: 'Gestión Stock', desc: 'Existencias, ingresos y ajustes de mercadería.' },
  { id: 'clientes', name: 'Gestión Clientes', desc: 'Clientes del local, cuentas corrientes y datos de facturación que usa el panel Cliente de la Caja.' },
  { id: 'proveedores', name: 'Gestión Proveedores', desc: 'Proveedores y sus compras.' },
  { id: 'operadores', name: 'Gestión Operadores', desc: 'Cajeros y operadores que usan la Caja.' },
  { id: 'gastos', name: 'Gestión Gastos', desc: 'Gastos del comercio, incluidos los que se declaran desde la Caja con CTRL+G.' },
  { id: 'financiera', name: 'Gestión Financiera', desc: 'Movimientos de dinero y medios de pago.' },
  { id: 'varias', name: 'Gestiones Varias', desc: 'Configuraciones generales del comercio.' },
  { id: 'cheques', name: 'Gestión de Cheques', desc: 'Cheques recibidos y emitidos.' },
  { id: 'reportes', name: 'Reportes', desc: 'Informes de ventas, artículos y caja.' },
  { id: 'usuarios', name: 'Gestión de Usuarios', desc: 'Usuarios y permisos del sistema web.' }
];

/* Marcadores de la guía de Artículos: [número, título, explicación]. */
export const ART_MARKS = [
  [1, 'Nombre / Código', 'Escriba parte del nombre o el código del artículo.'],
  [2, 'Lector de código', 'Busca el artículo leyendo su código de barras.'],
  [3, 'Cod. Extendido, Proveedor y Departamento', 'Filtros para acotar la lista.'],
  [4, 'Marca', 'Filtra por marca. Por defecto muestra todas.'],
  [5, 'Solo Habilitados y Solo Ecommerce', 'Muestran solo los artículos habilitados, o solo los publicados en la tienda online.'],
  [6, 'Buscar y Limpiar', 'Buscar aplica los filtros. Limpiar los borra.'],
  [7, 'Exportar', 'Descarga la lista tal como está filtrada.'],
  [8, 'Nuevo', 'Crea un artículo nuevo.'],
  [9, 'Menú del artículo', 'Los tres puntos abren las acciones de cada artículo, como editarlo.'],
  [10, 'Costo, Precio 1 y Precio 2', 'El costo y las dos listas de precios de venta.'],
  [11, 'Actualizado', 'Fecha y hora del último cambio del artículo.']
];

/* Filas de ejemplo de la lista de Artículos (de la captura del sistema web). */
export const ART_ROWS = [
  ['8900', '—', '1/2 Pizza Big 4 Quesos', 'prueba', '9,112.50', '15,000.00', '0.00', '27/09/2026 15:44'],
  ['8901', '89', '1/2 Pizza Big Anana', '—', '15,000.00', '21,450.00', '0.00', '01/10/2026 11:40'],
  ['8889', '—', '1/2 Pizza Big Botellon', '—', '6,859.00', '10,640.00', '9,880.00', '25/08/2026 15:17'],
  ['8892', '—', '1/2 Pizza Big Calabresa', '—', '10,000.00', '11,500.00', '0.00', '17/08/2026 10:29'],
  ['8902', '—', '1/2 Pizza Big Muzza', '—', '6,800.00', '12,000.00', '0.00', '02/10/2026 16:37']
];
