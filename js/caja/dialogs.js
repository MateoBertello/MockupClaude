// Ventanas que se abren dentro de la réplica en el modo Practicar:
// Cantidad, Descuento, Cambio de precio, confirmaciones, Productos y Pago detallado.

import { $, esc, money, fmtQty, norm, box } from '../utils.js';
import { I } from '../icons.js';
import { CATALOG, MEDIOS } from '../data/content.js';
import { S, totals, paid, addLog, selItem, nextId, clearSale } from '../state.js';
import { addItem, refresh } from './actions.js';
import { renderInfo } from './inspector.js';

const dlgEl = $('#rp-dlg');

export function openDlg(d) { S.dlg = d; renderDlg(); }
export function closeDlg() { S.dlg = null; renderDlg(); }

/* ---------- Plantillas ---------- */
const okCancel = (ok = 'ok', can = 'close') =>
  `<span class="abtn b-green" data-act="${ok}" role="button">${I.check}Aceptar</span><span class="abtn b-red" data-act="${can}" role="button">${I.cancel}Cancelar</span>`;

function frame(rect, title, body, btns, cls = '') {
  return `<div class="dlg ${cls}" style="${box(...rect)}" role="dialog" aria-label="${esc(title || 'Ventana')}">` +
    `<div class="dlg-head"><span class="dlg-x" data-act="close" role="button" aria-label="Cerrar">✕</span></div>` +
    `<div class="dlg-body">${title ? `<div class="dlg-title">${esc(title)}</div>` : ''}${body}</div>` +
    (btns === false ? '' : `<div class="dlg-btns">${btns || okCancel()}</div>`) + '</div>';
}

const keypad = name => {
  const keys = ns => ns.map(n => `<button data-act="kp" data-n="${n}">${n}</button>`).join('');
  return `<div class="kp-screen" id="kpS">0</div><div class="dlg-msg kp-name">${esc(name)}</div>
    <div class="kp">
      <button class="fn wide" data-act="close">Cerrar</button><button class="fn wide" data-act="kp-back" aria-label="Borrar">⟵</button>
      ${keys(['7', '8', '9'])}<button class="fn" data-act="kp-inc" aria-label="Sumar uno">+</button>
      ${keys(['4', '5', '6'])}<button class="fn" data-act="kp-dec" aria-label="Restar uno">−</button>
      ${keys(['1', '2', '3'])}<button class="fn tall" data-act="ok" aria-label="Aceptar">↵</button>
      <button class="wide" data-act="kp" data-n="0">0</button><button data-act="kp" data-n=".">·</button>
    </div>`;
};

function pagoScreen() {
  const t = totals(), p = paid();
  const saldo = Math.max(0, t.total - p), vuelto = Math.max(0, p - t.total);
  let h = `<div class="abs pd-bg" style="${box(0, 55, 1000, 432)}"></div><div class="abs pd-bg" style="${box(770, 55, 230, 545)}"></div>`;
  MEDIOS.forEach(([m, ic], i) => {
    h += `<div class="abs pd-medio" style="${box(14, 66 + i * 50, 220, 44)}"><span class="n">${i + 1}</span><span class="abtn b-blue" data-act="medio" data-m="${i}" role="button">${ic}${m}</span></div>`;
  });
  h += `<div class="abs pd-medio" style="${box(14, 366, 220, 44)}"><span class="n">M</span><span class="abtn b-blue" style="opacity:.6">${I.more}Más..</span></div>`;
  let rows = '<div class="h"><span>Medio de Pago</span><span>Monto</span></div>';
  for (let i = 0; i < 12; i++) {
    const x = S.pays[i];
    rows += `<div class="r"><span>${x ? esc(x.medio) : '&nbsp;'}</span><span style="text-align:right">${x ? money(x.monto) : ''}</span></div>`;
  }
  h += `<div class="abs pd-list" style="${box(255, 66, 500, 400)}">${rows}</div>`;
  [['Total', t.total.toFixed(2)], ['Saldo', saldo.toFixed(2)], ['Descuento', t.dsc ? t.dsc.toFixed(2) : ''], ['Vuelto', vuelto.toFixed(2)]]
    .forEach(([label, v], i) => { h += `<div class="abs pd-box" style="${box(774, 63 + i * 70, 215, 64)}"><small>${label}</small><b>${v}</b></div>`; });
  h += `<span class="abs abtn b-red pd-btn" style="${box(774, 415, 215, 49)}" data-act="limpiar" role="button">${I.clean}<span><span class="u">L</span>impiar</span></span>`;
  h += `<span class="abs abtn b-volver pd-btn" style="${box(774, 473, 215, 49)}" data-act="volver" role="button">${I.back}<span><span class="u">V</span>olver</span></span>`;
  h += `<span class="abs abtn b-green pd-btn${saldo > 0 ? ' off' : ''}" style="${box(774, 532, 215, 49)}" data-act="pd-pagar" role="button" aria-disabled="${saldo > 0}">${I.check}<span><span class="u">P</span>agar</span></span>`;
  h += `<div class="abs pd-hint" style="${box(255, 470, 500, 18)}">Toque un medio de pago o use las teclas 1 a 6</div>`;
  return h;
}

