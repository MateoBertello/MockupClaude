// Pestaña "Sistema web": menú de sistema.buhomanager.com y guía interactiva de Artículos.

import { $, esc } from './utils.js';
import { I } from './icons.js';
import { WEB, ART_MARKS, ART_ROWS } from './data/content.js';
import { goVideo } from './router.js';

let sel = { mod: 'articulos', sub: 'Artículos' };
const open = new Set(['articulos']);
let mark = 1;

const mk = n => `<button type="button" class="mk${mark === n ? ' on' : ''}" data-mk="${n}" aria-label="${esc(ART_MARKS[n - 1][1])}">${n}</button>`;
const recargarTip = text => `<div class="tipline">${I.arrow}<span>${text} <b>Recargar Artículos</b> <kbd class="key">CTRL</kbd><kbd class="key">Q</kbd>.</span></div>`;

function renderSide() {
  $('#side').innerHTML = WEB.map(m => {
    const isOpen = open.has(m.id);
    let h = `<button type="button" class="mod${sel.mod === m.id && !sel.sub ? ' on' : ''}" data-mod="${m.id}" aria-expanded="${m.subs ? isOpen : 'false'}">${I.module}<span>${esc(m.name)}</span><span class="chev">${I.chevd}</span></button>`;
    if (m.subs && isOpen) {
      h += `<div class="subs">${m.subs.map(s => `<button type="button" class="sub${sel.sub === s[0] ? ' on' : ''}${s[2] ? ' has' : ''}" data-mod="${m.id}" data-sub="${esc(s[0])}"><i></i>${esc(s[0])}</button>`).join('')}</div>`;
    }
    return h;
  }).join('');
}

/* Esquema de la lista de Artículos con sus marcadores numerados. */
function articulosGuide() {
  const rows = ART_ROWS.map((r, i) =>
    `<span${i === 0 ? ' class="tg"' : ''}>${i === 0 ? mk(9) : ''}⋮</span><span><span class="ws-code">${r[0]}</span></span><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span>` +
    `<span class="tnum">$${r[4]}</span><span class="tnum">$${r[5]}</span><span class="tnum">$${r[6]}</span><span>${r[7]}</span>`).join('');
  return `<div class="card wd">
    <div class="insp-head"><span class="pill g-act">Gestión Artículos</span><span class="pill st-ok">Guía interactiva</span></div>
    <h2 class="wd-title">Artículos</h2>
    <p class="desc">La lista de todos los artículos del comercio. Toque un número para ver qué hace cada parte de la pantalla.</p>
    <div class="art">
      <div class="ws-wrap"><div class="ws">
        <div class="ws-top">☰ BuhoManager</div><div class="ws-crumb">Artículos</div>
        <div class="ws-filters">
          <div class="ws-f tg">${mk(1)}<span><small>Nombre/Codigo</small>&nbsp;</span><span class="tg ws-scan">${mk(2)}⌗</span></div>
          <div class="ws-f tg">${mk(3)}Cod. Extendido</div><div class="ws-f">Proveedor</div><div class="ws-f">Departamento</div>
          <div class="ws-f tg">${mk(4)}<span><small>Marca</small>Todas las marcas</span><span>▾</span></div>
          <div class="ws-chk tg">${mk(5)}<span><i class="on"></i>Solo Habilitados</span><span><i></i>Solo Ecommerce</span></div>
        </div>
        <div class="ws-btns"><span class="tg">${mk(6)}Buscar</span><span>Limpiar</span><span class="tg">${mk(7)}Exportar</span><span class="new tg">${mk(8)}+ Nuevo</span></div>
        <div class="ws-table">
          <span class="hd"></span><span class="hd">Codigo</span><span class="hd">Cod. Ext.</span><span class="hd">Nombre</span><span class="hd">Descripcion</span>
          <span class="hd tg">${mk(10)}Costo</span><span class="hd">Precio 1</span><span class="hd">Precio 2</span><span class="hd tg">${mk(11)}Actualizado</span>
          ${rows}
        </div>
      </div></div>
      <div class="mk-list">${ART_MARKS.map(k => `<button type="button" class="mk-item${mark === k[0] ? ' on' : ''}" data-mk="${k[0]}"><span class="n">${k[0]}</span><span><b>${esc(k[1])}</b><span>${esc(k[2])}</span></span></button>`).join('')}</div>
    </div>
    ${recargarTip('Después de cambiar precios acá, en la Caja use')}
  </div>`;
}

function subPage(m, s) {
  let extra = '';
  if (s[0] === 'Promociones') extra = `<div class="tipline">${I.arrow}<span>En la Caja, si un artículo tiene promoción, al cambiar la cantidad la caja la agrega sola en otro renglón.</span><button type="button" class="chip" data-govideo="03" data-t="45">Ver 03 · 0:45</button></div>`;
  if (s[0] === 'Actualización Masiva') extra = recargarTip('Después de actualizar, en la Caja use');
  return `<div class="card wd"><div class="insp-head"><span class="pill g-act">${esc(m.name)}</span><span class="pill st-soon">Guía en preparación</span></div>
    <h2 class="wd-title">${esc(s[0])}</h2><p class="desc">${esc(s[1])}</p>${extra}</div>`;
}

function modulePage(m) {
  const subs = m.subs ? `<div class="subgrid">${m.subs.map(s => `<button type="button" class="subcard" data-mod="${m.id}" data-sub="${esc(s[0])}"><span class="pill ${s[2] ? 'st-ok' : 'st-soon'}">${s[2] ? 'Guía interactiva' : 'En preparación'}</span><b>${esc(s[0])}</b><p>${esc(s[1])}</p></button>`).join('')}</div>` : '';
  return `<div class="card wd"><div class="insp-head"><span class="pill g-act">Módulo</span><span class="pill ${m.subs ? 'st-ok' : 'st-soon'}">${m.subs ? '1 guía interactiva' : 'Guía en preparación'}</span></div>
    <h2 class="wd-title">${esc(m.name)}</h2><p class="desc">${esc(m.desc)}</p>${subs}</div>`;
}

function render() {
  renderSide();
  const m = WEB.find(x => x.id === sel.mod);
  const s = sel.sub && m.subs.find(x => x[0] === sel.sub);
  $('#webDetail').innerHTML = sel.sub === 'Artículos' ? articulosGuide() : s ? subPage(m, s) : modulePage(m);
}

export function openWeb(mod, sub = null) {
  sel = { mod, sub };
  open.add(mod);
  render();
}

export function initWeb() {
  render();
  $('#side').addEventListener('click', e => {
    const b = e.target.closest('[data-mod]');
    if (!b) return;
    const id = b.dataset.mod, sub = b.dataset.sub || null, m = WEB.find(x => x.id === id);
    if (!sub && m.subs && sel.mod === id && !sel.sub) {
      if (open.has(id)) open.delete(id); else open.add(id);
      render();
      return;
    }
    openWeb(id, sub);
  });
  $('#webDetail').addEventListener('click', e => {
    const k = e.target.closest('[data-mk]');
    if (k) { mark = +k.dataset.mk; render(); return; }
    const sc = e.target.closest('.subcard');
    if (sc) { openWeb(sc.dataset.mod, sc.dataset.sub); return; }
    const gv = e.target.closest('[data-govideo]');
    if (gv) goVideo(gv.dataset.govideo, +gv.dataset.t);
  });
}
