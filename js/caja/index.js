// Pestaña "Mapa de la Caja": arma la réplica, el inspector y los controles de modo.

import { $, $$, esc, store, flash } from '../utils.js';
import { I } from '../icons.js';
import { SPOTS, SPOT_IDS } from '../data/spots.js';
import { QUICK } from '../data/content.js';
import { S, addLog, resetSale } from '../state.js';
import { initReplica, renderBase, renderDots, spotEl } from './replica.js';
import { initDialogs, closeDlg, chooseMedio } from './dialogs.js';
import { pin, renderInfo } from './inspector.js';
import { initPlayer, cueRef, renderChips } from './player.js';
import { act, refresh } from './actions.js';
import { follow } from '../router.js';

function setMode(mode) {
  S.mode = mode;
  $$('.seg [data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  if (mode === 'explore') closeDlg();
  else if (!S.log.length) addLog('Venta de ejemplo cargada con dos artículos.');
  refresh();
}

function renderQuick() {
  $('#qgrid').innerHTML = QUICK.map((x, i) =>
    `<button type="button" class="qa" data-q="${i}"><h3>${esc(x.q)}</h3><p>${esc(x.a)}</p><span class="go">${esc(x.label)} ${I.arrow}</span></button>`).join('');
  $('#qgrid').addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (b) follow(QUICK[+b.dataset.q].go);
  });
}

/** Teclas propias de la Caja: B abre Productos, 1 a 6 eligen medio en Pago detallado. */
export function handleCajaKey(e) {
  if (e.key === 'Escape' && S.dlg) { closeDlg(); return true; }
  if (/^[1-6]$/.test(e.key) && S.dlg && S.dlg.k === 'pago') { e.preventDefault(); chooseMedio(+e.key - 1); return true; }
  if (e.key.toLowerCase() === 'b' && !S.dlg) {
    e.preventDefault();
    if (S.mode === 'practice') { pin('productos', { video: false }); act('productos'); }
    else { pin('productos'); flash(spotEl('productos')); }
    return true;
  }
  return false;
}

export function initCaja() {
  $('#cnt-spots').textContent = SPOT_IDS.length;
  initReplica();
  initDialogs();
  initPlayer();
  renderBase();
  renderInfo();
  renderChips();
  renderQuick();
  cueRef(SPOTS[S.pinned].refs[0], false);

  $$('.seg [data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  const dots = $('#dotsToggle');
  dots.checked = S.dots;
  dots.addEventListener('change', () => { S.dots = dots.checked; store.set('dots', S.dots); renderDots(); });
  $('#resetSale').addEventListener('click', () => {
    resetSale(); closeDlg();
    addLog('Venta de ejemplo reiniciada.');
    refresh();
  });
}
