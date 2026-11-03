// Réplica de la pantalla de venta: dibuja el lienzo y recibe los toques del usuario.

import { $, $$, esc, money, fmtQty, box, at, canHover } from '../utils.js';
import { I, OWL, BARCODE } from '../icons.js';
import { SPOTS, SPOT_IDS } from '../data/spots.js';
import { CATALOG } from '../data/content.js';
import { S, totals, addLog } from '../state.js';
import { act, addItem } from './actions.js';
import { pin, renderInfo } from './inspector.js';
import { openCheat } from '../cheatsheet.js';

const pos = $('#pos');
const base = $('#rp-base');
const dotsEl = $('#rp-dots');

function spot(id, style, cls, inner = '') {
  return `<div class="sp ${cls || ''}${S.pinned === id ? ' is-pin' : ''}" data-spot="${id}" role="button" tabindex="0" aria-label="${esc(SPOTS[id].label)}" style="${style}">${inner}</div>`;
}

function cartRows() {
  const r = S.rows;
  let h = '<div class="rp-row rp-head"><span>Cant.</span><span>Codigo</span><span>Descripcion</span><span>P. Unitario</span><span>P. Total</span><span></span></div>';
  for (let i = 0; i < 9; i++) {
    const x = r[i];
    if (!x) { h += `<div class="rp-row${i === 0 && !r.length ? ' sel' : ''}">${'<span></span>'.repeat(6)}</div>`; continue; }
    const d = x.t === 'd';
    const unit = d ? -x.amount : x.price;
    const total = d ? -x.amount : x.qty * x.price;
    h += `<div class="rp-row data${i === S.sel ? ' sel' : ''}" data-row="${i}"><span class="num">${d ? '1' : fmtQty(x.qty)}</span><span>${esc(d ? 'Manual' : x.code)}</span><span${d ? ' class="dsc"' : ''}>${esc(x.name)}</span><span class="num">${unit.toFixed(1)}</span><span class="num">${total.toFixed(2)}</span><span></span></div>`;
  }
  return h;
}

export function renderBase() {
  const r = S.rows, t = totals(), cur = r[S.sel];
  const keepFocus = document.activeElement && document.activeElement.id === 'rpCode';
  let h = '';

  // Barra superior
  h += spot('menu', box(12, 12, 34, 26), 'rp-tb', I.burger);
  h += `<div class="abs" style="${at(58, 15)};font-size:1.5cqw">cajero1</div>`;
  h += spot('titulo', box(250, 6, 520, 46), 'rp-title', r.length ? '<b>VENTA FAC. ELECTRONICA MANUAL</b><small>ESTE COMPROBANTE NO ESTA APROBADO POR AFIP</small>' : '');
  h += `<div class="abs" style="${box(955, 10, 26, 30)}">${I.wifi}</div>`;

  // Barra izquierda (botones del renglón)
  h += `<div class="abs rp-toolbar" style="${box(10, 83, 48, 378)}"></div>`;
  [['mas', I.plus], ['menos', I.minus], ['cantidad', I.qty], ['lapiz', I.pencil], ['tacho', I.trash], ['etiqueta', I.tag], ['arriba', I.up], ['abajo', I.down]]
    .forEach(([id, ic], i) => { h += spot(id, box(10, 83 + i * 42, 48, 42), 'rp-tb', ic); });
  h += `<div class="abs rp-tb last" style="${box(10, 419, 48, 42)};opacity:.55" title="Sin documentar">${I.chart}</div>`;

  // Panel central
  h += `<div class="abs rp-main" style="${box(59, 63, 704, 420)}"></div>`;
  const art = cur ? (cur.t === 'i' ? `${fmtQty(cur.qty)} x ${esc(cur.name)}` : esc(cur.name)) : '';
  const artP = cur ? money(cur.t === 'i' ? cur.price : -cur.amount) : '';
  h += spot('articulo', box(69, 74, 684, 49), '',
    `<div class="abs" style="left:0;top:0;width:6.3%;height:100%;display:flex;align-items:center;justify-content:center">${I.cart.replace('<svg', '<svg style="width:85%;height:85%"')}</div>` +
    `<div class="abs field" style="left:8.6%;top:0;width:68.6%;height:100%">${art}</div>` +
    `<div class="abs field" style="left:78.1%;top:0;width:21.9%;height:100%;justify-content:flex-end">${artP}</div>`);
  h += spot('carrito', box(69, 134, 683, 286), 'rp-table', cartRows());
  const codeField = S.mode === 'practice'
    ? '<input id="rpCode" aria-label="Código del artículo" inputmode="numeric" placeholder="Escriba un código y Enter">'
    : '';
  h += spot('codigo', box(69, 423, 685, 49), '',
    `<div class="abs" style="left:0;top:0;width:11.7%;height:100%">${BARCODE}</div>` +
    `<div class="abs field" style="left:12.7%;top:0;width:78.7%;height:100%;font-weight:400">${codeField}</div>` +
    `<div class="abs field rp-qty1" style="left:92.9%;top:0;width:7.1%;height:100%">1</div>`);

  // Columna derecha
  h += spot('totales', box(774, 63, 215, 276), '',
    `<div class="abs box" style="left:0;top:0;width:100%;height:31.9%">${r.length ? money(t.sub) : ''}</div>` +
    `<div class="abs box" style="left:0;top:35.5%;width:100%;height:31.9%">${r.length ? money(-t.dsc) : ''}</div>` +
    `<div class="abs box strong" style="left:0;top:73.2%;width:100%;height:26.8%">${r.length ? money(t.total) : ''}</div>`);
  h += spot('productos', box(774, 415, 215, 49), 'abtn b-blue', `${I.search}<span>Productos</span><small>(B)</small>`);
  h += spot('cancelar', box(774, 473, 215, 49), 'abtn b-red', `${I.cancel}<span><span class="u">C</span>ancelar</span>`);
  h += spot('pagar', box(774, 532, 215, 49), 'abtn b-green', `${I.check}<span><span class="u">P</span>agar</span>`);

  // Franja inferior
  h += `<div class="abs rp-items" style="${at(66, 486)}">Cant. Items: ${r.filter(x => x.t === 'i').length || ''}</div>`;
  h += `<div class="abs" style="${box(8, 500, 92, 86)}">${OWL.replace('<svg', '<svg style="width:100%;height:100%"')}</div>`;
  h += `<div class="abs rp-brand" style="${at(100, 537)}">BuhoManager.com</div>`;
  h += spot('cliente', box(325, 493, 214, 86), 'panel', `<b>Cliente</b><span class="ic">${I.person}${I.chev2}</span><span class="val">${esc(S.client || '')}</span>`);
  h += spot('factura', box(550, 493, 214, 86), 'panel', `<b>Factura</b><span class="ic">${I.doc}${I.person}</span><span class="val">${esc(S.fact || '')}</span>`);
  h += `<div class="abs rp-clock" id="rpClock" style="${at(10, 584)}"></div>`;

  base.innerHTML = h;
  tick();
  renderDots();
  if (keepFocus) { const c = $('#rpCode'); if (c) c.focus(); }
}

