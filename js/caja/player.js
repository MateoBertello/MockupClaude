// Video del inspector: salta al tramo del punto fijado, se pausa al final del tramo
// y marca el paso de la transcripción que se está narrando.

import { $, $$, esc, mmss, rich, seekT, play } from '../utils.js';
import { VIDEOS, videoSrc, posterSrc, cueEnd, cueAt } from '../data/videos.js';
import { SPOTS } from '../data/spots.js';
import { S } from '../state.js';
import { goVideo } from '../router.js';
import { setWatched } from '../progress.js';

const video = $('#iv');
const cuesEl = $('#ivCues');
const segEnd = $('#segEnd');
const st = { v: null, ref: null, done: false, now: -1 };

export const pausePlayer = () => { if (!video.paused) video.pause(); };

export function renderChips() {
  const s = SPOTS[S.pinned];
  const whole = st.ref && st.ref.a === 0 && st.ref.b >= VIDEOS[st.ref.v].dur - 0.1;
  $('#vidLabel').textContent = whole ? `Video ${st.ref.v}: ${VIDEOS[st.ref.v].title}` : `Video de: ${s.label}`;
  $('#vidChips').innerHTML = s.refs.map((r, i) => {
    const on = st.ref && st.ref.v === r.v && st.ref.a === r.a;
    return `<button type="button" class="chip${on ? ' on' : ''}" data-ref="${i}">${r.v} · ${esc(VIDEOS[r.v].title)} <span class="t">${mmss(r.a)}</span></button>`;
  }).join('') + '<button type="button" class="chip chip-link" data-lesson>Ver el paso a paso →</button>';
}

function load(v) {
  if (st.v === v) return Promise.resolve();
  st.v = v; st.now = -1;
  video.poster = posterSrc(v);
  video.src = videoSrc(v);
  renderCues();
  return new Promise(resolve => {
    const ready = () => { video.removeEventListener('loadedmetadata', ready); resolve(); };
    video.addEventListener('loadedmetadata', ready);
    setTimeout(ready, 2500);
  });
}

function setSegment(ref) {
  ref = { ...ref, b: Math.min(ref.b, VIDEOS[ref.v].dur) };
  st.ref = ref; st.done = false;
  segEnd.classList.remove('show');
  $('#vidSeg').textContent = `${ref.v} · ${mmss(ref.a)} – ${mmss(ref.b)}`;
  renderChips();
}

/** Lleva el video al tramo ref ({ v, a, b }) y lo reproduce si autoplay. */
export function cueRef(ref, autoplay) {
  setSegment(ref);
  load(ref.v).then(() => {
    try { video.currentTime = seekT(ref.a); } catch (e) { /* metadatos aún no listos */ }
    renderCues();
    sync(true);
    if (autoplay) play(video);
  });
}

function renderCues() {
  const v = st.v;
  if (!v) { cuesEl.innerHTML = ''; return; }
  const ref = st.ref && st.ref.v === v ? st.ref : null;
  cuesEl.innerHTML = VIDEOS[v].cues.map((c, i) => {
    const inSeg = ref && c[0] >= ref.a - 0.01 && c[0] < ref.b;
    return `<button type="button" class="cue${inSeg ? ' seg' : ''}" data-i="${i}"><span class="t">${mmss(c[0])}</span><span>${rich(c[1])}</span></button>`;
  }).join('');
}

function sync(force) {
  const v = st.v;
  if (!v) return;
  const t = video.currentTime, k = cueAt(v, t);
  if (k !== st.now || force) {
    st.now = k;
    $$('.cue', cuesEl).forEach((el, i) => el.classList.toggle('now', i === k));
    const el = cuesEl.children[k];
    if (el) cuesEl.scrollTo({ top: el.offsetTop - cuesEl.offsetTop - 8, behavior: force ? 'auto' : 'smooth' });
  }
  const r = st.ref;
  if (r && !st.done && !video.paused && t >= r.b + 0.4 && r.b < VIDEOS[v].dur - 0.5) {
    st.done = true;
    video.pause();
    segEnd.classList.add('show');
  }
}

export function initPlayer() {
  video.addEventListener('ended', () => { if (st.v) setWatched(st.v, true); });
  video.addEventListener('timeupdate', () => sync(false));
  video.addEventListener('seeked', () => sync(false));

  $('#vidChips').addEventListener('click', e => {
    if (e.target.closest('[data-lesson]')) {
      const r = st.ref || SPOTS[S.pinned].refs[0];
      goVideo(r.v, video.currentTime > r.a ? video.currentTime : r.a);
      return;
    }
    const b = e.target.closest('[data-ref]');
    if (b) cueRef(SPOTS[S.pinned].refs[+b.dataset.ref], true);
  });

  cuesEl.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const i = +b.dataset.i, c = VIDEOS[st.v].cues[i];
    setSegment({ v: st.v, a: c[0], b: cueEnd(st.v, i) });
    renderCues();
    video.currentTime = seekT(c[0]);
    play(video);
  });

  $('#segReplay').addEventListener('click', () => {
    if (!st.ref) return;
    st.done = false; segEnd.classList.remove('show');
    video.currentTime = seekT(st.ref.a);
    play(video);
  });
  $('#segGo').addEventListener('click', () => {
    st.done = true;
    st.ref = { ...st.ref, b: VIDEOS[st.v].dur };
    segEnd.classList.remove('show');
    play(video);
  });
}
