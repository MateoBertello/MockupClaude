// Pestaña "Videos tutoriales": tarjetas, transcripción por capítulos y reproductor sincronizado.

import { $, $$, esc, mmss, rich, seekT, play } from './utils.js';
import { VIDEOS, UPCOMING, videoSrc, posterSrc, cueAt } from './data/videos.js';
import { SPOTS } from './data/spots.js';
import { goSpot } from './router.js';

const video = $('#vtv');
const stepsEl = $('#vtSteps');
let current = '01';
let now = -1;

export const pauseVideos = () => { if (!video.paused) video.pause(); };
export const videosLoaded = () => !!video.getAttribute('src');

const chapterEnd = (v, i) => (i + 1 < v.chapters.length ? v.chapters[i + 1][0] : v.dur);

function renderSteps(id) {
  const v = VIDEOS[id];
  let h = `<p class="eyebrow">Video ${id} · ${mmss(v.dur)}</p><h2>${esc(v.title)}</h2>` +
    `<div class="vt-meta">${v.chapters.map(c => `<span class="pill g-row">${esc(c[1])}</span>`).join('')}</div>`;
  v.chapters.forEach((c, ci) => {
    const end = ci + 1 < v.chapters.length ? v.chapters[ci + 1][0] : v.dur + 1;
    h += `<div class="chap"><h4>${esc(c[1])} <span>${mmss(c[0])}</span></h4>`;
    v.cues.forEach((q, i) => {
      if (q[0] >= c[0] && q[0] < end) h += `<button type="button" class="step" data-i="${i}"><span class="t">${mmss(q[0])}</span><span>${rich(q[1])}</span></button>`;
    });
    h += '</div>';
  });
  stepsEl.innerHTML = h;
  $('#chapbar').innerHTML = v.chapters.map((c, ci) =>
    `<button type="button" style="flex:${chapterEnd(v, ci) - c[0]}" data-t="${c[0]}" title="${esc(c[1])}"><i></i><span>${esc(c[1])}</span></button>`).join('');
  $('#vtSpots').innerHTML = '<span class="lbl">En la Caja:</span>' +
    v.spots.map(s => `<button type="button" class="chip" data-spot="${s}">${esc(SPOTS[s].label)}</button>`).join('');
}

/** Muestra un video, opcionalmente desde el segundo t, y lo reproduce si autoplay. */
export function selectVideo(id, t = 0, autoplay = false) {
  if (current !== id || !videosLoaded()) {
    current = id; now = -1;
    video.poster = posterSrc(id);
    video.src = videoSrc(id);
  }
  $$('.vcard').forEach(c => c.setAttribute('aria-current', String(c.dataset.v === id)));
  renderSteps(id);
  const go = () => {
    try { video.currentTime = seekT(t); } catch (e) { /* sin metadatos */ }
    if (autoplay) play(video);
    sync();
  };
  if (video.readyState >= 1) go(); else video.addEventListener('loadedmetadata', go, { once: true });
}

function sync() {
  const v = VIDEOS[current], t = video.currentTime;
  $$('#chapbar button').forEach((b, ci) => {
    const a = v.chapters[ci][0], e = chapterEnd(v, ci);
    b.querySelector('i').style.width = Math.max(0, Math.min(1, (t - a) / (e - a))) * 100 + '%';
  });
  const k = cueAt(current, t);
  if (k === now) return;
  now = k;
  $$('.step', stepsEl).forEach(el => el.classList.toggle('now', +el.dataset.i === k));
}

export function initVideos() {
  $('#vcards').innerHTML = Object.entries(VIDEOS).map(([id, v]) =>
    `<button type="button" class="vcard" data-v="${id}"><span class="th"><img src="${posterSrc(id)}" alt="" loading="lazy"><span class="n">${id}</span><span class="d">${mmss(v.dur)}</span></span>` +
    `<span class="b"><h3>${esc(v.title)}</h3><p>${v.chapters.length} capítulos · ${v.cues.length} pasos</p></span></button>`).join('');
  $('#soon').innerHTML = '<span class="lbl">Próximamente</span>' + UPCOMING.map(u => `<span class="pill st-soon">${esc(u)}</span>`).join('');

  $('#vcards').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) selectVideo(b.dataset.v); });
  stepsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    video.currentTime = seekT(VIDEOS[current].cues[+b.dataset.i][0]);
    play(video);
  });
  $('#chapbar').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    video.currentTime = +b.dataset.t;
    play(video);
  });
  $('#vtSpots').addEventListener('click', e => { const b = e.target.closest('[data-spot]'); if (b) goSpot(b.dataset.spot); });
  video.addEventListener('timeupdate', sync);
  video.addEventListener('seeked', sync);
}
