// Ventanas de la Caja de práctica, con la piel real y las medidas de designx:
// confirmación (dataentry.confirmation), formularios (dataentry.medium), Productos (itemsearch),
// Clientes (customersearch), menú de tres rayas (genericsearch) y alta de cliente.
// También responde a los botones de la pantalla de cobro.

import { $, esc, money, fmtQty, norm, box, fs } from '../utils.js';
import { CATALOG, MEDIOS, CUSTOMERS, MENU_OPTIONS, MENU_SALE } from '../data/content.js';
import { S, totals, paid, addLog, selItem, nextId, clearSale, keyState } from '../state.js';
import { addItem, refresh, mission } from './actions.js';

const dlgEl = $('#rp-dlg');
const A = p => `assets/caja/${p}`;
export const MEDIO_NAMES = MEDIOS.map(m => m[0]);
const customers = [...CUSTOMERS];

export function openDlg(d) { S.dlg = d; renderDlg(); }
export function closeDlg() { S.dlg = null; renderDlg(); }

/* ---------- Plantillas ---------- */
/** Posición relativa a la ventana (W x H): de píxeles de la ventana a porcentajes. */
const loc = (W, H) => (x, y, w, h) => `left:${x / W * 100}%;top:${y / H * 100}%;width:${w / W * 100}%;height:${h / H * 100}%`;
const imgBtn = (b, name, act, label) => `<button type="button" class="rb dlg-btn" data-act="${act}" aria-label="${label}" style="${b}"><img src="${A('btn/' + name + '.png')}" alt=""><img class="dn" src="${A('btn/' + name + '_Press.png')}" alt=""></button>`;
const closeBtn = b => `<button type="button" class="rb dlg-x" data-act="close" aria-label="Cerrar" style="${b}"><img src="${A('btn/Close.png')}" alt=""><img class="dn" src="${A('btn/Close_Press.png')}" alt=""></button>`;
const text = (t, b, f, o = '') => `<div class="rl" style="${b};${fs(f)};${o}">${t}</div>`;

/** Ventana centrada en la pantalla de la Caja. */
function win(W, H, inner, { bg, cls = '', label = 'Ventana', x, y } = {}) {
  const left = x ?? (1040 - W) / 2, top = y ?? Math.max(0, (655 - H) / 2);
  const bgStyle = bg ? `background-image:url('${A('bg/' + bg + '.png')}')` : '';
  return `<div class="rwin ${cls}${bg ? ' has-bg' : ''}" role="dialog" aria-label="${esc(label)}" style="${box(left, top, W, H)};${bgStyle}">${inner}</div>`;
}

