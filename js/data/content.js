// Contenido de la ayuda que no es la Caja ni los videos: atajos, catálogo de ejemplo,
// medios de pago, respuestas rápidas y módulos del sistema web.

import { I } from '../icons.js';

/* Atajos reales de la Caja (keymap de retail33), separados por la pantalla en la que funcionan.
   keys: combinaciones alternativas. Teclas: letras, dígitos, Enter, Espacio, Esc, Supr, F1, CTRL+…,
   y las del teclado numérico como "Num +", "Num −", "Num .", "Num *", "Num /".
   menu: figura en el menú de tres rayas. spot: punto del mapa que hace lo mismo. */
export const KEY_STATES = [
  {
    id: 'venta', label: 'En venta', desc: 'Con artículos en el carrito.',
    groups: [
      ['Artículos', [
        { label: 'Agregar el código escrito', keys: ['Enter'], spot: 'codigo' },
        { label: 'Buscar artículo', keys: ['B'], desc: 'Abre Productos con el filtro vacío.', spot: 'productos' },
        { label: 'Buscar artículo sin borrar el filtro', keys: ['V'], desc: 'Abre Productos con la última búsqueda.' },
        { label: 'Subir la cantidad', keys: ['Num +'], spot: 'mas' },
        { label: 'Bajar la cantidad', keys: ['Num −'], spot: 'menos' },
        { label: 'Cantidad exacta', keys: ['CTRL+Q'], spot: 'cantidad' },
        { label: 'Cambio de precio', keys: ['S'], spot: 'lapiz' },
        { label: 'Descuento al artículo', keys: ['H'], spot: 'etiqueta' },
        { label: 'Descuento total', keys: ['D'], menu: true, desc: 'Descuento sobre toda la venta.' },
        { label: 'Quitar renglón', keys: ['Supr'], spot: 'tacho' },
        { label: 'Subir la selección', keys: ['CTRL+Num −'], spot: 'arriba' },
        { label: 'Bajar la selección', keys: ['CTRL+Num +'], spot: 'abajo' },
        { label: 'Detalle de stock', keys: ['CTRL+S'], spot: 'stock' },
        { label: 'Devolución de artículo', keys: ['CTRL+D'], menu: true }
      ]],
      ['La venta', [
        { label: 'Pagar', keys: ['P', 'Espacio', 'Num .'], desc: 'Abre Pago detallado.', spot: 'pagar' },
        { label: 'Cancelar la venta', keys: ['C'], spot: 'cancelar' },
        { label: 'Suspender venta', keys: ['J'], menu: true, desc: 'La deja en espera para retomarla después.' },
        { label: 'Factura Electrónica', keys: ['Z'], menu: true, desc: 'Elige el tipo de comprobante.', spot: 'comprobante' }
      ]],
      ['Clientes', [
        { label: 'Buscar cliente del local', keys: ['X'], spot: 'clienteBuscar' },
        { label: 'Cliente de facturación', keys: ['O'], menu: true, spot: 'clienteFact' },
        { label: 'Copiar el cliente a la factura', keys: ['E'], spot: 'copiar' }
      ]],
      ['Caja y dinero', [
        { label: 'Menú', keys: ['CTRL+M'], spot: 'menu' },
        { label: 'Ingreso de dinero', keys: ['F'] },
        { label: 'Retiro de dinero', keys: ['R'] },
        { label: 'Arqueo de caja', keys: ['A'] },
        { label: 'Gastos', keys: ['CTRL+G'], menu: true },
        { label: 'Reimprimir el último ticket', keys: ['I'] }
      ]],
      ['Listas de precio', [
        { label: 'Usar la lista 0 a 5', keys: ['CTRL+0', 'CTRL+1', 'CTRL+2', 'CTRL+3', 'CTRL+4', 'CTRL+5'] },
        { label: 'Elegir una lista', keys: ['CTRL+6'] },
        { label: 'Cambiar de lista', keys: ['Num /'] }
      ]]
    ]
  },
  {
    id: 'libre', label: 'Sin venta', desc: 'La Caja lista para empezar, con el carrito vacío.',
    groups: [
      ['Para empezar', [
        { label: 'Agregar el código escrito', keys: ['Enter'], spot: 'codigo' },
        { label: 'Buscar artículo', keys: ['B'], spot: 'productos' },
        { label: 'Buscar artículo sin borrar el filtro', keys: ['V'] },
        { label: 'Resumir venta', keys: ['J'], menu: true, desc: 'Retoma una venta suspendida.' },
        { label: 'Cancelar', keys: ['C'], spot: 'cancelar' }
      ]],
      ['Clientes', [
        { label: 'Buscar cliente', keys: ['X'], spot: 'clienteBuscar' },
        { label: 'Agregar cliente', keys: ['CTRL+A'], menu: true },
        { label: 'Cobro de cuenta corriente', keys: ['CTRL+C'], menu: true },
        { label: 'Recargar clientes', keys: ['CTRL+L'], menu: true }
      ]],
      ['Caja y dinero', [
        { label: 'Menú', keys: ['CTRL+M'], spot: 'menu' },
        { label: 'Ingreso de dinero', keys: ['F'], menu: true },
        { label: 'Retiro de dinero', keys: ['R'], menu: true },
        { label: 'Arqueo de caja', keys: ['A'], menu: true },
        { label: 'Gastos', keys: ['CTRL+G'], menu: true }
      ]],
      ['Comprobantes', [
        { label: 'Factura Electrónica', keys: ['Z'], menu: true },
        { label: 'Nota de Crédito Libre', keys: ['N'], menu: true },
        { label: 'Imprimir ticket', keys: ['I'], menu: true, desc: 'Reimprime el último ticket.' },
        { label: 'Reimpresión local', keys: ['D'], menu: true },
        { label: 'Reimpresión desde el servidor', keys: ['CTRL+D'], menu: true }
      ]],
      ['Mantenimiento', [
        { label: 'Recargar artículos', keys: ['CTRL+Q'], menu: true, desc: 'Trae los artículos y precios actualizados desde la web.' },
        { label: 'Forzar la descarga de datos', keys: ['CTRL+F'] },
        { label: 'Configurar la impresora', keys: ['CTRL+I'] },
        { label: 'Configurar el servidor', keys: ['CTRL+U'] },
        { label: 'Usar la lista de precio 0 a 5', keys: ['CTRL+0', 'CTRL+1', 'CTRL+2', 'CTRL+3', 'CTRL+4', 'CTRL+5'] },
        { label: 'Elegir una lista de precio', keys: ['CTRL+6'] },
        { label: 'Cambiar de lista de precio', keys: ['Num /'] }
      ]]
    ]
  },
  {
    id: 'cobro', label: 'En el cobro', desc: 'Con Pago detallado abierto.',
    groups: [
      ['Medios de pago', [
        { label: 'Efectivo', keys: ['1'] },
        { label: 'Cuenta corriente', keys: ['2'] },
        { label: 'Tarjeta de débito', keys: ['3'] },
        { label: 'Tarjeta de crédito', keys: ['4'] },
        { label: 'Transferencia', keys: ['5'] },
        { label: 'MercadoPago', keys: ['6'] },
        { label: 'Más opciones', keys: ['M'] }
      ]],
      ['Cerrar o volver', [
        { label: 'Pagar y empezar otra venta', keys: ['P', 'Espacio', 'F1', 'Num .'], spot: 'pagar' },
        { label: 'Volver a la venta', keys: ['Esc', 'V', 'Num *'] },
        { label: 'Limpiar los pagos', keys: ['L'] },
        { label: 'Cancelar la venta', keys: ['F'], desc: 'Ojo: en el cobro la F cancela la venta.' }
      ]],
      ['Clientes y factura', [
        { label: 'Cargar cliente', keys: ['D'] },
        { label: 'Factura Electrónica', keys: ['Z'], spot: 'comprobante' },
        { label: 'Cliente de facturación', keys: ['O'], spot: 'clienteFact' }
      ]]
    ]
  },
  {
    id: 'otras', label: 'Otras pantallas', desc: 'Arqueo, cierre de día, horario y CAEA.',
    groups: [
      ['Arqueo', [
        { label: 'Ir al cierre de día', keys: ['C'] },
        { label: 'Volver al inicio de sesión', keys: ['Espacio'] }
      ]],
      ['Cierre de día', [
        { label: 'Volver al inicio de sesión', keys: ['Espacio'] }
      ]],
      ['Horario del personal', [
        { label: 'Registrar entrada', keys: ['I'] },
        { label: 'Registrar salida', keys: ['O'] },
        { label: 'Volver a la venta', keys: ['Esc', 'V'] }
      ]],
      ['CAEA', [
        { label: 'Solicitar CAEA', keys: ['I'] },
        { label: 'Informar CAEA', keys: ['J'] },
        { label: 'Volver a la venta', keys: ['Esc', 'V'] }
      ]]
    ]
  }
];

