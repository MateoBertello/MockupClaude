// Réplica de la Caja con su piel real (assets/caja, tomada de light_small).
// Las coordenadas salen de designx/salexDesign.xml (venta) y tenderxDesign.xml (cobro): pantalla de 1040 x 655.

import { $, $$, esc, money, fmtQty, box, at, fs, canHover } from '../utils.js';
import { I } from '../icons.js';
import { SPOTS, SPOT_IDS } from '../data/spots.js';
import { S, totals, paid, keyState } from '../state.js';
import { act, codeEntered, practiceKey } from './actions.js';
import { comboFromEvent } from '../keys.js';
import { tenderAction, MEDIO_NAMES } from './dialogs.js';
import { pin, renderInfo } from './inspector.js';
import { openCheat } from '../cheatsheet.js';

const pos = $('#pos');
const base = $('#rp-base');
const dotsEl = $('#rp-dots');
const A = p => `assets/caja/${p}`;

/* ---------- Piezas ---------- */
const img = (p, b) => `<img class="ri" src="${A(p)}" alt="" draggable="false" style="${box(...b)}">`;
function lbl(text, b, o = {}) {
  const style = [box(...b), fs(o.f || 14), o.bold ? 'font-weight:700' : '', o.color ? `color:${o.color}` : '', `justify-content:${o.align || 'flex-start'}`].filter(Boolean).join(';');
  return `<div class="rl${o.cls ? ' ' + o.cls : ''}" style="${style}">${text}</div>`;
}
const pinCls = id => (S.pinned === id ? ' is-pin' : '');
const spotAttrs = id => `data-spot="${id}" role="button" tabindex="0" aria-label="${esc(SPOTS[id].label)}"`;
/** Botón con su imagen normal y la presionada (se ve al hacer clic). */
const btn = (id, name, b) => `<div class="sp rb${pinCls(id)}" ${spotAttrs(id)} style="${box(...b)}"><img src="${A('btn/' + name + '.png')}" alt="" draggable="false"><img class="dn" src="${A('btn/' + name + (/^(btnMenu|Client|client-copy|FElectronica)/.test(name) ? '_press' : '_Press') + '.png')}" alt="" draggable="false"></div>`;
/** Botón de la pantalla de cobro (no es un punto del mapa: responde con data-act). */
const actBtn = (actName, name, b, extra = '') => `<div class="rb act" data-act="${actName}" ${extra} role="button" tabindex="0" style="${box(...b)}"><img src="${A('btn/' + name + '.png')}" alt="" draggable="false"><img class="dn" src="${A('btn/' + name + '_Press.png')}" alt="" draggable="false"></div>`;
/** Zona sensible transparente sobre una parte de la pantalla. */
const zone = (id, b, inner = '') => `<div class="sp zone${pinCls(id)}" ${spotAttrs(id)} style="${box(...b)}">${inner}</div>`;

const GRAY = '#8C8C8C';

function titleLines() {
  if (S.ctacte || (!S.rows.length && S.screen === 'venta')) return ['', ''];
  return S.comprobante
    ? [`VENTA AFIP / ${S.comprobante.replace('Factura ', 'FAC ')}`, 'Factura Electronica']
    : ['VENTA FAC. ELECTRONICA MANUAL', 'ESTE COMPROBANTE NO ESTA APROBADO POR AFIP'];
}

/* Paneles Cliente y Factura, comunes a la venta y al cobro. */
function panels() {
  let h = img('bg/ImgCustomer.png', [333, 504, 220, 90]) + img('bg/ImgCustomer.png', [563, 505, 220, 90]);
  h += lbl('Cliente', [344, 515, 140, 20], { f: 18, bold: true });
  h += lbl('Factura', [572, 515, 140, 20], { f: 18, bold: true });
  const c = S.client;
  if (c) {
    h += lbl(esc(c.name), [344, 534, 201, 16]);
    h += lbl(`${c.doc} [${esc(c.iva)}]`, [344, 551, 201, 16]);
    h += lbl(`Balance ${money(c.balance)}`, [344, 568, 201, 16]);
  }
  const f = S.fact;
  if (f) {
    h += lbl(esc(f.name), [572, 535, 201, 16]);
    h += lbl(`${f.doc} [${esc(f.iva)}]`, [572, 561, 201, 16]);
  } else if (S.comprobante) {
    h += lbl('CLIENTE FACTURACION', [572, 535, 201, 16]);
    h += lbl('NO ESPECIFICADO', [572, 561, 201, 16]);
  }
  h += zone('cliente', [333, 504, 220, 90]) + zone('factura', [563, 505, 220, 90]);
  h += btn('clienteBuscar', 'Client', [492, 511, 24, 24]) + btn('copiar', 'client-copy', [519, 511, 24, 24]);
  h += btn('comprobante', 'FElectronica', [722, 511, 24, 24]) + btn('clienteFact', 'Client', [749, 511, 24, 24]);
  return h;
}

