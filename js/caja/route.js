// La ruta dentro de la Caja de práctica: barra de pasos arriba de la Caja y, en el panel,
// el paso elegido con su video y sus misiones. Las misiones se tildan solas al hacerlas en la Caja.

import { $, $$, esc, mmss, store } from '../utils.js';
import { line } from '../icons.js';
import { VIDEOS, VIDEO_IDS, TOTAL_DUR, allSteps } from '../data/videos.js';
import { S } from '../state.js';
import { stepStatus, routeTotals, isWatched, setWatched, nextPending, nextAfter, onProgress, missionDone } from '../progress.js';
import { renderDots } from './replica.js';
import { cueRef } from './player.js';
import { goVideo } from '../router.js';

let setModeFn = () => {};

/** Puntos del mapa que aparecen en el paso a paso de un video. */
const focusOf = id => new Set(allSteps(id).map(s => s.spot).filter(Boolean));

export function selectStep(id, { play = false } = {}) {
  if (!VIDEOS[id]) return;
  S.step = id;
  S.focus = focusOf(id);
  store.set('step', id);
  renderStepper();
  renderStepCard();
  renderDots();
  cueRef({ v: id, a: 0, b: VIDEOS[id].dur }, play);
}

function ring(st) {
  const pct = (st.done + (st.video ? 1 : 0)) / (st.total + 1);
  return `<svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" class="r-bg"/><circle cx="18" cy="18" r="15.5" class="r-fg" style="stroke-dasharray:${(pct * 97.4).toFixed(1)} 97.4"/></svg>`;
}

export function renderStepper() {
  $('#stepper').innerHTML = VIDEO_IDS.map(id => {
    const st = stepStatus(id), v = VIDEOS[id];
    const cls = [st.complete ? 'done' : st.started ? 'half' : '', S.step === id ? 'on' : ''].join(' ');
    const label = `Paso ${id}: ${v.title}. ${st.complete ? 'Completo' : `${st.done} de ${st.total} misiones${st.video ? ', video visto' : ''}`}`;
    return `<li><button type="button" class="stp ${cls}" data-step="${id}" aria-current="${S.step === id}" aria-label="${esc(label)}">
      <span class="stp-n">${ring(st)}<span>${st.complete ? line('check') : id}</span></span><span class="stp-t">${esc(v.title)}</span></button></li>`;
  }).join('');
  const on = $('#stepper .stp.on');
  if (on) { const sc = $('#stepper'); sc.scrollTo({ left: on.parentElement.offsetLeft - sc.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' }); }
  const t = routeTotals();
  $('#routeCount').textContent = t.steps === t.total ? '¡Ruta completa!' : `${t.steps} de ${t.total} pasos completos`;
  $('#routeParts').textContent = ` · ${t.parts} de ${t.all} videos y misiones`;
  $('#routeFill').style.width = (t.parts / t.all * 100) + '%';
  $('#routeBar').setAttribute('aria-valuenow', Math.round(t.parts / t.all * 100));
  $('#routeMeta').textContent = `${t.total} pasos · menos de ${Math.ceil(TOTAL_DUR / 60)} minutos de video`;
}

export function renderStepCard() {
  const id = S.step, v = VIDEOS[id], st = stepStatus(id), next = nextAfter(id);
  const fresh = S.lastMission && Date.now() - S.lastMission.at < 4000 ? S.lastMission : null;
  const missions = v.missions.map(([ev, text]) => {
    const ok = missionDone(ev);
    return `<li class="ms${ok ? ' ok' : ''}${fresh && fresh.ev === ev ? ' fresh' : ''}"><span class="ms-box">${ok ? line('check') : ''}</span><span>${esc(text)}</span></li>`;
  }).join('');
  const cta = S.mode === 'practice'
    ? '<p class="ms-hint">Hacelas en la Caja: los botones y las teclas funcionan como en la real.</p>'
    : '<button type="button" class="btn btn-primary btn-block" data-practice>Practicar estas misiones</button>';
  $('#stepCard').innerHTML = `<div class="stepc">
    ${fresh ? `<div class="toast-ok">${line('check')} ¡Misión cumplida! ${esc(fresh.text)}</div>` : ''}
    <div class="insp-head"><span class="pill g-row">Paso ${id} de ${VIDEO_IDS.length}</span><span class="insp-state">${esc(v.category)}</span></div>
    <h2 class="stepc-t">${esc(v.title)}</h2>
    <p class="stepc-d">${esc(v.desc)}</p>
    <div class="parts">
      <button type="button" class="part${st.video ? ' ok' : ''}" data-playstep>${line(st.video ? 'check' : 'play')}<span><b>${st.video ? 'Video visto' : 'Mirá el video'}</b><small>${mmss(v.dur)} · ${v.chapters.length} ${v.chapters.length === 1 ? 'capítulo' : 'capítulos'}</small></span></button>
      <div class="part${st.done === st.total ? ' ok' : ''}">${line(st.done === st.total ? 'check' : 'hand')}<span><b>${st.done} de ${st.total} misiones</b><small>En la Caja de práctica</small></span></div>
    </div>
    <ol class="missions">${missions}</ol>
    ${st.complete ? `<div class="done-box"><b>¡Paso completo!</b>${next ? `<button type="button" class="btn btn-primary btn-block" data-step="${next}">Seguir con ${esc(VIDEOS[next].title)} ${line('arrow')}</button>` : '<span>Terminaste toda la ruta.</span>'}</div>` : cta}
    <div class="stepc-links">
      <button type="button" class="linkbtn" data-lesson>${line('route')} Paso a paso completo</button>
      <button type="button" class="linkbtn" data-watch>${line('check')} ${isWatched(id) ? 'Desmarcar video' : 'Marcar video como visto'}</button>
    </div>
  </div>`;
}

function onClick(e) {
  const b = e.target.closest('[data-step],[data-playstep],[data-practice],[data-lesson],[data-watch]');
  if (!b) return;
  if (b.dataset.step) { selectStep(b.dataset.step); return; }
  if (b.hasAttribute('data-playstep')) { cueRef({ v: S.step, a: 0, b: VIDEOS[S.step].dur }, true); $('#iv').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  if (b.hasAttribute('data-practice')) { setModeFn('practice'); return; }
  if (b.hasAttribute('data-lesson')) { goVideo(S.step, 0); return; }
  if (b.hasAttribute('data-watch')) setWatched(S.step, !isWatched(S.step));
}

export function initRoute(setMode) {
  setModeFn = setMode;
  const saved = store.get('step', null);
  S.step = VIDEOS[saved] ? saved : nextPending();
  S.focus = focusOf(S.step);
  $('#stepper').addEventListener('click', onClick);
  $('#stepCard').addEventListener('click', onClick);
  onProgress(() => { renderStepper(); renderStepCard(); });
  renderStepper();
  renderStepCard();
  // La tarjeta muestra el aviso de misión cumplida unos segundos y después lo saca.
  setInterval(() => { if (S.lastMission && Date.now() - S.lastMission.at > 4000 && $('#stepCard .toast-ok')) { S.lastMission = null; renderStepCard(); } }, 1000);
}