/** Todos los atajos en una lista plana: { state, group, label, keys, ... }. */
export const ALL_SHORTCUTS = KEY_STATES.flatMap(st => st.groups.flatMap(([group, list]) => list.map(k => ({ ...k, state: st.id, stateLabel: st.label, group }))));

/* Opciones del menú de tres rayas, tal como aparecen en la Caja 4.46.1 (pantalla sin venta). */
export const MENU_OPTIONS = [
  'Agregar cliente (CTRL+A)', 'Arqueo Caja (A)', 'Cobro Cta Cte(CTRL+C)', 'Factura Electronica (Z)', 'Gastos (Ctrl+G)',
  'Imprimir Ticket (i)', 'Ingreso Dinero (F)', 'Nota Credito Libre (N)', 'Recargar Articulos (CTRL+Q)', 'Recargar Clientes (CTRL+L)',
  'Reimpresion Local (D)', 'Reimpresion Server (CTRL+D)', 'Resumir Venta (J)', 'Retiro Dinero (R)'
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

/* Clientes de ejemplo para la búsqueda de clientes. */
export const CUSTOMERS = [
  { doc: '20304050', name: 'Cliente de ejemplo', iva: 'Consumidor Final', balance: -4220 },
  { doc: '27111222', name: 'Comercio de ejemplo', iva: 'Responsable Inscripto', balance: 0 },
  { doc: '30555666', name: 'Mayorista de ejemplo', iva: 'Monotributo', balance: 1500 },
  { doc: '23999888', name: 'Cliente frecuente de ejemplo', iva: 'Consumidor Final', balance: -800 }
];

/* Medios de Pago detallado, en el orden de la Caja (teclas 1 a 6). */
export const MEDIOS = [['Efectivo', I.cash], ['Cta Cte', I.bank], ['T. Débito', I.card], ['T. Crédito', I.card], ['Transferencia', I.transfer], ['MercadoPago', I.mp]];

/* Accesos directos de la Caja: tareas frecuentes que llevan al capítulo justo. */
export const TASKS = [
  { title: 'Hacer una venta', sub: 'De cargar a cobrar', icon: 'cart', go: { video: '01', t: 0 } },
  { title: 'Buscar un artículo', sub: 'Productos · tecla B', icon: 'search', go: { video: '03', t: 0 } },
  { title: 'Aplicar un descuento', sub: 'Etiqueta verde · % o $', icon: 'tag', go: { video: '04', t: 0 } },
  { title: 'Cambiar un precio', sub: 'Lápiz naranja', icon: 'edit', go: { video: '04', t: 25.5 } },
  { title: 'Quitar un artículo', sub: 'Tacho rojo · confirmación', icon: 'trash', go: { video: '05', t: 0 } },
  { title: 'Cobrar con dos medios', sub: 'Pago detallado', icon: 'card', go: { video: '06', t: 0 } },
  { title: 'Agregar un cliente', sub: 'Menú o CTRL+A sin venta', icon: 'users', go: { video: '07', t: 0 } },
  { title: 'Facturar a un cliente', sub: 'Panel Factura · Factura B', icon: 'receipt', go: { video: '08', t: 43.5 } },
  { title: 'Ver todos los atajos', sub: 'Por pantalla de la Caja', icon: 'keyboard', go: { shortcut: 'Buscar artículo' } }
];

/* Respuestas rápidas: problemas concretos de la caja. go: adónde lleva el botón. */
export const QUICK = [
  { q: 'La venta quedó con total negativo', a: 'Pasa al quitar un artículo que tenía descuento. Quitá primero el renglón del descuento y después el artículo.', label: 'Ver en el video 05 · 0:04', go: { video: '05', t: 4.5 } },
  { q: 'El cliente paga una parte en efectivo y otra con tarjeta', a: 'En Pago detallado elegí un medio, escribí el monto y aceptá. Repetí hasta que el Saldo llegue a cero.', label: 'Ver en el video 06 · 0:18', go: { video: '06', t: 18 } },
  { q: 'No me acuerdo el código del artículo', a: 'Presioná Productos o la tecla B y escribí parte del nombre. La lista se achica mientras escribís.', label: 'Probalo en la Caja', go: { spot: 'productos', practice: true } },
  { q: '¿Qué significa VENTA FAC. ELECTRONICA MANUAL?', a: 'Que esa venta se factura a mano en la página de ARCA. Miralo siempre antes de cobrar.', label: 'Ver en el video 01 · 0:21', go: { video: '01', t: 21 } },
  { q: 'Me equivoqué al cargar un pago', a: 'Limpiar borra todos los pagos de la lista, previa confirmación. Después volvé a cargarlos.', label: 'Ver en el video 06 · 0:27', go: { video: '06', t: 27 } },
  { q: 'Cambié precios en la web y la Caja no los muestra', a: 'Sin venta en curso, recargá los artículos con CTRL+Q o desde el menú de tres rayas.', label: 'Ver los atajos', go: { shortcut: 'Recargar artículos' } }
];

/* Menú de sistema.buhomanager.com. subs: [nombre, descripción, tiene guía interactiva]. */
export const WEB = [
  { id: 'transacciones', name: 'Gestión Transacciones', icon: 'receipt', tint: 'var(--t-blue)', desc: 'Tus ventas y los comprobantes que registran las cajas.' },
  {
    id: 'articulos', name: 'Gestión Artículos', icon: 'box', tint: 'var(--t-green)', desc: 'Tu catálogo, precios, promociones y etiquetas. Lo que cambiás acá llega a la Caja.',
    subs: [
      ['Artículos', 'Lista de artículos con filtros, precios y fecha de actualización.', true],
      ['Insumos', 'Materias primas que componen los artículos.'], ['Carga Rápida', 'Alta de artículos en pocos pasos.'],
      ['Departamentos', 'Agrupan los artículos por rubro.'], ['Promociones', 'Las que la Caja agrega sola en otro renglón.'],
      ['Canasta', 'Conjuntos de artículos.'], ['Actualización Masiva', 'Cambiar precios de muchos artículos a la vez.'],
      ['Etiquetas', 'Impresión de etiquetas de precio.'], ['Consultar', 'Consulta rápida de un artículo.'],
      ['Vencimiento', 'Control de fechas de vencimiento.']
    ]
  },
  { id: 'stock', name: 'Gestión Stock', icon: 'stock', tint: 'var(--t-amber)', desc: 'Existencias, ingresos y ajustes de mercadería.' },
  { id: 'clientes', name: 'Gestión Clientes', icon: 'users', tint: 'var(--t-violet)', desc: 'Tus clientes, sus cuentas corrientes y los datos de facturación que usa el panel Cliente de la Caja.' },
  { id: 'proveedores', name: 'Gestión Proveedores', icon: 'truck', tint: 'var(--t-blue)', desc: 'Tus proveedores y sus compras.' },
  { id: 'operadores', name: 'Gestión Operadores', icon: 'badge', tint: 'var(--t-amber)', desc: 'Los cajeros y operadores que usan la Caja.' },
  { id: 'gastos', name: 'Gestión Gastos', icon: 'wallet', tint: 'var(--t-rose)', desc: 'Los gastos del comercio, incluidos los que se declaran desde la Caja con CTRL+G.' },
  { id: 'financiera', name: 'Gestión Financiera', icon: 'chart', tint: 'var(--t-green)', desc: 'Movimientos de dinero y medios de pago.' },
  { id: 'varias', name: 'Gestiones Varias', icon: 'sliders', tint: 'var(--t-slate)', desc: 'Configuraciones generales del comercio.' },
  { id: 'cheques', name: 'Gestión de Cheques', icon: 'cheque', tint: 'var(--t-amber)', desc: 'Cheques recibidos y emitidos.' },
  { id: 'reportes', name: 'Reportes', icon: 'chart', tint: 'var(--t-violet)', desc: 'Informes de ventas, artículos y caja.' },
  { id: 'usuarios', name: 'Gestión de Usuarios', icon: 'shield', tint: 'var(--t-blue)', desc: 'Los usuarios y sus permisos en el sistema web.' }
];

/* Marcadores de la guía de Artículos: [número, título, explicación]. */
export const ART_MARKS = [
  [1, 'Nombre / Código', 'Escribí parte del nombre o el código del artículo.'],
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