export function renderDots() {
  pos.classList.toggle('nodots', !S.dots);
  dotsEl.innerHTML = SPOT_IDS.map(id => {
    const [x, y, w] = SPOTS[id].box;
    return `<span class="dot${S.seen.has(id) ? ' seen' : ''}" style="${at(Math.min(x + w - 4, 994), y + 5)}"></span>`;
  }).join('');
  const n = S.seen.size, tot = SPOT_IDS.length;
  $('#progTxt').textContent = `${n} de ${tot}`;
  $('#progBar').style.width = (n / tot * 100) + '%';
}

/** Marca un punto como fijado sin volver a dibujar todo el lienzo. */
export function markPinned(id) {
  $$('.sp', base).forEach(el => el.classList.toggle('is-pin', el.dataset.spot === id));
}
export const spotEl = id => $(`.sp[data-spot="${id}"]`, base);

function tick() {
  const c = $('#rpClock');
  if (!c) return;
  const d = new Date(), p = n => String(n).padStart(2, '0');
  c.textContent = `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function onCodeEnter(input) {
  const v = input.value.trim(), p = CATALOG.find(c => c[0] === v);
  if (p) addItem(p);
  else if (v) addLog(`No se encontró el código ${v}. Pruebe con 8902, 1 o 206.`);
  pin('codigo', { video: false });
  renderBase(); renderInfo();
}

export function initReplica() {
  setInterval(tick, 1000);

  base.addEventListener('click', e => {
    if (e.target.id === 'rpCode') return;
    const row = e.target.closest('[data-row]');
    if (row && S.mode === 'practice') { S.sel = +row.dataset.row; pin('carrito', { video: false }); renderBase(); return; }
    const el = e.target.closest('[data-spot]');
    if (!el) return;
    const id = el.dataset.spot;
    if (id === 'menu') { pin(id); openCheat(); return; }
    if (S.mode === 'practice') { pin(id, { video: S.pinned !== id }); act(id); return; }
    pin(id, { play: true });
    if (window.innerWidth < 1080) $('#insp').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  base.addEventListener('keydown', e => {
    if (e.target.id === 'rpCode') { if (e.key === 'Enter') { e.preventDefault(); onCodeEnter(e.target); } return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.spot) { e.preventDefault(); e.target.click(); }
  });

  // Vista previa al pasar el cursor (solo en equipos con mouse)
  if (canHover) {
    base.addEventListener('mouseover', e => {
      const el = e.target.closest('[data-spot]');
      if (!el) return;
      const id = el.dataset.spot;
      const next = id === S.pinned ? null : id;
      if (S.preview !== next) { S.preview = next; renderInfo(); }
    });
    pos.addEventListener('mouseleave', () => { if (S.preview) { S.preview = null; renderInfo(); } });
  }
}