function chrome() {
  let h = img('bg/back.png', [0, 0, 1040, 655]);
  h += btn('menu', 'Menu', [10, 6, 40, 40]);
  h += lbl('cajero1', [60, 15, 130, 20], { f: 16 });
  h += `<div class="ri" style="${box(984, 10, 34, 30)}">${I.wifi}</div>`;
  h += img('bg/Logo_Buho.png', [10, 505, 90, 90]);
  h += lbl('BuhoManager.com', [98, 550, 223, 30], { f: 24, bold: true, color: GRAY, align: 'flex-end' });
  h += lbl('', [10, 600, 220, 14], { f: 12, color: GRAY, cls: 'rclock' });
  return h;
}

/* ---------- Pantalla de venta ---------- */
function cartTable() {
  const r = S.rows, ROWS = 9;
  let rows = '';
  for (let i = 0; i < ROWS; i++) {
    const x = r[i];
    if (!x) { rows += `<div class="rrow${i === 0 && !r.length ? ' sel' : ''}">${'<span></span>'.repeat(5)}</div>`; continue; }
    const d = x.t === 'd';
    const unit = d ? money(-x.amount) : x.price.toFixed(2);
    const total = d ? money(-x.amount) : (x.qty * x.price).toFixed(2);
    rows += `<div class="rrow data${i === S.sel ? ' sel' : ''}" data-row="${i}"><span>${d ? '1' : fmtQty(x.qty)}</span><span>${esc(d ? 'Manual' : x.code)}</span><span class="${d ? 'dsc' : 'bold'}">${esc(x.name)}</span><span class="num">${unit}</span><span class="num">${total}</span></div>`;
  }
  return `<div class="sp rtbl${pinCls('carrito')}" ${spotAttrs('carrito')} style="${box(71, 170, 701, 261)}">
    <div class="rtbl-rows">${rows}</div><div class="rscroll"><i></i><b></b><i class="dn"></i></div></div>`;
}

