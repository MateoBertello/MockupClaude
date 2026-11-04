// Buscador instantáneo (Ctrl K): botones, atajos, respuestas, momentos de los videos y módulos web.

import { $, $$, esc, mmss, norm, plain } from './utils.js';
import { SPOTS, SPOT_IDS } from './data/spots.js';
import { VIDEOS } from './data/videos.js';
import { ALL_SHORTCUTS, QUICK, WEB } from './data/content.js';
import { openOverlay, closeOverlay, isOpen } from './overlay.js';
import { follow, currentEnv } from './router.js';

const pal = $('#pal'), input = $('#q'), results = $('#palRes');
const ORDER_POS = ['Caja', 'Videos', 'Paso a paso', 'Respuestas rápidas', 'Atajos', 'Lo que dice el video', 'Sistema web'];
const ORDER_WEB = ['Sistema web', 'Caja', 'Videos', 'Paso a paso', 'Respuestas rápidas', 'Atajos', 'Lo que dice el video'];
const PER_GROUP = 6;
const INDEX = [];
let items = [], active = 0;

export const isSearchOpen = () => isOpen(pal);

function buildIndex() {
  const add = (grp, ic, title, sub, go, extra = '') => INDEX.push({ grp, ic, title, sub, go, n: norm(`${title} ${sub} ${extra} ${grp}`), nt: norm(title) });
  SPOT_IDS.forEach(id => {
    const s = SPOTS[id];
    add('Caja', 'C', s.label, s.what, { spot: id }, `${(s.key || []).join(' ')} ${s.warn || ''} ${s.tips.join(' ')}`);
  });
  ALL_SHORTCUTS.forEach(s => add('Atajos', s.keys[0].replace('CTRL+', '⌃').replace('Num ', '').slice(0, 4), `${s.label} · ${s.keys.join(' o ')}`, `${s.stateLabel}${s.desc ? ' · ' + s.desc : ''}`, { shortcut: s.label, state: s.state }, s.keys.join(' ')));
  QUICK.forEach(x => add('Respuestas rápidas', '?', x.q, x.a, x.go));
  Object.entries(VIDEOS).forEach(([id, v]) => {
    add('Videos', id, v.title, `Video ${id} · ${mmss(v.dur)} · ${v.chapters.map(c => c.title).join(', ')}`, { video: id, t: 0 }, `${v.category} ${v.desc}`);
    v.chapters.forEach(c => c.steps.forEach(st => add('Paso a paso', id, st[1], `Video ${id} · ${mmss(st[0])} · ${c.title}`, { video: id, t: st[0] })));
    v.cues.forEach(c => add('Lo que dice el video', id, plain(c[1]), `Video ${id} · ${mmss(c[0])} · ${v.title}`, { video: id, t: c[0] }));
  });
  WEB.forEach(m => {
    add('Sistema web', 'W', m.name, m.desc, { web: m.id });
    (m.subs || []).forEach(s => add('Sistema web', 'W', s[0], `${m.name} · ${s[1]}`, { web: m.id, sub: s[0] }));
  });
}

/** Marca en el texto las partes que coinciden con la búsqueda. */
function highlight(text, terms) {
  const n = norm(text), ranges = [];
  terms.forEach(t => { if (t.length < 2) return; const i = n.indexOf(t); if (i >= 0) ranges.push([i, i + t.length]); });
  ranges.sort((a, b) => a[0] - b[0]);
  let out = '', p = 0;
  ranges.forEach(([a, b]) => {
    a = Math.max(a, p);
    if (b <= a) return;
    out += esc(text.slice(p, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>';
    p = b;
  });
  return out + esc(text.slice(p));
}

function score(it, terms) {
  return terms.reduce((a, t) => a + (it.nt.includes(t) ? 3 : 0) + (it.nt.startsWith(t) ? 2 : 0), 0) + (it.grp === 'Caja' ? 1 : 0);
}

function defaults() {
  const popular = ['productos', 'tacho', 'pagar', 'etiqueta'].map(id => INDEX.find(it => it.grp === 'Caja' && it.title === SPOTS[id].label));
  return INDEX.filter(it => it.grp === 'Respuestas rápidas').concat(popular);
}

function run() {
  const raw = input.value.trim(), terms = norm(raw).split(/\s+/).filter(Boolean);
  const found = terms.length
    ? INDEX.filter(it => terms.every(t => it.n.includes(t))).map(it => [it, score(it, terms)]).sort((a, b) => b[1] - a[1]).map(x => x[0])
    : defaults();
  const byGroup = {};
  found.forEach(it => { const g = (byGroup[it.grp] = byGroup[it.grp] || []); if (g.length < PER_GROUP) g.push(it); });

  items = [];
  let h = '';
  (currentEnv() === 'web' ? ORDER_WEB : ORDER_POS).forEach(g => {
    if (!byGroup[g]) return;
    h += `<div class="pal-g">${g}</div>`;
    byGroup[g].forEach(it => {
      const i = items.push(it) - 1;
      h += `<button type="button" class="res" data-r="${i}"><span class="ri">${esc(it.ic)}</span><span class="rt"><b>${terms.length ? highlight(it.title, terms) : esc(it.title)}</b><span>${esc(it.sub)}</span></span></button>`;
    });
  });
  results.innerHTML = h || `<div class="pal-empty">No encontramos “${esc(raw)}”. Probá con otra palabra, por ejemplo <b>vuelto</b> o <b>precio</b>.</div>`;
  active = 0;
  markActive();
}

function markActive(scroll = true) {
  $$('.res', results).forEach((b, i) => b.classList.toggle('act', i === active));
  const a = $('.res.act', results);
  if (a && scroll) a.scrollIntoView({ block: 'nearest' });
}

function choose(i) {
  const it = items[i];
  if (!it) return;
  pal.hidden = true;
  follow(it.go);
}

export function openSearch(query = '') {
  input.value = query;
  run();
  openOverlay(pal, input);
}

export function initSearch() {
  buildIndex();
  input.addEventListener('input', run);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(items.length - 1, active + 1); markActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); markActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') closeOverlay(pal);
  });
  results.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) choose(+b.dataset.r); });
  results.addEventListener('mousemove', e => {
    const b = e.target.closest('[data-r]');
    if (b && +b.dataset.r !== active) { active = +b.dataset.r; markActive(false); }
  });
  pal.addEventListener('click', e => { if (e.target === pal) closeOverlay(pal); });
}
