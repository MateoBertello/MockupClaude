// Qué hace cada botón de la réplica en el modo Practicar, y qué hacen las teclas reales del keymap.

import { $, money, fmtQty } from '../utils.js';
import { CATALOG } from '../data/content.js';
import { S, totals, addLog, selItem, hasDiscount, nextId, keyState } from '../state.js';
import { shortcutsFor } from '../keys.js';
import { openDlg, tenderAction, openFunction } from './dialogs.js';
import { track } from '../progress.js';
import { renderStepCard } from './route.js';
import { renderBase } from './replica.js';
import { renderInfo, pin } from './inspector.js';

export function refresh() { renderBase(); renderInfo(); }

/** Registra un evento de práctica; si cumple misiones nuevas, las anota para el panel de la ruta. */
export function mission(ev) {
  const fresh = track(ev);
  if (!fresh.length) return;
  const here = fresh.find(f => f.id === S.step) || fresh[0];
  S.lastMission = { ev, text: here.text, at: Date.now() };
  renderStepCard();
}

export function addItem([code, name, price]) {
  S.rows.push({ t: 'i', id: nextId(), code, name, qty: 1, price });
  S.sel = S.rows.length - 1;
  addLog(`Entró ${name} · Total ${money(totals().total)}`);
}

/** Enter en el campo de código. */
export function codeEntered(v) {
  const p = CATALOG.find(c => c[0] === v);
  if (p && S.returning) { openDlg({ k: 'devprecio', p }); return; }
  if (p) { addItem(p); mission('code-add'); } else if (v) addLog(`No se encontró el código ${v}. Probá con 8902, 1 o 206.`);
  pin('codigo', { video: false });
  refresh();
}

const logQty = r => addLog(`${r.name}: cantidad ${fmtQty(r.qty)} · Total ${money(totals().total)}`);

const ACTIONS = {
  mas(r) { r.qty += 1; logQty(r); mission('qty-plus'); },
  menos(r) {
    if (r.qty <= 1) return addLog('La cantidad mínima es 1. Para quitar el artículo usá el tacho.');
    r.qty -= 1; logQty(r);
  },
  cantidad() { openDlg({ k: 'cantidad' }); },
  lapiz() { openDlg({ k: 'precio' }); },
  etiqueta(r) {
    if (hasDiscount(r)) return addLog(`${r.name} ya tiene un descuento.`);
    openDlg({ k: 'descuento' });
  },
  tacho() {
    const x = S.rows[S.sel];
    if (x.t === 'i' && hasDiscount(x)) {
      return openDlg({ k: 'aviso', msg: 'Este artículo tiene un descuento. Quitá primero el renglón del descuento y después el artículo, así la venta no queda con saldo negativo.' });
    }
    openDlg({ k: 'confirm', title: 'Quitar renglón', msg: `¿Desea quitar ${x.name}?`, run: 'quitar' });
  },
  arriba() { if (S.sel > 0) { S.sel -= 1; mission('move'); } },
  abajo() { if (S.sel < S.rows.length - 1) { S.sel += 1; mission('move'); } },
  stock(r) { openDlg({ k: 'info', title: 'Detalle de stock', msg: `${r.name}: 24 unidades en este local (dato de ejemplo).` }); },
  productos(_, keep) { openDlg({ k: 'productos', q: keep ? S.lastQuery : '', idx: 0 }); },
  cancelar() {
    if (!S.rows.length) return addLog('No hay venta en curso.');
    openDlg({ k: 'confirm', title: 'Cancelar', msg: '¿Desea cancelar la transacción?', run: 'cancelar' });
  },
  pagar() {
    if (S.ctacte && !S.rows.length) return addLog('En la Caja real el cobro de cuenta corriente sigue en Pago detallado. Esta práctica llega hasta acá: Cancelar vuelve a la venta.');
    if (!S.rows.length || totals().total <= 0) return addLog('Cargá al menos un artículo antes de cobrar.');
    S.pays = []; S.screen = 'cobro';
    addLog('Se abrió Pago detallado. Elegí un medio de pago o usá las teclas 1 a 6.');
    mission('tender-open');
  },
  clienteBuscar() { openDlg({ k: 'clientes', q: '', idx: 0 }); },
  cliente() { openDlg({ k: 'clientes', q: '', idx: 0 }); },
  copiar() {
    if (!S.client) return addLog('Primero asigná un cliente en el panel Cliente.');
    S.fact = { doc: S.client.doc, name: S.client.name, iva: S.client.iva };
    addLog('El cliente de la venta pasó al panel Factura.');
    mission('client-copy');
  },
  comprobante() { openDlg({ k: 'comprobante' }); },
  factura() { openDlg({ k: 'comprobante' }); },
  clienteFact() { openDlg({ k: 'factcli' }); },
  menu() { openDlg({ k: 'menu', q: '', idx: 0 }); mission('menu-open'); }
};

