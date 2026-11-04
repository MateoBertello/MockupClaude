// Inicio de Caja POS: ruta de videos, accesos directos, mapa interactivo y respuestas rápidas.

import { $, $$, esc, mmss, store, flash } from '../utils.js';
import { I, line } from '../icons.js';
import { SPOTS, SPOT_IDS } from '../data/spots.js';
import { VIDEOS, VIDEO_IDS, TOTAL_DUR, UPCOMING, posterSrc } from '../data/videos.js';
import { QUICK, TASKS } from '../data/content.js';
import { S, addLog, resetSale } from '../state.js';
import { isDone, doneCount, nextPending, onProgress } from '../progress.js';
import { initReplica, renderBase, renderDots, spotEl } from './replica.js';
import { initDialogs, closeDlg, chooseMedio } from './dialogs.js';
import { pin, renderInfo } from './inspector.js';
import { initPlayer, cueRef, renderChips } from './player.js';
import { act, refresh } from './actions.js';
import { follow, goVideo } from '../router.js';

export function setMode(mode) {
  if (S.mode === mode) return;
  S.mode = mode;
  $$('.seg [data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  if (mode === 'explore') closeDlg();
  else if (!S.log.length) addLog('Venta de ejemplo cargada con dos artículos.');
  refresh();
}

/* ---------- Ruta de videos ---------- */
function renderRoute() {
  const n = doneCount(), total = VIDEO_IDS.length;
  $('#routeCount').textContent = n === total ? '¡Ruta completada!' : `${n} de ${total} vistos`;
  $('#routeFill').style.width = (n / total * 100) + '%';
  $('#routeBar').setAttribute('aria-valuenow', n);
  $('#routeStart').innerHTML = `${n === total ? 'Repasar la ruta' : n ? 'Seguir la ruta' : 'Empezar la ruta'} ${line('arrow')}`;
  $('#routeMeta').textContent = `${total} videos · menos de ${Math.ceil(TOTAL_DUR / 60)} minutos`;
  $('#vgrid').innerHTML = VIDEO_IDS.map(id => {
    const v = VIDEOS[id], d = isDone(id);
    return `<button type="button" class="vcard${d ? ' done' : ''}" data-video="${id}" style="--tint:${v.tint}" aria-label="Video ${id}: ${esc(v.title)}, ${mmss(v.dur)}${d ? ', visto' : ''}">
      <span class="th"><img src="${posterSrc(id)}" alt="" loading="lazy"><span class="n">${id}</span><span class="d tnum">${mmss(v.dur)}</span><span class="pl">${line('play')}</span></span>
      <span class="b"><span class="cat">${esc(v.category)}</span><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p>
      <span class="foot"><span>${d ? 'Visto' : `${v.chapters.length} capítulos`}</span>${line(d ? 'check' : 'arrow')}</span></span>
    </button>`;
  }).join('');
}

function renderStatic() {
  $('#soon').innerHTML = '<span class="lbl">Próximamente</span>' + UPCOMING.map(u => `<span class="pill st-soon">${esc(u)}</span>`).join('');
  $('#tasks').innerHTML = TASKS.map((t, i) =>
    `<button type="button" class="task" data-task="${i}"><span class="tile">${line(t.icon)}</span><span><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></span>${line('arrow')}</button>`).join('');
  $('#qgrid').innerHTML = QUICK.map((x, i) =>
    `<button type="button" class="qa" data-q="${i}"><h3>${esc(x.q)}</h3><p>${esc(x.a)}</p><span class="go">${esc(x.label)} ${I.arrow}</span></button>`).join('');
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
  renderStatic();
  renderRoute();
  onProgress(renderRoute);
  cueRef(SPOTS[S.pinned].refs[0], false);

  $('#routeStart').addEventListener('click', () => goVideo(nextPending(), 0));
  $('#vgrid').addEventListener('click', e => { const b = e.target.closest('[data-video]'); if (b) goVideo(b.dataset.video, 0); });
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
