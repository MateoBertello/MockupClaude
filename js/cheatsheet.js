// Hoja de atajos: una pestaña por pantalla de la Caja, teclado visual y lista agrupada.
// Al presionar una tecla se resalta lo que hace en la pantalla elegida.

import { $, $$, esc } from './utils.js';
import { KEY_STATES, ALL_SHORTCUTS } from './data/content.js';
import { comboFromEvent, comboParts, shortcutsFor, stateById, keycaps } from './keys.js';
import { openOverlay, closeOverlay, isOpen } from './overlay.js';
import { goSpot } from './router.js';

const cheat = $('#cheat');
const KB = [
  ['Esc', 'F1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Supr'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
  ['CTRL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Espacio']
];
const NUMPAD = ['Num /', 'Num *', 'Num −', 'Num +', 'Num .'];
const WIDE = { Esc: 'w1', Supr: 'w1', Enter: 'w2', CTRL: 'w2', Espacio: 'w4' };
/* Combinaciones con CTRL que el navegador usaría para otra cosa mientras la hoja está abierta. */
const BLOCK = /^CTRL\+[A-Z0-9]$/;

let current = 'venta';
let shown = [];

export const isCheatOpen = () => isOpen(cheat);

function keyCap(k, used) {
  const label = k.replace('Num ', '');
  return `<span class="kk ${WIDE[k] || ''}${used.has(k) ? ' use' : ''}" data-k="${esc(k)}">${k.startsWith('Num ') ? `<small>Num</small>${esc(label)}` : esc(k)}</span>`;
}

function render() {
  const st = stateById(current);
  shown = ALL_SHORTCUTS.filter(s => s.state === current);
  const used = new Set(shown.flatMap(s => s.keys.flatMap(comboParts)));
  $('#cheatTabs').innerHTML = KEY_STATES.map(s => `<button type="button" role="tab" aria-selected="${s.id === current}" data-state="${s.id}">${esc(s.label)}</button>`).join('');
  $('#cheatDesc').textContent = st.desc;
  $('#kb').innerHTML = `<div class="kb-main">${KB.map(row => `<div class="kb-row">${row.map(k => keyCap(k, used)).join('')}</div>`).join('')}</div>` +
    `<div class="kb-num"><span class="kb-cap">Teclado numérico</span>${NUMPAD.map(k => keyCap(k, used)).join('')}</div>`;
  let i = 0;
  $('#cheatList').innerHTML = st.groups.map(([group, list]) => `<div class="cg"><h3>${esc(group)}</h3>${list.map(s => {
    const idx = i++;
    const extra = [s.menu ? '<span class="tag">En el menú</span>' : '', s.spot ? `<button type="button" class="tag tag-go" data-spot="${s.spot}">Ver en la Caja</button>` : ''].join('');
    return `<div class="sc" data-sc="${idx}"><div class="l"><b>${esc(s.label)}</b>${s.desc ? `<span>${esc(s.desc)}</span>` : ''}${extra ? `<div class="tags">${extra}</div>` : ''}</div><div class="ks">${keycaps(s.keys)}</div></div>`;
  }).join('')}</div>`).join('');
}

const lightKeys = keys => $$('.kk', cheat).forEach(k => k.classList.toggle('lit', keys.includes(k.dataset.k)));
const lightRows = idx => $$('.sc', cheat).forEach(x => x.classList.toggle('lit', idx.includes(+x.dataset.sc)));

function setState(id) {
  current = id;
  render();
  $('#lastKey').textContent = '—';
  $('#lastHit').textContent = '';
}

/** Abre la hoja en una pantalla (por defecto, la que tiene la Caja de práctica). */
export function openCheat(stateId) {
  setState(stateId || current);
  openOverlay(cheat, $('.xbtn', cheat));
}
export const setCheatState = id => { current = id; };

export function flashShortcut(label, state) {
  const s = ALL_SHORTCUTS.find(x => x.label === label && (!state || x.state === state));
  if (!s) return;
  setState(s.state);
  const i = shown.indexOf(shown.find(x => x.label === label));
  lightRows([i]);
  lightKeys(s.keys.flatMap(comboParts));
  const el = $(`.sc[data-sc="${i}"]`, cheat);
  if (el) el.scrollIntoView({ block: 'nearest' });
}

/** Teclas mientras la hoja está abierta. */
export function cheatKey(e) {
  if (e.key === 'Escape' && !e.ctrlKey) { closeOverlay(cheat); return; }
  if (e.key === 'Control') { lightKeys(['CTRL']); return; }
  const combo = comboFromEvent(e);
  if (!combo) return;
  if (BLOCK.test(combo) || combo === 'Espacio' || combo === 'F1') e.preventDefault();
  const hits = shortcutsFor(current, combo);
  $('#lastKey').textContent = combo;
  if (hits.length) {
    $('#lastHit').textContent = '→ ' + hits.map(h => h.label).join(' y ');
  } else {
    const other = ALL_SHORTCUTS.filter(s => s.keys.includes(combo));
    $('#lastHit').textContent = other.length
      ? `→ acá no hace nada. ${other[0].stateLabel}: ${other[0].label}`
      : '→ sin atajo en la Caja';
  }
  lightRows(hits.map(h => shown.indexOf(h)));
  lightKeys(comboParts(combo));
  const first = hits[0] && $(`.sc[data-sc="${shown.indexOf(hits[0])}"]`, cheat);
  if (first) first.scrollIntoView({ block: 'nearest' });
}

export function initCheat() {
  render();
  cheat.addEventListener('click', e => {
    if (e.target === cheat || e.target.closest('[data-close]')) { closeOverlay(cheat); return; }
    const tab = e.target.closest('[data-state]');
    if (tab) { setState(tab.dataset.state); return; }
    const go = e.target.closest('[data-spot]');
    if (go) { closeOverlay(cheat); goSpot(go.dataset.spot); }
  });
  cheat.addEventListener('mouseover', e => {
    const sc = e.target.closest('[data-sc]');
    if (sc) { lightKeys(shown[+sc.dataset.sc].keys.flatMap(comboParts)); return; }
    const key = e.target.closest('[data-k]');
    if (key && key.dataset.k !== 'CTRL') {
      const k = key.dataset.k;
      lightRows(shown.map((s, i) => (s.keys.some(c => comboParts(c).includes(k)) ? i : -1)).filter(i => i >= 0));
      lightKeys([k]);
    }
  });
}