/* Botones que trabajan sobre un artículo seleccionado (no sobre un renglón de descuento). */
const NEEDS_ITEM = new Set(['mas', 'menos', 'cantidad', 'lapiz', 'etiqueta', 'stock']);
/* En la pantalla de cobro solo responden los paneles de abajo. */
const IN_TENDER = new Set(['cliente', 'clienteBuscar', 'comprobante', 'factura', 'clienteFact']);

export function act(id, opts = {}) {
  if (id === 'codigo') { const c = $('#rpCode'); if (c) c.focus(); return; }
  const fn = ACTIONS[id];
  if (!fn) return;
  if (S.screen === 'cobro' && !IN_TENDER.has(id)) { addLog('Estás en Pago detallado. Volvé a la venta con Volver o Esc.'); refresh(); return; }
  const r = selItem();
  if (NEEDS_ITEM.has(id) && !r) addLog('Primero seleccioná el renglón de un artículo.');
  else if (id === 'tacho' && !S.rows[S.sel]) addLog('No hay renglones para quitar.');
  else fn(r, opts.keep);
  refresh();
}

/* Teclas del keymap que la práctica simula, por pantalla. */
const KEY_ACTIONS = {
  venta: {
    B: ['productos'], V: ['productos', { keep: true }], 'Num +': ['mas'], 'Num −': ['menos'], 'CTRL+Q': ['cantidad'],
    S: ['lapiz'], H: ['etiqueta'], Supr: ['tacho'], 'CTRL+Num −': ['arriba'], 'CTRL+Num +': ['abajo'], 'CTRL+S': ['stock'],
    P: ['pagar'], Espacio: ['pagar'], 'Num .': ['pagar'], C: ['cancelar'], X: ['clienteBuscar'], E: ['copiar'],
    Z: ['comprobante'], O: ['clienteFact'], 'CTRL+M': ['menu']
  },
  libre: { B: ['productos'], V: ['productos', { keep: true }], X: ['clienteBuscar'], 'CTRL+M': ['menu'], C: ['cancelar'] },
  cobro: { Z: ['comprobante'], O: ['clienteFact'], D: ['clienteBuscar'] }
};
const TENDER_KEYS = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
/* Teclas que abren funciones del menú, por pantalla. */
const FUNC_KEYS = {
  venta: { F: 'Ingreso Dinero', R: 'Retiro Dinero', A: 'Arqueo Caja', 'CTRL+G': 'Gastos', D: 'Descuento Total', 'CTRL+D': 'Devolucion Articulo', J: 'Suspender Venta' },
  libre: { F: 'Ingreso Dinero', R: 'Retiro Dinero', A: 'Arqueo Caja', 'CTRL+G': 'Gastos', 'CTRL+A': 'Agregar cliente', 'CTRL+C': 'Cobro Cta Cte', N: 'Nota Credito Libre', J: 'Resumir Venta', Z: 'Factura Electronica' },
  cobro: {}
};

/**
 * Responde a una tecla con la Caja de práctica. Devuelve true si la usó.
 * En Explorar, marca el botón que responde a esa tecla.
 */
export function practiceKey(combo) {
  const state = keyState();
  const hits = shortcutsFor(state, combo);
  if (S.mode === 'explore') {
    const withSpot = hits.find(h => h.spot);
    if (withSpot) { pin(withSpot.spot); return { spot: withSpot.spot }; }
    return false;
  }
  if (state === 'cobro') {
    if (combo in TENDER_KEYS) { tenderAction('medio', { dataset: { m: String(TENDER_KEYS[combo]) } }); return { handled: true }; }
    if (['P', 'Espacio', 'F1', 'Num .'].includes(combo)) { tenderAction('pd-pagar'); return { handled: true }; }
    if (['Esc', 'V', 'Num *'].includes(combo)) { tenderAction('volver'); return { handled: true }; }
    if (combo === 'L') { tenderAction('limpiar'); return { handled: true }; }
    if (combo === 'F') { tenderAction('cancelar-venta'); return { handled: true }; }
  }
  const fnName = FUNC_KEYS[state][combo];
  if (fnName && openFunction(fnName)) { pin('menu', { video: false }); renderInfo(); return { handled: true, spot: 'menu' }; }
  const mapped = KEY_ACTIONS[state][combo];
  if (mapped) {
    const [id, opts] = mapped;
    pin(id, { video: false });
    act(id, opts);
    return { handled: true, spot: id };
  }
  if (hits.length) {
    addLog(`En la Caja, ${combo} hace: ${hits[0].label}. Esta práctica no lo simula.`);
    renderInfo();
    return { handled: true };
  }
  return false;
}
