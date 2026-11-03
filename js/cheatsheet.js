// Hoja de atajos: teclado visual y lista agrupada. Al presionar una tecla se resalta su función.

import { $, $$, esc } from './utils.js';
import { SHORTCUTS } from './data/content.js';
import { openOverlay, closeOverlay, isOpen } from './overlay.js';

const cheat = $('#cheat');
const KB_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const lastKey = k => k.keys[k.keys.length - 1];
/* Combinaciones con CTRL que el navegador usaría para otra cosa mientras la hoja está abierta. */
const BLOCK_CTRL = ['A', 'G', 'Q', 'L', 'R', 'D'];

export const isCheatOpen = () => isOpen(cheat);

function render() {
  const used = new Set(SHORTCUTS.map(lastKey));
  $('#kb').innerHTML = KB_ROWS.map((row, ri) =>
    `<div class="kb-row">${ri === 2 ? '<span class="kk wide use" data-k="CTRL">CTRL</span>' : ''}${[...row].map(k => `<span class="kk${used.has(k) ? ' use' : ''}" data-k="${k}">${k}</span>`).join('')}</div>`).join('');

  const groups = [...new Set(SHORTCUTS.map(s => s.g))];
  $('#cheatList').innerHTML = groups.map(g => `<div class="cg"><h3>${esc(g)}</h3>${SHORTCUTS.map((s, i) => s.g !== g ? '' :
    `<div class="sc" data-sc="${i}"><div class="l"><b>${esc(s.label)}</b><span>${esc(s.desc)}</span>${s.vid ? `<span class="vdiff">En el video 02 (4.44.3) figura ${esc(s.vid)}</span>` : ''}</div>` +
    `<div class="ks">${s.keys.map(k => `<kbd>${k}</kbd>`).join('<span class="plus">+</span>')}</div></div>`).join('')}</div>`).join('');

  const diffs = SHORTCUTS.filter(s => s.vid).length;
  $('#cheatFoot').textContent = `${diffs} atajos de esta lista se ven distintos en el menú del video 02, grabado con la versión 4.44.3. Además Arqueo Caja y Nota Crédito Libre comparten la N. Conviene confirmar en la Caja 4.46.1 cuál vale.`;
}

const lightKeys = keys => $$('.kk', cheat).forEach(k => k.classList.toggle('lit', keys.includes(k.dataset.k)));
const lightRows = idx => $$('.sc', cheat).forEach(x => x.classList.toggle('lit', idx.includes(+x.dataset.sc)));

export function openCheat() {
  $('#lastKey').textContent = '—';
  $('#lastHit').textContent = '';
  lightRows([]); lightKeys([]);
  openOverlay(cheat, $('.xbtn', cheat));
}

export function flashShortcut(label) {
  const i = SHORTCUTS.findIndex(s => s.label === label);
  if (i < 0) return;
  lightRows([i]);
  lightKeys(SHORTCUTS[i].keys);
  const el = $(`.sc[data-sc="${i}"]`, cheat);
  if (el) el.scrollIntoView({ block: 'nearest' });
}

/** Teclas mientras la hoja está abierta. */
export function cheatKey(e) {
  if (e.key === 'Escape') { closeOverlay(cheat); return; }
  if (e.key === 'Control') { lightKeys(['CTRL']); return; }
  if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) return;
  const k = e.key.toUpperCase(), ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && BLOCK_CTRL.includes(k)) e.preventDefault();
  const hits = SHORTCUTS.map((s, i) => ({ s, i })).filter(({ s }) => lastKey(s) === k && s.keys.includes('CTRL') === ctrl);
  $('#lastKey').textContent = (ctrl ? 'CTRL + ' : '') + k;
  $('#lastHit').textContent = hits.length ? '→ ' + hits.map(h => h.s.label).join(' y ') : '→ sin atajo en la Caja';
  lightRows(hits.map(h => h.i));
  lightKeys(ctrl ? ['CTRL', k] : [k]);
  const first = hits[0] && $(`.sc[data-sc="${hits[0].i}"]`, cheat);
  if (first) first.scrollIntoView({ block: 'nearest' });
}

export function initCheat() {
  render();
  cheat.addEventListener('click', e => { if (e.target === cheat || e.target.closest('[data-close]')) closeOverlay(cheat); });
  cheat.addEventListener('mouseover', e => {
    const sc = e.target.closest('[data-sc]');
    if (sc) { lightKeys(SHORTCUTS[+sc.dataset.sc].keys); return; }
    const key = e.target.closest('[data-k]');
    if (key && key.dataset.k !== 'CTRL') {
      lightRows(SHORTCUTS.map((s, i) => (s.keys.includes(key.dataset.k) ? i : -1)).filter(i => i >= 0));
      lightKeys([key.dataset.k]);
    }
  });
}
