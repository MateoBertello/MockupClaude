// Ruta de videos de la Caja POS.
// chapters[].steps: el paso a paso, escrito para la ayuda. [segundo, texto, punto del mapa o null].
// cues: la narración literal del video, sacada de sus subtítulos. *texto* marca un rótulo de pantalla.

export const VIDEOS = {
  '01': {
    file: '01-venta', title: 'Cómo hacer una venta', dur: 83.8,
    category: 'Primeros pasos', tint: 'var(--t-blue)',
    desc: 'Cargá un artículo, cobrá en efectivo y cerrá la venta.',
    tip: 'Antes de cobrar mirá el título de arriba: te dice cómo se factura esa venta.',
    practice: 'codigo',
    chapters: [
      { t: 0, title: 'Cargar el artículo', steps: [
        [4.5, 'Escaneá el código de barras del artículo.', 'codigo'],
        [7.5, 'Si no tenés lector, escribí el código en el campo y presioná Enter.', 'codigo'],
        [13.5, 'El artículo entra al carrito y el total de la derecha se actualiza.', 'totales'],
        [19.5, 'Mirá el título: FAC. ELECTRONICA MANUAL significa que la factura se hace a mano en la página de ARCA.', 'titulo']
      ] },
      { t: 28.5, title: 'Pagar', steps: [
        [28.5, 'Cuando termines de cargar, presioná Pagar.', 'pagar'],
        [33, 'Se abre Pago detallado: a la izquierda los medios de pago y a la derecha el Total y el Saldo.', 'pagar']
      ] },
      { t: 52.5, title: 'Efectivo y vuelto', steps: [
        [52.5, 'Elegí Efectivo, escribí el importe que te entregan y presioná Aceptar.', 'pagar'],
        [61.5, 'El pago entra a la lista y Vuelto te dice cuánto devolver.', null],
        [66, 'Presioná Pagar para cerrar la venta y elegí si imprimís el comprobante.', 'pagar'],
        [78, 'La venta queda registrada y la Caja vuelve a cero.', null]
      ] }
    ],
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
    category: 'Conocé tu Caja', tint: 'var(--t-slate)',
    desc: 'Ubicá cada botón y movete más rápido con el teclado.',
    tip: 'La tecla B abre Productos. El resto de los atajos figura entre paréntesis en el menú de tres rayas.',
    practice: 'mas',
    chapters: [
      { t: 0, title: 'Botones del renglón', steps: [
        [6, 'Con + y − subís o bajás la cantidad del renglón seleccionado.', 'mas'],
        [9, 'El tercer botón abre Cantidad para escribir el número exacto.', 'cantidad'],
        [13.5, 'El lápiz naranja cambia el precio y el tacho rojo quita el renglón.', 'lapiz'],
        [18, 'La etiqueta verde aplica un descuento y las flechas mueven la selección.', 'etiqueta']
      ] },
      { t: 24, title: 'Productos, Cancelar y Pagar', steps: [
        [24, 'Productos busca artículos por nombre. También se abre con la tecla B.', 'productos'],
        [31.5, 'Cancelar descarta toda la venta y Pagar abre el cobro.', 'cancelar'],
        [37.5, 'El panel Cliente asigna un cliente y el panel Factura define el comprobante.', 'cliente']
      ] },
      { t: 46.5, title: 'Menú y atajos', steps: [
        [46.5, 'El botón de tres rayas abre el menú con el resto de las funciones.', 'menu'],
        [51, 'Cada opción muestra su atajo entre paréntesis, por ejemplo Ctrl + C para el cobro de cuenta corriente.', 'menu'],
        [67.5, 'Cancelar cierra el menú sin elegir nada.', null]
      ] }
    ],
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
    category: 'Productos y cantidades', tint: 'var(--t-green)',
    desc: 'Encontrá un artículo por nombre y ajustá la cantidad en segundos.',
    tip: 'Si el artículo tiene una promoción, la Caja la agrega sola en otro renglón.',
    practice: 'productos',
    chapters: [
      { t: 0, title: 'Productos', steps: [
        [4.5, 'Presioná Productos o la tecla B para abrir la lista.', 'productos'],
        [10.5, 'Escribí parte del nombre: la lista se achica mientras escribís.', 'productos'],
        [16.5, 'Hacé clic en el artículo y presioná Aceptar para pasarlo al carrito.', 'carrito']
      ] },
      { t: 22.5, title: 'Cantidad', steps: [
        [22.5, 'Seleccioná el renglón y usá + y − para subir o bajar de a uno.', 'mas'],
        [33, 'El total se recalcula con cada clic.', 'totales'],
        [37.5, 'Para un número exacto abrí Cantidad, escribilo y presioná Aceptar.', 'cantidad']
      ] }
    ],
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
    category: 'Precios y descuentos', tint: 'var(--t-amber)',
    desc: 'Aplicá un descuento a un artículo o corregí su precio.',
    tip: 'El descuento queda en un renglón propio. Si después quitás el artículo, sacá primero ese renglón.',
    practice: 'etiqueta',
    chapters: [
      { t: 0, title: 'Descuento', steps: [
        [3, 'Seleccioná el renglón y presioná la etiqueta verde.', 'etiqueta'],
        [10.5, 'En Valor escribí cuánto descontar y elegí porcentaje o monto fijo.', 'etiqueta'],
        [19.5, 'Al aceptar aparece un renglón de descuento y el total baja.', 'totales']
      ] },
      { t: 25.5, title: 'Cambio de precio', steps: [
        [25.5, 'Seleccioná el renglón y presioná el lápiz naranja.', 'lapiz'],
        [34.5, 'Escribí el monto nuevo, o elegí un recargo o un descuento en porcentaje.', 'lapiz'],
        [45, 'Si te arrepentís, Cancelar cierra la ventana sin cambiar el precio.', null]
      ] }
    ],
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
  '05': {
    file: '05-quitar-cancelar', title: 'Quitar artículos y cancelar la venta', dur: 40,
    category: 'Correcciones', tint: 'var(--t-violet)',
    desc: 'Sacá un renglón cargado por error o empezá la venta de cero.',
    tip: 'Antes de confirmar, mirá qué renglón tenés seleccionado: es el que se va a borrar.',
    warnSpot: 'tacho',
    practice: 'tacho',
    chapters: [
      { t: 0, title: 'Quitar un renglón', steps: [
        [4.5, 'Si el artículo tiene descuento, seleccioná primero el renglón del descuento.', 'tacho'],
        [9, 'Presioná el tacho rojo y confirmá con Aceptar.', 'tacho'],
        [18, 'Después quitá el artículo de la misma forma. Así el total nunca queda negativo.', 'tacho']
      ] },
      { t: 24, title: 'Cancelar la venta', steps: [
        [24, 'Para descartar toda la venta presioná Cancelar.', 'cancelar'],
        [28.5, 'La Caja te pide confirmar. Revisá antes de aceptar.', 'cancelar'],
        [31.5, 'Se vacían el carrito, el cliente y la factura.', 'cliente']
      ] }
    ],
    cues: [
      [0, '¿Cargó algo por error? Se puede quitar antes de cobrar.'],
      [4.5, 'Si el artículo tiene descuento quite primero ese renglón.'],
      [9, 'Selecciónelo y presione el tacho rojo. La caja pide confirmación.'],
      [15, 'Al aceptar el renglón desaparece.'],
      [18, 'Después quite el artículo de la misma forma.'],
      [21, 'Así el total nunca queda negativo.'],
      [24, 'Para descartar toda la venta presione *Cancelar*.'],
      [28.5, 'La caja pregunta si desea cancelar la transacción.'],
      [31.5, 'Al aceptar el carrito queda vacío.'],
      [36, 'También se quitan el cliente y la factura que había elegido.']
    ]
  },
  '06': {
    file: '06-medios-pago', title: 'Combinar medios de pago', dur: 46.7,
    category: 'Cobros', tint: 'var(--t-teal)',
    desc: 'Cobrá una parte en efectivo y otra con tarjeta.',
    tip: 'Saldo te muestra en todo momento cuánto falta cobrar.',
    practice: 'pagar',
    chapters: [
      { t: 0, title: 'Pago detallado', steps: [
        [4.5, 'Presioná Pagar para abrir Pago detallado.', 'pagar'],
        [6, 'Elegí un medio: Efectivo, Cta Cte, tarjetas, Transferencia o MercadoPago.', 'pagar'],
        [18, 'Escribí el monto que se paga con ese medio y aceptá.', 'pagar'],
        [21, 'El pago entra a la lista y Saldo muestra lo que falta. Repetí con el otro medio.', null]
      ] },
      { t: 27, title: 'Limpiar y Volver', steps: [
        [27, 'Si te equivocaste, Limpiar borra todos los pagos. Antes pide confirmación.', null],
        [37.5, 'Cuando el Saldo llega a cero, Pagar registra la venta.', 'pagar'],
        [42, 'Volver regresa a la venta sin cobrar nada.', null]
      ] }
    ],
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

VIDEOS['07'] = {
  file: '07-agregar-cliente', title: 'Agregar un cliente', dur: 48.5,
  category: 'Clientes', tint: 'var(--t-rose)',
  desc: 'Dá de alta un cliente nuevo sin salir de la Caja.',
  tip: 'El atajo CTRL+A abre la ficha directo, sin pasar por el menú.',
  practice: 'menu',
  chapters: [
    { t: 0, title: 'Agregar cliente', steps: [
      [4.5, 'El cliente del local es el que lleva la cuenta corriente y los puntos de fidelización.', 'cliente'],
      [10.5, 'Abrí el menú de tres rayas y escribí "agregar" en el filtro. También podés usar CTRL+A.', 'menu'],
      [19.5, 'Elegí Agregar cliente y presioná Aceptar. Se abre la ficha del cliente.', 'menu'],
      [27, 'Completá tipo y número de documento y la condición de IVA.', null],
      [33, 'Después el nombre y el apellido, los datos de contacto, la dirección y la sucursal.', null],
      [42, 'Aceptar guarda el cliente nuevo. Cancelar cierra la ficha sin guardar.', null]
    ] }
  ],
  cues: [
    [0, 'Un cliente nuevo se puede dar de alta sin salir de la *Caja*.'],
    [4.5, 'Es el cliente del local.'],
    [6, 'Con él se llevan la cuenta corriente y los puntos de fidelización.'],
    [10.5, 'Abra el menú de tres rayas.'],
    [13.5, 'Escriba agregar en el filtro. También existe el atajo Control A.'],
    [19.5, 'Elija *Agregar cliente* y presione *Aceptar*. Se abre la ficha del cliente.'],
    [27, 'Complete el tipo de documento y el número. Después elija la condición de IVA.'],
    [33, 'Siguen el nombre y el apellido.'],
    [36, 'Luego los datos de contacto y la dirección.'],
    [39, 'Al final la sucursal.'],
    [42, '*Aceptar* guarda el cliente nuevo.'],
    [45, '*Cancelar* cierra la ficha sin guardar.']
  ]
};

VIDEOS['08'] = {
  file: '08-cliente-factura', title: 'Cliente y tipo de comprobante', dur: 109.4,
  category: 'Clientes y facturación', tint: 'var(--t-blue)',
  desc: 'Asigná el cliente del local, elegí el comprobante y cargá a quién se factura.',
  tip: 'Si el cliente del local es el mismo al que facturás, la flecha » del panel Cliente lo copia en un toque.',
  practice: 'factura',
  chapters: [
    { t: 0, title: 'El título de la venta', steps: [
      [4.5, 'Mirá el título: FAC. ELECTRONICA MANUAL significa que la factura se hace a mano en la página de ARCA.', 'titulo'],
      [15, 'El cliente y la factura se eligen en los dos paneles de abajo.', 'cliente']
    ] },
    { t: 19.5, title: 'Cliente del local', steps: [
      [19.5, 'El panel Cliente es el cliente del local: cuenta corriente y puntos de fidelización.', 'cliente'],
      [28.5, 'Su primer ícono abre la lista de clientes. Buscá por nombre o por documento.', 'cliente'],
      [36, 'Elegí el cliente y presioná Aceptar. El panel muestra sus datos y el Balance de su cuenta.', 'cliente']
    ] },
    { t: 43.5, title: 'Cliente de facturación', steps: [
      [46.5, 'El primer ícono del panel Factura abre el tipo de comprobante. Por ejemplo, Factura B.', 'factura'],
      [54, 'El título cambia a VENTA AFIP y Factura Electronica: el sistema emite la factura al cobrar.', 'titulo'],
      [63, 'El panel avisa que falta el cliente de facturación. El segundo ícono lo carga con tipo y número de documento y condición de IVA.', 'factura'],
      [85.5, 'Lo más rápido: la flecha » del panel Cliente pasa el cliente de la venta a la factura.', 'cliente'],
      [96, 'Al pagar, el panel Factura sigue mostrando al cliente: se cobra y se factura a su nombre.', 'pagar']
    ] }
  ],
  cues: [
    [0, 'En este video verá cómo trabajar con el cliente y la factura.'],
    [4.5, 'Mire siempre el título de arriba. Ahora dice *Factura electrónica manual*.'],
    [10.5, 'Significa que esta venta se factura a mano en la página de ARCA.'],
    [15, 'El cliente y la factura se eligen en los dos paneles de abajo.'],
    [19.5, 'El panel *Cliente* es el cliente del local.'],
    [24, 'Es el que se usa para la cuenta corriente y para sumar puntos de fidelización.'],
    [28.5, 'Su primer ícono abre la lista de clientes.'],
    [31.5, 'Busque por nombre o por documento.'],
    [36, 'Elija el cliente y presione *Aceptar*.'],
    [39, 'El panel muestra sus datos y el *Balance* de su cuenta.'],
    [43.5, 'Ahora vamos a la factura.'],
    [46.5, 'El primer ícono del panel *Factura* abre el tipo de comprobante.'],
    [49.5, 'En este ejemplo elegimos *Factura B* y aceptamos.'],
    [54, 'Mire cómo cambió el título.'],
    [57, 'Ahora dice *VENTA AFIP* y *Factura Electronica*.'],
    [60, 'Esta factura la emite el sistema al cobrar.'],
    [63, 'El panel avisa que todavía falta el cliente de facturación.'],
    [66, 'Puede cargar el CUIT o el CUIL que le da la persona.'],
    [70.5, 'Use el segundo ícono del panel.'],
    [73.5, 'Elija el tipo de documento. Escriba el número.'],
    [79.5, 'Después elija la condición de IVA.'],
    [82.5, 'Esta vez cerramos con *Cancelar*.'],
    [85.5, 'La forma más rápida es usar el cliente que ya está en la venta.'],
    [90, 'Con la flecha del panel *Cliente* se pasa a la factura.'],
    [96, 'Al presionar *Pagar* el panel *Factura* sigue mostrando al cliente.'],
    [100.5, 'Así se cobra y se factura a nombre de esa persona.'],
    [103.5, 'En este ejemplo no cobramos. *Volver* regresa a la venta.']
  ]
};

export const VIDEO_IDS = Object.keys(VIDEOS);
export const TOTAL_DUR = VIDEO_IDS.reduce((a, id) => a + VIDEOS[id].dur, 0);

export const UPCOMING = [
  '09 · Arqueo y nota de crédito',
  '10 · Ingresos y retiros de dinero', '11 · Declarar un gasto', '12 · Cobro de cuenta corriente',
  '13 · Opciones durante la venta', '14 · Reimprimir comprobantes', '15 · Recargar artículos y clientes',
  '16 · Arqueo de caja'
];

export const videoSrc = id => `videos/${VIDEOS[id].file}.mp4`;
export const posterSrc = id => `posters/${VIDEOS[id].file}.jpg`;

/** Segundo en que termina la frase i de la narración. */
export const cueEnd = (id, i) => (i + 1 < VIDEOS[id].cues.length ? VIDEOS[id].cues[i + 1][0] : VIDEOS[id].dur);

/** Índice del último elemento [segundo, ...] que ya empezó en el segundo t. */
export function indexAt(list, t, lead = 0.7) {
  let k = -1;
  for (let i = 0; i < list.length; i++) if (list[i][0] <= t + lead) k = i;
  return k;
}
export const cueAt = (id, t) => indexAt(VIDEOS[id].cues, t);
export const chapterAt = (id, t) => indexAt(VIDEOS[id].chapters.map(c => [c.t]), t);

/** Todos los pasos del video en orden, con su capítulo. */
export const allSteps = id => VIDEOS[id].chapters.flatMap((c, ci) => c.steps.map(s => ({ t: s[0], text: s[1], spot: s[2], ci })));

/** Videos donde aparece un punto del mapa (según el paso a paso). */
export const videosForSpot = spot => VIDEO_IDS.filter(id => allSteps(id).some(s => s.spot === spot));
