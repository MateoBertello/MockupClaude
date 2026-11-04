// Vista de un video (#video-NN): reproductor, capítulos, paso a paso sincronizado,
// narración literal, progreso de la ruta y puente al mapa de la Caja.

import { $, $$, esc, mmss, rich, seekT, play } from './utils.js';
import { line, I } from './icons.js';
import { VIDEOS, VIDEO_IDS, videoSrc, posterSrc, cueAt, chapterAt, allSteps, indexAt } from './data/videos.js';
import { SPOTS } from './data/spots.js';
import { isWatched as isDone, setWatched as setDone, nextAfter, stepStatus } from './progress.js';
import { goSpot, goVideo, goHome, goStep } from './router.js';

const view = $('#view-video');
const video = $('#lv');
let current = null;
let state = { ch: -1, step: -1, cue: -1 };

export const pauseLesson = () => { if (!video.paused) video.pause(); };

const pos = id => VIDEO_IDS.indexOf(id) + 1;

function header(id, v) {
  return `<nav class="crumbs" aria-label="Ubicación"><button type="button" class="crumb" data-home>${line('back')} Caja POS</button><span>›</span><span>Ruta · video ${pos(id)} de ${VIDEO_IDS.length}</span></nav>
    <div class="lesson-head">
      <div><p class="eyebrow">${esc(v.category)} · video ${id} · ${mmss(v.dur)}</p><h1 class="h1">${esc(v.title)}</h1><p class="lede">${esc(v.desc)}</p></div>
    </div>`;
}

function stepsHtml(id, v) {
  let n = 0;
  return v.chapters.map((c, ci) => {
    const cues = v.cues.map((q, qi) => [q, qi]).filter(([q]) => q[0] >= c.t && (ci + 1 >= v.chapters.length || q[0] < v.chapters[ci + 1].t));
    return `<section class="lchap" data-ch="${ci}">
      <header class="lchap-h"><span class="pill g-row tnum">${mmss(c.t)}</span><h3>${esc(c.title)}</h3></header>
      <ol class="lsteps">${c.steps.map(s => {
        const i = n++;
        const spotLink = s[2] ? `<button type="button" class="see" data-spot="${s[2]}">${line('hand')} Ver en la Caja</button>` : '';
        return `<li class="lstep" data-step="${i}"><button type="button" class="lstep-go" data-t="${s[0]}"><span class="num">${i + 1}</span><span class="txt">${esc(s[1])}</span><span class="t tnum">${mmss(s[0])}</span></button>${spotLink}</li>`;
      }).join('')}</ol>
      <details class="narr"><summary>Lo que dice el video</summary>
        ${cues.map(([q, qi]) => `<button type="button" class="cue" data-cue="${qi}" data-t="${q[0]}"><span class="t">${mmss(q[0])}</span><span>${rich(q[1])}</span></button>`).join('')}
      </details>
    </section>`;
  }).join('');
}

function sideHtml(id, v) {
  const next = nextAfter(id);
  const warn = v.warnSpot && SPOTS[v.warnSpot].warn;
  const practice = SPOTS[v.practice];
  return `
    <div class="card lside-card">
      <div class="side-label">En este video</div>
      <div class="lchapters">${v.chapters.map((c, ci) => `<button type="button" class="lch" data-chjump="${ci}" data-t="${c.t}"><span class="n">${ci + 1}</span><span><b>${esc(c.title)}</b><small class="tnum">${mmss(c.t)} · ${c.steps.length} pasos</small></span><i class="bar"><i></i></i></button>`).join('')}</div>
      ${warn ? `<div class="warn">${I.warn}<div><b>Regla clave.</b> ${esc(warn)}</div></div>` : ''}
      <div class="tipbox"><b>Un consejo de Buho</b><span>${esc(v.tip)}</span></div>
      <button type="button" class="btn btn-ghost" id="lDone" aria-pressed="${isDone(id)}">${line('check')} <span>${isDone(id) ? 'Visto' : 'Marcar como visto'}</span></button>
      ${next ? `<button type="button" class="btn btn-primary" data-next="${next}">Siguiente: ${esc(VIDEOS[next].title)} ${line('arrow')}</button>` : `<button type="button" class="btn btn-primary" data-home>Volver a la ruta ${line('arrow')}</button>`}
      <small class="muted center">Tu progreso se guarda en este navegador.</small>
    </div>
    <button type="button" class="card practice-cta" data-practice="${v.practice}">
      <span class="pc-ic">${practice.icon}</span>
      <span><b>Probalo en la Caja</b><small>${stepStatus(id).total} misiones para hacer en la Caja de práctica.</small></span>
      ${line('arrow')}
    </button>`;
}