const VIEWS = {
  cantidad: () => frame([330, 40, 340, 520], 'Cantidad', keypad(selItem() ? selItem().name : ''), false, 'hl'),
  descuento: () => frame([330, 120, 340, 280], 'Descuento',
    '<label for="dVal">Valor</label><input id="dVal" value="10.0" inputmode="decimal">' +
    '<label for="dTipo">Tipo de descuento</label><select id="dTipo"><option value="pct">Descuento Porcentual</option><option value="fijo">Descuento Monto Fijo</option></select>' +
    '<div class="dlg-msg err" id="dErr"></div>', null, 'hl'),
  precio: () => frame([300, 110, 340, 330], 'Cambio de precio',
    `<label for="pMonto">Monto Modificado $</label><input id="pMonto" inputmode="decimal" placeholder="${selItem() ? selItem().price.toFixed(2) : ''}">` +
    '<label for="pTipo">Tipo de Ajuste</label><select id="pTipo"><option value="rec">Recargo</option><option value="desc">Descuento</option></select>' +
    '<label for="pPct">Porcentaje %</label><input id="pPct" inputmode="decimal"><div class="dlg-msg err" id="pErr"></div>', null, 'hl'),
  confirm: d => frame([310, 190, 380, 210], '', `<div class="dlg-msg pad">${esc(d.msg)}</div>`, okCancel('confirm-ok')),
  aviso: d => frame([290, 170, 420, 250], '', `<div class="dlg-msg err pad">${esc(d.msg)}</div>`,
    `<span class="abtn b-blue btn-sm" data-act="aviso-go" role="button">${I.arrow}Ir al descuento</span><span class="abtn b-green" data-act="close" role="button">${I.check}Aceptar</span>`),
  productos: d => frame([40, 30, 760, 540], '',
    `<label for="pfQ" class="pf-label">Filtros de busqueda</label><input id="pfQ" class="pf-q" autocomplete="off" value="${esc(d.q || '')}"><div class="plist" id="pfList"></div>`),
  pago: () => pagoScreen(),
  pagoMonto: d => pagoScreen() + frame([330, 170, 340, 230], d.medio,
    `<label for="pmV">Importe</label><input id="pmV" inputmode="decimal" value="${d.def.toFixed(2)}"><div class="dlg-msg err" id="pmErr"></div>`, okCancel('pm-ok', 'close'), 'hl'),
  imprimir: () => pagoScreen() + frame([330, 190, 340, 200], '', '<div class="dlg-msg pad">¿Desea imprimir el comprobante?</div>',
    `<span class="abtn b-green" data-act="fin" role="button">${I.check}Sí</span><span class="abtn b-red" data-act="fin" role="button">${I.cancel}No</span>`)
};
const FIRST_FIELD = { descuento: '#dVal', precio: '#pMonto', pagoMonto: '#pmV' };

export function renderDlg() {
  const d = S.dlg;
  dlgEl.hidden = !d;
  dlgEl.innerHTML = d ? VIEWS[d.k](d) : '';
  if (!d) return;
  if (d.k === 'productos') {
    renderProductList();
    const q = $('#pfQ'); q.focus(); q.setSelectionRange(q.value.length, q.value.length);
  }
  const f = FIRST_FIELD[d.k] && $(FIRST_FIELD[d.k]);
  if (f) { f.focus(); f.select(); }
}

