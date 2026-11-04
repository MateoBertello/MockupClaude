// Inicio de Caja POS: la ruta unida a la Caja de práctica, accesos directos y respuestas rápidas.

import { $, $$, esc, mmss, store, flash } from '../utils.js';
import { I, line } from '../icons.js';
import { UPCOMING } from '../data/videos.js';
import { QUICK, TASKS } from '../data/content.js';
import { S, addLog, resetSale } from '../state.js';
import { initReplica, renderBase, renderDots, spotEl } from './replica.js';
import { initDialogs, closeDlg } from './dialogs.js';
import { comboFromEvent } from '../keys.js';
import { pin, renderInfo } from './inspector.js';
import { initPlayer, cueRef, renderChips } from './player.js';
import { practiceKey, refresh } from './actions.js';
import { follow } from '../router.js';
import { initRoute, renderStepCard } from './route.js';

export function setMode(mode) {
  if (S.mode === mode) return;
  S.mode = mode;
  $$('.seg [data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  if (mode === 'explore') { closeDlg(); S.screen = 'venta'; S.pays = []; }
  else if (!S.log.length) addLog('Venta de ejemplo cargada con dos artículos.');
  $('#stageHint').textContent = mode === 'practice'
    ? 'Los botones y las teclas funcionan como en la Caja real.'
    : 'Pasá el cursor por un botón para ver qué hace, o apretá una tecla.';
  refresh();
  renderStepCard();
}

function renderStatic() {
  $('#soon').innerHTML = '<span class="lbl">Próximamente</span>' + UPCOMING.map(u => `<span class="pill st-soon">${esc(u)}</span>`).join('');
  $('#tasks').innerHTML = TASKS.map((t, i) =>
    `<button type="button" class="task" data-task="${i}"><span class="tile">${line(t.icon)}</span><span><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></span>${line('arrow')}</button>`).join('');
  $('#qgrid').innerHTML = QUICK.map((x, i) =>
    `<button type="button" class="qa" data-q="${i}"><h3>${esc(x.q)}</h3><p>${esc(x.a)}</p><span class="go">${esc(x.label)} ${I.arrow}</span></button>`).join('');
}

/** Teclas de la Caja con el mapa a la vista. Devuelve true si la tecla se usó. */
export function handleCajaKey(e) {
  if (S.dlg) return false;
  const combo = comboFromEvent(e);
  if (!combo) return false;
  const r = practiceKey(combo);
  if (!r) return false;
  e.preventDefault();
  if (r.spot) flash(spotEl(r.spot));
  return true;
}

export function initCaja() {
  initReplica();
  initDialogs();
  initPlayer();
  renderBase();
  renderInfo();
  renderChips();
  renderStatic();
  initRoute(setMode);
  cueRef({ v: S.step, a: 0, b: 9999 }, false);
  $('#tasks').addEventListener('click', e => { const b = e.target.closest('[data-task]'); if (b) follow(TASKS[+b.dataset.task].go); });
  $('#qgrid').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) follow(QUICK[+b.dataset.q].go); });

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