function saleScreen() {
  const r = S.rows, t = totals(), cur = r[S.sel];
  const [title1, title2] = titleLines();
  let h = chrome();
  h += img('bg/ImgTabla.png', [60, 65, 723, 430]);
  h += img('bg/Menu_Lateral.png', [10, 85, 51, 389]);
  h += lbl(title1, [60, 14, 723, 20], { f: 16, bold: true, align: 'center' });
  h += lbl(title2, [60, 42, 723, 20], { f: 14, bold: true, align: 'center' });
  // Último artículo
  h += img('btn/Icon_Shoping.png', [71, 76, 50, 50]);
  h += img('bg/ImgItem.png', [131, 76, 481, 50]) + img('bg/ImgItemPrice.png', [622, 76, 150, 50]);
  const art = S.returning ? 'INGRESE ARTICULO PARA DEVOLUCION' : cur ? (cur.t === 'i' ? `${fmtQty(cur.qty)} x ${esc(cur.name)}` : esc(cur.name)) : '';
  h += lbl(art, [141, 76, 466, 50], { f: 20, bold: true, color: S.returning ? '#D11' : '' });
  if (S.ctacte) h += lbl('COBRO CUENTA CORRIENTE', [190, 15, 300, 20], { f: 16, bold: true });
  h += lbl(cur ? money(cur.t === 'i' ? cur.price : -cur.amount) : '', [627, 76, 140, 50], { f: 20, bold: true, align: 'center' });
  h += zone('articulo', [71, 76, 701, 50]);
  // Carrito
  h += img('bg/ImgTitulo.png', [71, 136, 701, 45]);
  [['Cant.', 41], ['Codigo', 125], ['P. Unitario', 563], ['P. Total', 648]].forEach(([tx, x]) => { h += lbl(tx, [x, 140, 110, 35], { f: 12, align: 'center' }); });
  h += lbl('Descripcion', [270, 140, 230, 35], { f: 12, align: 'center' });
  h += cartTable();
  // Código y cantidad
  h += img('bg/BarCode.png', [72, 434, 78, 50]) + img('bg/ImgEan.png', [160, 434, 552, 50]) + img('bg/ImgQuantity.png', [722, 434, 50, 50]);
  h += lbl('1', [722, 434, 50, 50], { f: 24, bold: true, align: 'center' });
  const code = S.mode === 'practice' ? `<input id="rpCode" aria-label="Código del artículo" inputmode="numeric" autocomplete="off" placeholder="Escribí un código y Enter" style="left:12.57%;top:0;width:78.86%;height:100%;${fs(24)}">` : '';
  h += zone('codigo', [72, 434, 700, 50], code);
  // Totales
  h += img('bg/ImgSubTotal.png', [793, 65, 220, 90]) + img('bg/ImgSubTotal.png', [793, 165, 220, 90]) + img('bg/ImgTotal.png', [793, 265, 220, 90]);
  if (r.length) {
    h += lbl(money(t.sub), [793, 65, 220, 90], { f: 32, bold: true, color: GRAY, align: 'center' });
    h += lbl(money(-t.dsc), [793, 165, 220, 90], { f: 32, bold: true, color: GRAY, align: 'center' });
    h += lbl(money(t.total), [793, 265, 220, 90], { f: 32, bold: true, color: '#111', align: 'center' });
  }
  h += zone('totales', [793, 65, 220, 290]);
  // Botones del renglón
  ['mas', 'menos', 'cantidad', 'lapiz', 'tacho', 'etiqueta', 'arriba', 'abajo', 'stock'].forEach((id, i) => { h += btn(id, `btnMenu${i + 1}`, [11, 87 + i * 43, 49, 41]); });
  // Acciones
  h += btn('productos', 'Boton_Productos', [793, 425, 220, 50]);
  h += btn('cancelar', 'Boton_Cancelar', [793, 485, 220, 50]);
  h += btn('pagar', 'Boton_Pagar', [793, 545, 220, 50]);
  // Pie
  h += lbl('Cant. Items:', [61, 494, 100, 20], { f: 14, bold: true, align: 'center' });
  h += lbl(String(r.filter(x => x.t === 'i').length), [150, 494, 40, 20], { f: 14, bold: true, align: 'center' });
  if (S.client) h += lbl('Lista #1', [200, 494, 80, 20], { f: 12 });
  if (S.suspended) h += lbl('1 venta en espera', [334, 595, 450, 18], { f: 13, color: GRAY });
  h += panels();
  return h;
}

/* ---------- Pantalla de cobro (Pago detallado) ---------- */
function tenderScreen() {
  const t = totals(), p = paid();
  const saldo = Math.max(0, t.total - p), vuelto = Math.max(0, p - t.total);
  const [title1] = titleLines();
  let h = chrome();
  h += lbl(title1, [300, 15, 520, 20], { f: 16, bold: true, align: 'center' });
  MEDIO_NAMES.forEach((m, i) => { h += actBtn('medio', `btn_Pago-${i + 1}`, [15, 81 + i * 60, 280, 50], `data-m="${i}" aria-label="${m} (${i + 1})"`); });
  h += actBtn('mas-opciones', 'btn_Pago-+', [15, 441, 280, 50], 'aria-label="Más opciones (M)"');
  h += img('bg/ImgContainerTender.png', [304, 76, 479, 419]);
  h += img('bg/ImgGridTitle.png', [314, 87, 459, 50]);
  h += lbl('Medio de Pago', [314, 87, 345, 50], { f: 16, bold: true, align: 'center' });
  h += lbl('Monto', [659, 87, 115, 50], { f: 16, bold: true, align: 'center' });
  let rows = '';
  for (let i = 0; i < 11; i++) {
    const x = S.pays[i];
    rows += `<div class="rrow pay${i === S.pays.length - 1 ? ' sel' : ''}"><span>${x ? esc(x.medio) : ''}</span><span class="num">${x ? money(x.monto) : ''}</span></div>`;
  }
  h += `<div class="rtbl rtbl-pay" style="${box(314, 147, 459, 338)}"><div class="rtbl-rows">${rows}</div></div>`;
  [['Total', t.total, 77, 35], ['Saldo', saldo, 164, 32], ['Descuento', t.dsc, 251, 32], ['Vuelto', vuelto, 338, 35]].forEach(([name, v, y, f]) => {
    h += img(name === 'Total' ? 'bg/ImgPagoTotal.png' : 'bg/ImgPagoSubTotal.png', [793, y, 220, 77]);
    h += lbl(name, [793, y + 3, 220, 20], { f: 20, bold: true, color: GRAY, align: 'center' });
    h += lbl(name === 'Descuento' && !v ? '' : v.toFixed(2), [793, y + 20, 220, 57], { f, bold: true, color: '#111', align: 'center' });
  });
  h += actBtn('limpiar', 'Boton_Limpiar', [793, 425, 220, 50], 'aria-label="Limpiar (L)"');
  h += actBtn('volver', 'Boton_Volver', [793, 485, 220, 50], 'aria-label="Volver (V o Esc)"');
  h += actBtn('pd-pagar', 'Boton_Pagar', [793, 545, 220, 50], `aria-label="Pagar (P)"${saldo > 0 ? ' data-off="1"' : ''}`);
  h += panels();
  return h;
}

