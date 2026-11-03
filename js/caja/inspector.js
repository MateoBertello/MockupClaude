// Panel lateral: explica el punto fijado o el que está bajo el cursor.

import { $, esc } from '../utils.js';
import { I } from '../icons.js';
import { SPOTS, GROUPS } from '../data/spots.js';
import { S, markSeen } from '../state.js';
import { markPinned, renderDots } from './replica.js';
import { cueRef, renderChips } from './player.js';

const infoEl = $('#insp-info');

/**
 * Fija un punto en el inspector.
 * opts.video: false para no cambiar el video; opts.play: true para reproducir el tramo.
 */
export function pin(id, opts = {}) {
  S.pinned = id;
  S.preview = null;
  markSeen(id);
  markPinned(id);
  renderDots();
  renderInfo();
  renderChips();
  if (opts.video !== false && SPOTS[id].refs[0]) cueRef(SPOTS[id].refs[0], !!opts.play);
}

export function renderInfo() {
  const id = S.preview || S.pinned, s = SPOTS[id], [groupName, groupCls] = GROUPS[s.g];
  const keys = s.key
    ? `Atajo ${s.key.map(k => `<kbd class="key">${k}</kbd>`).join('')}`
    : esc(s.keysNote || 'Sin atajo propio');
  const swatch = s.sw ? ` style="background:${s.sw};border-color:transparent"` : '';
  const state = S.preview ? 'Vista previa' : (S.mode === 'practice' ? 'Practicando' : 'Seleccionado');

  let h = `<div class="insp-in">
    <div class="insp-head"><span class="pill ${groupCls}">${groupName}</span><span class="insp-state${S.preview ? ' live' : ''}">${state}</span></div>
    <h2 class="insp-title"><span class="swatch"${swatch}>${s.icon}</span>${esc(s.label)}</h2>
    <div class="kbd-row">${keys}</div>
    <p class="what">${esc(s.what)}</p>`;
  if (s.warn) h += `<div class="warn">${I.warn}<div><b>Regla clave.</b> ${esc(s.warn)}</div></div>`;
  if (s.tips.length) h += `<ul class="tips">${s.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
  if (S.mode === 'practice') {
    const items = S.log.length ? S.log.map(l => `<li>${esc(l)}</li>`).join('') : '<li>Toque un botón de la réplica para practicar.</li>';
    h += `<div class="log"><h4>Lo que pasó en la Caja</h4><ol>${items}</ol></div>`;
  } else {
    h += `<p class="hint">${S.preview ? 'Haga clic para fijarlo y reproducir el video en el momento exacto.' : 'Cambie a <b>Practicar</b> para probar este botón con una venta de ejemplo.'}</p>`;
  }
  infoEl.innerHTML = h + '</div>';
}