function renderProductList() {
  const d = S.dlg;
  const q = norm(d.q || '');
  d.list = CATALOG.filter(p => !q || norm(p[1]).includes(q) || p[0].startsWith(q));
  if (d.idx >= d.list.length) d.idx = 0;
  $('#pfList').innerHTML = d.list.length
    ? d.list.map((p, i) => `<div class="prow${i === d.idx ? ' on' : ''}" data-act="prow" data-i="${i}"><span>${p[0]}</span><span>${esc(p[1])}</span><span style="text-align:right">${p[2].toFixed(1)}</span></div>`).join('')
    : '<div class="dlg-msg pad">No hay artículos con ese nombre.</div>';
}

/* ---------- Respuestas a los botones de cada ventana ---------- */
const num = id => parseFloat(($(id).value || '').replace(',', '.'));
const done = () => { closeDlg(); refresh(); };
const backToPago = () => openDlg({ k: 'pago' });

const HANDLERS = {
  cantidad(a, el, d) {
    const r = selItem(), screen = $('#kpS'), show = () => { screen.textContent = d.v || '0'; };
    if (a === 'kp') {
      const n = el.dataset.n;
      if (n === '.' && (d.v || '').includes('.')) return;
      d.v = ((d.v || '') + n).replace(/^0(?=\d)/, '').slice(0, 7); show();
    } else if (a === 'kp-back') { d.v = (d.v || '').slice(0, -1); show(); }
    else if (a === 'kp-inc' || a === 'kp-dec') { d.v = String(Math.max(0, (parseFloat(d.v) || 0) + (a === 'kp-inc' ? 1 : -1))); show(); }
    else if (a === 'ok') {
      const q = parseFloat(d.v);
      if (!(q > 0)) { d.v = ''; screen.textContent = 'Ingrese un número'; return; }
      r.qty = q;
      addLog(`${r.name}: cantidad ${fmtQty(q)} · Total ${money(totals().total)}`);
      done();
    }
  },
  descuento(a) {
    if (a !== 'ok') return;
    const r = selItem(), v = num('#dVal'), pct = $('#dTipo').value === 'pct', line = r.qty * r.price;
    if (!(v > 0)) { $('#dErr').textContent = 'Escriba un valor mayor que cero.'; return; }
    const amount = Math.round((pct ? line * v / 100 : v) * 100) / 100;
    if (amount > line) { $('#dErr').textContent = 'El descuento supera el importe del artículo.'; return; }
    const at = S.rows.indexOf(r) + 1;
    S.rows.splice(at, 0, { t: 'd', id: nextId(), of: r.id, amount, name: (pct ? `Desc %${v.toFixed(1)} a ` : `Desc $${v.toFixed(2)} a `) + r.name });
    S.sel = at;
    addLog(`Descuento de ${money(amount)} · Total ${money(totals().total)}`);
    done();
  },
  precio(a) {
    if (a !== 'ok') return;
    const r = selItem(), m = num('#pMonto'), p = num('#pPct');
    if (m > 0) r.price = m;
    else if (p > 0) r.price = Math.round(r.price * ($('#pTipo').value === 'rec' ? 1 + p / 100 : 1 - p / 100) * 100) / 100;
    else { $('#pErr').textContent = 'Escriba un monto o un porcentaje.'; return; }
    addLog(`Nuevo precio de ${r.name}: ${money(r.price)} · Total ${money(totals().total)}`);
    done();
  },
  confirm(a, el, d) {
    if (a !== 'confirm-ok') return;
    if (d.run === 'limpiar') { S.pays = []; addLog('Se limpiaron los pagos.'); backToPago(); renderInfo(); return; }
    if (d.run === 'quitar') {
      const x = S.rows.splice(S.sel, 1)[0];
      S.sel = Math.max(0, Math.min(S.sel, S.rows.length - 1));
      addLog(`${x.t === 'd' ? 'Se quitó el descuento' : `Se quitó ${x.name}`} · Total ${money(totals().total)}`);
    }
    if (d.run === 'cancelar') { clearSale(); addLog('Venta cancelada: carrito, cliente y factura vacíos.'); }
    done();
  },
  aviso(a) {
    if (a !== 'aviso-go') return;
    const x = S.rows[S.sel], di = S.rows.findIndex(z => z.t === 'd' && z.of === x.id);
    if (di >= 0) S.sel = di;
    addLog('Seleccionado el renglón del descuento. Ahora sí puede quitarlo.');
    done();
  },
  productos(a, el, d) {
    if (a === 'prow') { d.idx = +el.dataset.i; renderProductList(); return; }
    if (a === 'ok') { const p = d.list && d.list[d.idx]; if (!p) return; addItem(p); done(); }
  },
  pago(a, el, d) {
    const t = totals().total, p = paid();
    if (a === 'medio') { openDlg({ k: 'pagoMonto', medio: MEDIOS[+el.dataset.m][0], def: Math.max(0, t - p) }); return; }
    if (a === 'pm-ok') {
      const v = num('#pmV');
      if (!(v > 0)) { $('#pmErr').textContent = 'Escriba un importe mayor que cero.'; return; }
      S.pays.push({ medio: d.medio, monto: v });
      addLog(`${d.medio}: ${money(v)} · Saldo ${money(Math.max(0, t - p - v))}`);
      backToPago(); renderInfo(); return;
    }
    if (a === 'limpiar') { if (S.pays.length) openDlg({ k: 'confirm', msg: '¿Borrar todos los pagos de la lista?', run: 'limpiar' }); return; }
    if (a === 'volver') { S.pays = []; closeDlg(); addLog('Volvió a la venta sin cobrar.'); renderInfo(); return; }
    if (a === 'pd-pagar') {
      if (p < t) { addLog(`Todavía falta cobrar ${money(t - p)}.`); renderInfo(); return; }
      openDlg({ k: 'imprimir' }); return;
    }
    if (a === 'fin') {
      const vuelto = p - t;
      clearSale();
      addLog(`Venta registrada${vuelto > 0 ? ` · Vuelto ${money(vuelto)}` : ''}. La caja vuelve a cero.`);
      done();
    }
  }
};
HANDLERS.pagoMonto = HANDLERS.pago;
HANDLERS.imprimir = HANDLERS.pago;

