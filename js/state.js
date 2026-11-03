// Estado de la Caja de práctica y del mapa.

import { store } from './utils.js';
import { sampleSale } from './data/content.js';

export const S = {
  mode: 'explore',          // 'explore' | 'practice'
  pinned: 'pagar',          // punto fijado en el inspector
  preview: null,            // punto bajo el cursor
  dots: store.get('dots', true),
  seen: new Set(store.get('seen', [])),
  rows: sampleSale(),       // renglones: { t: 'i', ... } artículo, { t: 'd', of, amount } descuento
  sel: 1,
  client: null,
  fact: null,
  dlg: null,                // ventana abierta dentro de la réplica
  pays: [],                 // pagos cargados en Pago detallado
  log: []                   // últimas acciones de práctica
};

let uid = 10;
export const nextId = () => ++uid;

export function totals() {
  let sub = 0, dsc = 0;
  S.rows.forEach(r => { if (r.t === 'i') sub += r.qty * r.price; else dsc += r.amount; });
  return { sub, dsc, total: sub - dsc };
}
export const paid = () => S.pays.reduce((a, p) => a + p.monto, 0);

export function selItem() {
  const r = S.rows[S.sel];
  return r && r.t === 'i' ? r : null;
}
export const hasDiscount = item => S.rows.some(x => x.t === 'd' && x.of === item.id);

export function addLog(msg) {
  S.log.unshift(msg);
  S.log = S.log.slice(0, 5);
}

export function markSeen(id) {
  if (S.seen.has(id)) return;
  S.seen.add(id);
  store.set('seen', [...S.seen]);
}

export function clearSale() {
  S.rows = []; S.sel = 0; S.client = null; S.fact = null; S.pays = [];
}
export function resetSale() {
  clearSale();
  S.rows = sampleSale(); S.sel = 1;
}
