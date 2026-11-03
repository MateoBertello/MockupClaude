// Qué hace cada botón de la réplica en el modo Practicar.

import { money, fmtQty, $ } from '../utils.js';
import { S, totals, addLog, selItem, hasDiscount, nextId } from '../state.js';
import { openDlg } from './dialogs.js';
import { renderBase } from './replica.js';
import { renderInfo } from './inspector.js';

export function refresh() { renderBase(); renderInfo(); }

export function addItem([code, name, price]) {
  S.rows.push({ t: 'i', id: nextId(), code, name, qty: 1, price });
  S.sel = S.rows.length - 1;
  addLog(`Entró ${name} · Total ${money(totals().total)}`);
}

const logQty = r => addLog(`${r.name}: cantidad ${fmtQty(r.qty)} · Total ${money(totals().total)}`);

const ACTIONS = {
  mas(r) { r.qty += 1; logQty(r); },
  menos(r) {
    if (r.qty <= 1) return addLog('La cantidad mínima es 1. Para quitar el artículo use el tacho.');
    r.qty -= 1; logQty(r);
  },
  cantidad() { openDlg({ k: 'cantidad', v: '' }); },
  lapiz() { openDlg({ k: 'precio' }); },
  etiqueta(r) {
    if (hasDiscount(r)) return addLog(`${r.name} ya tiene un descuento.`);
    openDlg({ k: 'descuento' });
  },
  tacho() {
    const x = S.rows[S.sel];
    if (x.t === 'i' && hasDiscount(x)) {
      return openDlg({ k: 'aviso', msg: 'Este artículo tiene un descuento. Quite primero el renglón del descuento y después el artículo, así la venta no queda con saldo negativo.' });
    }
    openDlg({ k: 'confirm', msg: `¿Quitar el renglón ${x.name}?`, run: 'quitar' });
  },
  arriba() { if (S.sel > 0) S.sel -= 1; },
  abajo() { if (S.sel < S.rows.length - 1) S.sel += 1; },
  productos() { openDlg({ k: 'productos', q: '', idx: 0 }); },
  cancelar() {
    if (!S.rows.length) return addLog('No hay venta en curso.');
    openDlg({ k: 'confirm', msg: '¿Desea cancelar la venta?', run: 'cancelar' });
  },
  pagar() {
    if (!S.rows.length || totals().total <= 0) return addLog('Cargue al menos un artículo antes de cobrar.');
    S.pays = [];
    openDlg({ k: 'pago' });
    addLog('Se abrió Pago detallado.');
  },
  cliente() {
    S.client = S.client ? null : 'Cliente de ejemplo · Cta Cte';
    addLog(S.client ? 'Cliente asignado a la venta.' : 'Se quitó el cliente.');
  },
  factura() {
    if (!S.client) return addLog('Asigne primero un Cliente o cargue los datos de facturación.');
    S.fact = 'Copiado del Cliente con »';
    addLog('Datos de facturación copiados del Cliente.');
  }
};

/* Botones que trabajan sobre un artículo seleccionado (no sobre un renglón de descuento). */
const NEEDS_ITEM = new Set(['mas', 'menos', 'cantidad', 'lapiz', 'etiqueta']);

export function act(id) {
  if (id === 'codigo') { const c = $('#rpCode'); if (c) c.focus(); return; }
  const fn = ACTIONS[id];
  if (!fn) return;
  const r = selItem();
  if (NEEDS_ITEM.has(id) && !r) addLog('Primero seleccione el renglón de un artículo.');
  else if (id === 'tacho' && !S.rows[S.sel]) addLog('No hay renglones para quitar.');
  else fn(r);
  refresh();
}