/** Abre la lección id en el segundo t. */
export function openLesson(id, t = 0, autoplay = false) {
  const v = VIDEOS[id];
  if (current !== id) {
    current = id;
    state = { ch: -1, step: -1, cue: -1 };
    video.poster = posterSrc(id);
    video.src = videoSrc(id);
    $('#lHead').innerHTML = header(id, v);
    $('#lSteps').innerHTML = stepsHtml(id, v);
    $('#lSide').innerHTML = sideHtml(id, v);
  }
  const go = () => {
    try { video.currentTime = seekT(t); } catch (e) { /* sin metadatos */ }
    sync(true);
    if (autoplay) play(video);
  };
  if (video.readyState >= 1) go(); else video.addEventListener('loadedmetadata', go, { once: true });
}

function renderDone() {
  const b = $('#lDone');
  if (!b) return;
  b.setAttribute('aria-pressed', String(isDone(current)));
  b.querySelector('span').textContent = isDone(current) ? 'Visto' : 'Marcar como visto';
}

function sync(force) {
  if (!current) return;
  const v = VIDEOS[current], t = video.currentTime;
  const steps = allSteps(current).map(s => [s.t]);
  const ch = chapterAt(current, t), step = indexAt(steps, t, 0.4), cue = cueAt(current, t);
  $$('.lch', view).forEach((b, ci) => {
    const a = v.chapters[ci].t, e = ci + 1 < v.chapters.length ? v.chapters[ci + 1].t : v.dur;
    b.classList.toggle('on', ci === ch);
    b.querySelector('.bar i').style.width = Math.max(0, Math.min(1, (t - a) / (e - a))) * 100 + '%';
  });
  if (!force && ch === state.ch && step === state.step && cue === state.cue) return;
  state = { ch, step, cue };
  $$('.lchap', view).forEach((el, ci) => el.classList.toggle('on', ci === ch));
  $$('.lstep', view).forEach((el, i) => { el.classList.toggle('now', i === step); el.classList.toggle('past', i < step); });
  $$('.narr .cue', view).forEach(el => el.classList.toggle('now', +el.dataset.cue === cue));
}

export function initLesson() {
  video.addEventListener('timeupdate', () => sync(false));
  video.addEventListener('seeked', () => sync(false));
  video.addEventListener('ended', () => { setDone(current, true); renderDone(); });

  view.addEventListener('click', e => {
    const el = e.target.closest('[data-spot],[data-practice],[data-next],[data-home],[data-t],#lDone');
    if (!el) return;
    if (el.id === 'lDone') { setDone(current, !isDone(current)); renderDone(); return; }
    if (el.dataset.spot) { pauseLesson(); goSpot(el.dataset.spot); return; }
    if (el.dataset.practice) { pauseLesson(); goStep(current); return; }
    if (el.dataset.next) { goVideo(el.dataset.next, 0); return; }
    if (el.hasAttribute('data-home')) { pauseLesson(); goHome('ruta'); return; }
    if (el.dataset.t) { video.currentTime = seekT(+el.dataset.t); play(video); }
  });
}