export function renderBase() {
  const keepFocus = document.activeElement && document.activeElement.id === 'rpCode';
  base.innerHTML = S.screen === 'cobro' ? tenderScreen() : saleScreen();
  pos.dataset.screen = S.screen;
  tick();
  renderDots();
  if (keepFocus) { const c = $('#rpCode'); if (c) c.focus(); }
}

export function renderDots() {
  pos.classList.toggle('nodots', !S.dots || S.screen === 'cobro');
  dotsEl.innerHTML = SPOT_IDS.map(id => {
    const [x, y, w] = SPOTS[id].box;
    const small = w < 30;
    const dim = S.focus && S.focus.size && !S.focus.has(id);
    return `<span class="dot${S.seen.has(id) ? ' seen' : ''}${small ? ' sm' : ''}${dim ? ' dim' : ''}" style="${at(small ? x + w / 2 : Math.min(x + w - 5, 1034), small ? y - 3 : y + 6)}"></span>`;
  }).join('');
  const n = S.seen.size, tot = SPOT_IDS.length;
  $('#progTxt').textContent = `· ${n} de ${tot} vistos`;
}

/** Marca un punto como fijado sin volver a dibujar todo el lienzo. */
export function markPinned(id) {
  $$('.sp', base).forEach(el => el.classList.toggle('is-pin', el.dataset.spot === id));
}
export const spotEl = id => $(`.sp[data-spot="${id}"]`, base);

function tick() {
  const c = $('.rclock', base);
  if (!c) return;
  const d = new Date(), p = n => String(n).padStart(2, '0');
  c.textContent = `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function initReplica() {
  setInterval(tick, 1000);

  base.addEventListener('click', e => {
    if (e.target.id === 'rpCode') return;
    const a = e.target.closest('[data-act]');
    if (a) { tenderAction(a.dataset.act, a); return; }
    const row = e.target.closest('[data-row]');
    if (row && S.mode === 'practice') { S.sel = +row.dataset.row; pin('carrito', { video: false }); renderBase(); renderInfo(); return; }
    const el = e.target.closest('[data-spot]');
    if (!el) return;
    const id = el.dataset.spot;
    if (S.mode === 'practice') { pin(id, { video: S.pinned !== id }); act(id); return; }
    if (id === 'menu') { pin(id); openCheat(keyState()); return; }
    pin(id, { play: true });
    if (window.innerWidth < 1080) $('#insp').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  base.addEventListener('keydown', e => {
    if (e.target.id === 'rpCode') {
      if (e.key === 'Enter') { e.preventDefault(); codeEntered(e.target.value.trim()); return; }
      // Como en la Caja, el campo de código solo acepta números: el resto de las teclas son atajos.
      const combo = comboFromEvent(e);
      const typing = /^[0-9]$/.test(combo || '') || ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key);
      if (typing || !combo) return;
      e.preventDefault();
      const r = practiceKey(combo);
      if (r && r.spot) { const el = spotEl(r.spot); if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && (e.target.dataset.spot || e.target.dataset.act)) { e.preventDefault(); e.target.click(); }
  });

  // Vista previa al pasar el cursor (solo en equipos con mouse)
  if (canHover) {
    base.addEventListener('mouseover', e => {
      const el = e.target.closest('[data-spot]');
      if (!el) return;
      const next = el.dataset.spot === S.pinned ? null : el.dataset.spot;
      if (S.preview !== next) { S.preview = next; renderInfo(); }
    });
    pos.addEventListener('mouseleave', () => { if (S.preview) { S.preview = null; renderInfo(); } });
  }
}