/** Cerrar (✕, Cancelar o Escape): las ventanas que salen de Pago detallado vuelven a él. */
function closeCurrent() {
  const d = S.dlg;
  if (d.k === 'pagoMonto' || (d.k === 'confirm' && d.run === 'limpiar')) backToPago();
  else if (d.k === 'pago' || d.k === 'imprimir') HANDLERS.pago('volver', null, d);
  else closeDlg();
}

export function dlgAction(a, el) {
  const d = S.dlg;
  if (!d) return;
  if (a === 'close') { closeCurrent(); return; }
  const h = HANDLERS[d.k];
  if (h) h(a, el, d);
}

/** Teclas 1 a 6 en Pago detallado. */
export function chooseMedio(i) {
  if (S.dlg && S.dlg.k === 'pago') dlgAction('medio', { dataset: { m: String(i) } });
}

export function initDialogs() {
  dlgEl.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (el) dlgAction(el.dataset.act, el);
  });
  dlgEl.addEventListener('dblclick', e => {
    const el = e.target.closest('.prow');
    if (el && S.dlg && S.dlg.k === 'productos') { S.dlg.idx = +el.dataset.i; dlgAction('ok', el); }
  });
  dlgEl.addEventListener('input', e => {
    if (e.target.id === 'pfQ' && S.dlg) { S.dlg.q = e.target.value; S.dlg.idx = 0; renderProductList(); }
  });
  dlgEl.addEventListener('keydown', e => {
    const d = S.dlg;
    if (!d) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeCurrent(); return; }
    if (d.k === 'productos' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      d.idx = Math.max(0, Math.min((d.list || []).length - 1, d.idx + (e.key === 'ArrowDown' ? 1 : -1)));
      renderProductList();
      const on = $('#pfList .on'); if (on) on.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      if (d.k === 'pagoMonto') dlgAction('pm-ok');
      else if (['descuento', 'precio', 'productos'].includes(d.k)) dlgAction('ok');
    }
  });
}