/** Formulario como dataentry.medium: título, campos de a uno y Aceptar / Cancelar. */
function form(title, fields, { ok = 'ok', err = '', W = 400 } = {}) {
  const H = 78 + fields.length * 52 + 18 + 70;
  const L = loc(W, H);
  let h = closeBtn(L(W - 37, 5, 30, 30)) + text(esc(title), L(0, 30, W, 36), 20, 'justify-content:center');
  fields.forEach((f, i) => {
    const y = 78 + i * 52;
    h += text(esc(f.label), L(50, y, 300, 20), 12);
    const input = f.options
      ? `<select id="${f.id}">${f.options.map(o => `<option${o === f.value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`
      : `<input id="${f.id}" value="${esc(f.value ?? '')}" inputmode="${f.num ? 'decimal' : 'text'}" autocomplete="off">`;
    h += `<div class="rfield" style="${L(50, y + 21, 300, 26)}">${input}</div>`;
  });
  h += text(esc(err), L(20, H - 92, W - 40, 20), 12, 'justify-content:center;color:#8E1F1F').replace('class="rl"', 'class="rl rerr" id="dErr"');
  h += imgBtn(L(15, H - 62, 180, 50), 'btn_Aceptar', ok, 'Aceptar') + imgBtn(L(205, H - 62, 180, 50), 'btn_Cancelar', 'close', 'Cancelar');
  return win(W, H, h, { label: title, cls: 'rform' });
}

/** Confirmación como dataentry.confirmation (400 x 270). Con only, un solo Aceptar (aviso). */
function confirmWin(title, msg, ok = 'confirm-ok', only = false) {
  const L = loc(400, 270);
  const btns = only
    ? imgBtn(L(110, 210, 180, 50), 'btn_Aceptar', 'close', 'Aceptar')
    : imgBtn(L(15, 210, 180, 50), 'btn_Aceptar', ok, 'Aceptar') + imgBtn(L(205, 210, 180, 50), 'btn_Cancelar', 'close', 'Cancelar');
  const h = closeBtn(L(363, 5, 30, 30)) + text(esc(title), L(0, 36, 400, 36), 20, 'justify-content:center') +
    text(esc(msg), L(20, 72, 360, 128), 17, 'justify-content:center;text-align:center;white-space:normal') + btns;
  return win(400, 270, h, { bg: 'bgConfirmation', label: title || 'Confirmación' });
}

function listWin({ W, H, bg, x, y, label, input, filterLabel = 'Filtros de busqueda', head = '', list, listBox, ok, cancel }) {
  const L = loc(W, H);
  return win(W, H,
    closeBtn(L(W - 37, 5, 30, 30)) + text(filterLabel, L(10, 25, 200, 60), 15, 'font-weight:700') +
    `<div class="rfield big" style="${L(10, 68, 300, 40)}"><input id="lq" value="${esc(input)}" autocomplete="off" aria-label="Filtro"></div>` +
    head + `<div class="rlist" id="lList" style="${L(...listBox)}">${list}</div>` +
    imgBtn(L(...ok), 'btn_Aceptar', 'ok', 'Aceptar') + imgBtn(L(...cancel), 'btn_Cancelar', 'close', 'Cancelar'),
    { bg, x, y, label });
}

/* ---------- Ventanas ---------- */
const filtered = d => {
  const q = norm(d.q || '');
  if (d.k === 'productos') return CATALOG.filter(p => !q || norm(p[1]).includes(q) || p[0].startsWith(q));
  if (d.k === 'clientes') return customers.filter(c => !q || norm(c.name).includes(q) || c.doc.includes(q));
  return (keyState() === 'venta' ? MENU_SALE : MENU_OPTIONS).filter(o => !q || norm(o).includes(q));
};
function listRows(d) {
  d.list = filtered(d);
  if (d.idx >= d.list.length) d.idx = 0;
  if (!d.list.length) return '<div class="rempty">Sin resultados.</div>';
  return d.list.map((x, i) => {
    const cells = d.k === 'productos' ? [x[0], esc(x[1]), x[2].toFixed(1)] : d.k === 'clientes' ? [x.doc, esc(x.name)] : [esc(x)];
    return `<div class="lrow ${d.k}${i === d.idx ? ' on' : ''}" data-act="pick" data-i="${i}">${cells.map(c => `<span>${c}</span>`).join('')}</div>`;
  }).join('');
}

const VIEWS = {
  cantidad: () => form('Cantidad', [{ id: 'fQty', label: 'Cantidad', value: fmtQty(selItem().qty), num: true }]),
  descuento: () => form('Descuento', [{ id: 'fVal', label: 'Valor', value: '10.0', num: true }, { id: 'fTipo', label: 'Tipo de descuento', options: ['Descuento Porcentual', 'Descuento Monto Fijo'] }]),
  precio: () => form('Cambio de precio', [{ id: 'fMonto', label: 'Monto Modificado $', value: '', num: true }, { id: 'fAjuste', label: 'Tipo de Ajuste', options: ['Recargo', 'Descuento'] }, { id: 'fPct', label: 'Porcentaje %', value: '', num: true }]),
  comprobante: () => form('', [{ id: 'fTipoFac', label: 'Tipo Factura', options: ['Factura B', 'Factura A'], value: S.comprobante || 'Factura B' }]),
  factcli: () => form('', [{ id: 'fTipoDoc', label: 'Tipo Documento', options: ['CUIT', 'CUIL', 'DNI'] }, { id: 'fNroDoc', label: 'Numero documento', value: '', num: true }, { id: 'fIva', label: 'Condicion IVA', options: ['Ninguno', 'Consumidor Final', 'Responsable Inscripto', 'Monotributo', 'Exento'] }]),
  alta: () => form('Dar de alta cliente', [
    { id: 'aTipo', label: 'Tipo documento', options: ['CUIT', 'CUIL', 'DNI'] }, { id: 'aNro', label: 'Nro', value: '', num: true },
    { id: 'aIva', label: 'Condicion IVA', options: ['Consumidor Final', 'Responsable Inscripto', 'Monotributo', 'Exento'] },
    { id: 'aNombre', label: 'Nombre / Razon Social', value: '' }, { id: 'aApellido', label: 'Apellido', value: '' },
    { id: 'aEmail', label: 'Email', value: '' }, { id: 'aTel', label: 'Telefono', value: '' }, { id: 'aDir', label: 'Direccion', value: '' },
    { id: 'aSuc', label: 'Sucursal', value: '' }]),
  pagoMonto: d => form(d.medio, [{ id: 'fImporte', label: 'Importe', value: d.def.toFixed(2), num: true }]),
  confirm: d => confirmWin(d.title || '', d.msg),
  aviso: d => confirmWin('Quitar renglón', d.msg, 'aviso-go'),
  info: d => confirmWin(d.title || '', d.msg, 'close', true),
  monto: d => form('', [{ id: 'fMontoCaja', label: 'Ingrese Monto', value: '', num: true }]),
  gasto: () => form('Declaracion de Gasto', [{ id: 'gConcepto', label: 'Concepto', options: ['Limpieza', 'Mantenimiento', 'Librería', 'Delivery', 'Otros'] }, { id: 'gMotivo', label: 'Motivo', value: '' }, { id: 'gMonto', label: 'Monto del gasto', value: '', num: true }]),
  dtotal: () => form('Descuento Total', [{ id: 'fVal', label: 'Valor', value: '10.0', num: true }, { id: 'fTipo', label: 'Tipo de descuento', options: ['Descuento Porcentual', 'Descuento Monto Fijo'] }]),
  devprecio: d => form('Devolucion Articulo', [{ id: 'fPrecioDev', label: `Precio de ${d.p[1]}`, value: d.p[2].toFixed(2), num: true }]),
  resumir: () => {
    const t = new Date(), p = n => String(n).padStart(2, '0');
    return form('Resumir Transaccion', [{ id: 'rSuc', label: 'Sucursal', options: ['Sucursal 1', 'Sucursal 2'] }, { id: 'rFecha', label: 'Fecha(ddmmaa)', value: `${p(t.getDate())}/${p(t.getMonth() + 1)}/${String(t.getFullYear()).slice(2)}` }]);
  },
  productos: d => listWin({ W: 1000, H: 550, bg: 'bg_item_search', x: 20, y: 52, label: 'Productos', input: d.q, list: listRows(d), listBox: [12, 131, 755, 342], ok: [265, 490, 180, 50], cancel: [455, 490, 180, 50] }),
  clientes: d => {
    const L = loc(580, 450);
    const head = text('Dni/Cuit', L(12, 123, 118, 32), 12, 'font-weight:700;justify-content:center') + text('Nombre', L(131, 123, 430, 32), 12, 'font-weight:700;justify-content:center');
    return listWin({ W: 580, H: 450, bg: 'bg_customer_search', label: 'Buscar cliente', input: d.q, head, list: listRows(d), listBox: [18, 156, 542, 155], ok: [105, 361, 180, 50], cancel: [295, 361, 180, 50] });
  },
  menu: d => {
    const L = loc(680, 550);
    const head = text('Seleccione', L(24, 123, 630, 32), 12, 'font-weight:700;justify-content:center');
    return listWin({ W: 680, H: 550, bg: 'bg_generic_search', x: 180, y: 52, label: 'Menú', input: d.q, head, list: listRows(d), listBox: [24, 156, 630, 255], ok: [155, 461, 180, 50], cancel: [345, 461, 180, 50] });
  }
};

export function renderDlg() {
  const d = S.dlg;
  dlgEl.hidden = !d;
  dlgEl.innerHTML = d ? VIEWS[d.k](d) : '';
  if (!d) return;
  // Foco como en la Caja: el filtro o el primer campo; en una confirmación, Aceptar.
  const first = $('#lq', dlgEl) || $('.rwin input, .rwin select', dlgEl) || $('.rwin [data-act="confirm-ok"]', dlgEl) || $('.rwin [data-act="aviso-go"]', dlgEl) || $('.rwin .dlg-btn[data-act="close"]', dlgEl);
  if (first) { first.focus(); if (first.select) first.select(); }
}

function refreshList() {
  const d = S.dlg;
  $('#lList').innerHTML = listRows(d);
  const on = $('#lList .on');
  if (on) on.scrollIntoView({ block: 'nearest' });
}

/* ---------- Acciones ---------- */
const val = id => ($(id) ? $(id).value.trim() : '');
const num = id => parseFloat(val(id).replace(',', '.'));
const fail = msg => { const e = $('#dErr'); if (e) e.textContent = msg; };
const done = () => { closeDlg(); refresh(); };

function finishSale(printed) {
  const vuelto = paid() - totals().total;
  clearSale();
  mission('sale-done');
  addLog(`Venta registrada${printed ? ' e impresa' : ''}${vuelto > 0 ? ` · Vuelto ${money(vuelto)}` : ''}. La Caja vuelve a cero.`);
  done();
}

const HANDLERS = {
  cantidad() {
    const q = num('#fQty'), r = selItem();
    if (!(q > 0)) return fail('Ingresá un número mayor que cero.');
    r.qty = q; addLog(`${r.name}: cantidad ${fmtQty(q)} · Total ${money(totals().total)}`); mission('qty-set'); done();
  },
  monto(d) {
    const v = num('#fMontoCaja');
    if (!(v > 0)) return fail('Escribí un monto mayor que cero.');
    addLog(`${d.kind === 'in' ? 'Ingreso' : 'Retiro'} de dinero registrado: ${money(v)}.`);
    mission(d.kind === 'in' ? 'cash-in' : 'cash-out'); done();
  },
  gasto() {
    const v = num('#gMonto');
    if (!val('#gMotivo')) return fail('Escribí el motivo del gasto.');
    if (!(v > 0)) return fail('Escribí el monto del gasto.');
    addLog(`Gasto declarado: ${val('#gConcepto')} · ${money(v)}.`); mission('expense'); done();
  },
  dtotal() {
    const v = num('#fVal'), pct = val('#fTipo').includes('Porcentual'), sub = totals().sub;
    if (!(v > 0)) return fail('Escribí un valor mayor que cero.');
    const amount = Math.round((pct ? sub * v / 100 : v) * 100) / 100;
    if (amount > totals().total) return fail('El descuento supera el total de la venta.');
    S.rows.push({ t: 'd', id: nextId(), of: null, amount, name: `Desc Total ${pct ? '%' + v.toFixed(1) : '$' + v.toFixed(2)}` });
    S.sel = S.rows.length - 1;
    addLog(`Descuento total de ${money(amount)} · Total ${money(totals().total)}`); mission('total-discount'); done();
  },
  devprecio(d) {
    const v = num('#fPrecioDev');
    if (!(v > 0)) return fail('Escribí el precio.');
    S.rows.push({ t: 'i', id: nextId(), code: d.p[0], name: d.p[1], qty: -1, price: v });
    S.sel = S.rows.length - 1; S.returning = false;
    addLog(`Devolución de ${d.p[1]}: el renglón queda en negativo · Total ${money(totals().total)}`); mission('return-item'); done();
  },
  resumir() {
    const s = S.suspended, today = new Date().toDateString();
    if (!s || s.day !== today || val('#rSuc') !== 'Sucursal 1') {
      openDlg({ k: 'info', title: 'Resumir Transaccion', msg: 'No hay ventas en espera para esa sucursal y fecha.' });
      return;
    }
    Object.assign(S, { rows: s.rows, sel: 0, client: s.client, fact: s.fact, comprobante: s.comprobante, suspended: null });
    addLog('Venta retomada desde la espera.'); mission('resume'); done();
  },
  descuento() {
    const r = selItem(), v = num('#fVal'), pct = val('#fTipo').includes('Porcentual'), line = r.qty * r.price;
    if (!(v > 0)) return fail('Escribí un valor mayor que cero.');
    const amount = Math.round((pct ? line * v / 100 : v) * 100) / 100;
    if (amount > line) return fail('El descuento supera el importe del artículo.');
    const at = S.rows.indexOf(r) + 1;
    S.rows.splice(at, 0, { t: 'd', id: nextId(), of: r.id, amount, name: `Desc ${pct ? '%' + v.toFixed(1) : '$' + v.toFixed(2)} Art. ${r.name}` });
    S.sel = at; addLog(`Descuento de ${money(amount)} · Total ${money(totals().total)}`); mission('discount'); done();
  },
  precio() {
    const r = selItem(), m = num('#fMonto'), p = num('#fPct');
    if (m > 0) r.price = m;
    else if (p > 0) r.price = Math.round(r.price * (val('#fAjuste') === 'Recargo' ? 1 + p / 100 : 1 - p / 100) * 100) / 100;
    else return fail('Escribí un monto o un porcentaje.');
    addLog(`Nuevo precio de ${r.name}: ${money(r.price)} · Total ${money(totals().total)}`); mission('price'); done();
  },
  comprobante() {
    S.comprobante = val('#fTipoFac');
    addLog(`Comprobante: ${S.comprobante}. El título cambió a VENTA AFIP y la factura la emite el sistema al cobrar.`); mission('comprobante'); done();
  },
  factcli() {
    const nro = val('#fNroDoc');
    if (!/^\d{7,11}$/.test(nro)) return fail('Escribí un número de documento válido.');
    S.fact = { doc: nro, name: `${val('#fTipoDoc')} ${nro}`, iva: val('#fIva') };
    addLog('Cliente de facturación cargado.'); done();
  },
  alta() {
    const nro = val('#aNro'), nombre = val('#aNombre');
    if (!/^\d{7,11}$/.test(nro)) return fail('Completá el número de documento.');
    if (!nombre) return fail('Completá el nombre o la razón social.');
    customers.unshift({ doc: nro, name: [nombre, val('#aApellido')].filter(Boolean).join(' '), iva: val('#aIva'), balance: 0 });
    addLog('Cliente guardado. Buscalo con el primer ícono del panel Cliente.'); mission('alta-client'); done();
  },
  pagoMonto(d) {
    const v = num('#fImporte');
    if (!(v > 0)) return fail('Escribí un importe mayor que cero.');
    S.pays.push({ medio: d.medio, monto: v });
    addLog(`${d.medio}: ${money(v)} · Saldo ${money(Math.max(0, totals().total - paid()))}`);
    if (d.medio === 'Efectivo') mission('pay-efectivo');
    if (new Set(S.pays.map(x => x.medio)).size >= 2) mission('pay-two');
    done();
  },
  confirm(d) {
    if (d.run === 'quitar') {
      const x = S.rows.splice(S.sel, 1)[0];
      S.sel = Math.max(0, Math.min(S.sel, S.rows.length - 1));
      addLog(`${x.t === 'd' ? 'Se quitó el descuento' : `Se quitó ${x.name}`} · Total ${money(totals().total)}`);
      mission(x.t === 'd' ? 'remove-discount' : 'remove-item');
    } else if (d.run === 'cancelar') { clearSale(); addLog('Venta cancelada: carrito, cliente y factura vacíos.'); mission('cancel-sale'); }
    else if (d.run === 'limpiar') { S.pays = []; addLog('Se limpiaron los pagos.'); mission('clean-pays'); }
    else if (d.run === 'imprimir') return finishSale(true);
    else if (d.run === 'arqueo') { mission('arqueo-open'); openDlg({ k: 'info', title: 'Arqueo Caja', msg: 'El arqueo de cajero tiene su propio video. En la práctica la Caja vuelve a la venta.' }); return; }
    else if (d.run === 'nc') { addLog('En la Caja real empieza la nota de crédito. Esta práctica no la emite.'); }
    done();
  },
  aviso() {
    const x = S.rows[S.sel], di = S.rows.findIndex(z => z.t === 'd' && z.of === x.id);
    if (di >= 0) S.sel = di;
    addLog('Seleccionado el renglón del descuento. Ahora sí podés quitarlo.'); done();
  },
  productos(d) {
    const p = d.list[d.idx]; if (!p) return;
    S.lastQuery = d.q || '';
    closeDlg();
    if (S.returning) { openDlg({ k: 'devprecio', p }); return; }
    addItem(p); mission('item-search'); refresh();
  },
  clientes(d) {
    const c = d.list[d.idx]; if (!c) return;
    S.client = c;
    if (d.purpose === 'ctacte') { S.ctacte = true; addLog(`Cobro de cuenta corriente de ${c.name}. Balance ${money(c.balance)}.`); mission('ctacte'); }
    else { addLog(`Cliente asignado: ${c.name}.`); mission('client-set'); }
    done();
  },
  menu(d) {
    const o = d.list[d.idx]; if (!o) return;
    closeDlg();
    if (!openFunction(o.replace(/\s*\(.*$/, '').trim())) { addLog(`En la Caja real, "${o}" abre esa función. Esta práctica no la simula.`); refresh(); }
  }
};

/** Cerrar (✕, Cancelar o Escape). Imprimir: Cancelar cierra la venta sin imprimir. */
function closeCurrent() {
  const d = S.dlg;
  if (d && d.k === 'confirm' && d.run === 'imprimir') { finishSale(false); return; }
  if (d && d.k === 'confirm' && d.run === 'arqueo') mission('arqueo-open');
  if (d && d.k === 'monto') { openDlg({ k: 'info', msg: d.kind === 'in' ? 'No se realizo Fondo Fijo de Caja. Debe ingresar los datos solicitados para poder realizarlo.' : 'No se realizó el retiro de dinero.' }); return; }
  if (d && d.k === 'gasto') { openDlg({ k: 'info', msg: 'No se realizó la declaración de gasto.' }); return; }
  if (d && d.k === 'devprecio') S.returning = false;
  closeDlg(); refresh();
}

/** Abre una función del menú por su nombre (sin el atajo). Devuelve false si la práctica no la simula. */
export function openFunction(name) {
  const st = keyState();
  const F = {
    'Agregar cliente': () => openDlg({ k: 'alta' }),
    'Arqueo Caja': () => openDlg({ k: 'confirm', title: 'Arqueo Caja', msg: 'Desea realizar Arqueo de Cajero?', run: 'arqueo' }),
    'Cobro Cta Cte': () => st === 'libre' ? openDlg({ k: 'clientes', q: '', idx: 0, purpose: 'ctacte' }) : false,
    'Factura Electronica': () => openDlg({ k: 'comprobante' }),
    'Cliente Facturacion': () => openDlg({ k: 'factcli' }),
    'Gastos': () => openDlg({ k: 'gasto' }),
    'Ingreso Dinero': () => openDlg({ k: 'monto', kind: 'in' }),
    'Retiro Dinero': () => openDlg({ k: 'monto', kind: 'out' }),
    'Nota Credito Libre': () => { if (st !== 'libre') return false; mission('nc-open'); openDlg({ k: 'confirm', title: 'Nota Credito Libre', msg: '¿Está seguro que desea crear una Nota de Crédito?', run: 'nc' }); },
    'Resumir Venta': () => st === 'libre' ? openDlg({ k: 'resumir' }) : false,
    'Descuento Total': () => st === 'venta' ? openDlg({ k: 'dtotal' }) : false,
    'Devolucion Articulo': () => { if (st !== 'venta' && st !== 'libre') return false; S.returning = true; addLog('La Caja espera el artículo a devolver: escaneá su código o buscalo con Productos.'); refresh(); },
    'Suspender Venta': () => {
      if (st !== 'venta') return false;
      S.suspended = { rows: S.rows, client: S.client, fact: S.fact, comprobante: S.comprobante, day: new Date().toDateString() };
      clearSale(); addLog('Venta suspendida. Retomala con Resumir Venta (J) cuando la Caja esté sin venta.'); mission('suspend'); refresh();
    }
  };
  const fn = F[name];
  if (!fn) return false;
  return fn() !== false;
}

export function dlgAction(a, el) {
  const d = S.dlg;
  if (!d) return;
  if (a === 'close') { closeCurrent(); return; }
  if (a === 'pick') { d.idx = +el.dataset.i; refreshList(); return; }
  if (a === 'ok' || a === 'confirm-ok' || a === 'aviso-go') { const h = HANDLERS[d.k]; if (h) h(d); }
}

/* ---------- Pantalla de cobro ---------- */
export function tenderAction(a, el) {
  if (S.dlg) return;
  const t = totals().total, p = paid();
  if (a === 'medio') { openDlg({ k: 'pagoMonto', medio: MEDIO_NAMES[+el.dataset.m], def: Math.max(0, t - p) }); return; }
  if (a === 'mas-opciones') { addLog('Más opciones abre otros medios de pago configurados. Esta práctica no los simula.'); refresh(); return; }
  if (a === 'limpiar') { if (S.pays.length) openDlg({ k: 'confirm', title: 'Limpiar', msg: '¿Desea borrar todos los pagos de la lista?', run: 'limpiar' }); return; }
  if (a === 'volver') { S.pays = []; S.screen = 'venta'; addLog('Volviste a la venta sin cobrar.'); refresh(); return; }
  if (a === 'cancelar-venta') { openDlg({ k: 'confirm', title: 'Cancelar', msg: '¿Desea cancelar la transacción?', run: 'cancelar' }); return; }
  if (a === 'pd-pagar') {
    if (p < t) { addLog(`Todavía falta cobrar ${money(t - p)}.`); refresh(); return; }
    openDlg({ k: 'confirm', title: 'Imprimir', msg: '¿Desea imprimir el comprobante?', run: 'imprimir' });
  }
}

export function initDialogs() {
  dlgEl.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (el) dlgAction(el.dataset.act, el);
  });
  dlgEl.addEventListener('dblclick', e => {
    const el = e.target.closest('.lrow');
    if (el && S.dlg) { S.dlg.idx = +el.dataset.i; dlgAction('ok', el); }
  });
  dlgEl.addEventListener('input', e => {
    if (e.target.id === 'lq' && S.dlg) { S.dlg.q = e.target.value; S.dlg.idx = 0; refreshList(); }
  });
  dlgEl.addEventListener('keydown', e => {
    const d = S.dlg;
    if (!d) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeCurrent(); return; }
    if (d.list && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      d.idx = Math.max(0, Math.min(d.list.length - 1, d.idx + (e.key === 'ArrowDown' ? 1 : -1)));
      refreshList();
      return;
    }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); dlgAction('ok'); }
    e.stopPropagation();
  });
}
