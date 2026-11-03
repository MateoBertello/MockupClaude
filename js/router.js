// Navegación entre pestañas sin recargar, con enlaces directos por hash:
// #caja, #videos, #web, #punto-<id> y #video-<nn>.

import { $, $$, flash } from './utils.js';
import { SPOTS } from './data/spots.js';
import { VIDEOS } from './data/videos.js';
import { pin } from './caja/inspector.js';
import { spotEl } from './caja/replica.js';
import { pausePlayer } from './caja/player.js';
import { selectVideo, pauseVideos, videosLoaded } from './videos.js';
import { openWeb } from './web.js';
import { openCheat, flashShortcut } from './cheatsheet.js';

const VIEWS = ['caja', 'videos', 'web'];

function setHash(h) {
  if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h);
}

export function showTab(tab) {
  VIEWS.forEach(v => { $('#view-' + v).hidden = v !== tab; });
  $$('.tab[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  if (tab === 'videos' && !videosLoaded()) selectVideo('01');
  if (tab !== 'videos') pauseVideos();
  if (tab !== 'caja') pausePlayer();
}

export function goSpot(id) {
  setHash('punto-' + id);
  showTab('caja');
  pin(id);
  flash(spotEl(id));
  $('#pos').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function goVideo(id, t = 0) {
  setHash('video-' + id);
  showTab('videos');
  selectVideo(id, t, t > 0);
  window.scrollTo({ top: $('#view-videos').offsetTop - 70, behavior: 'smooth' });
}

export function goWeb(mod, sub = null) {
  setHash('web');
  showTab('web');
  openWeb(mod, sub);
}

/** Sigue un destino declarado en los datos: { spot } | { video, t } | { shortcut } | { web, sub }. */
export function follow(go) {
  if (go.spot) goSpot(go.spot);
  else if (go.video) goVideo(go.video, go.t || 0);
  else if (go.shortcut) { openCheat(); flashShortcut(go.shortcut); }
  else if (go.web) goWeb(go.web, go.sub || null);
}

function route() {
  const h = location.hash.slice(1);
  const spot = h.startsWith('punto-') && h.slice(6);
  const video = h.startsWith('video-') && h.slice(6);
  if (spot && SPOTS[spot]) { showTab('caja'); pin(spot); return; }
  if (video && VIDEOS[video]) { showTab('videos'); selectVideo(video); return; }
  showTab(VIEWS.includes(h) ? h : 'caja');
}

export function initRouter() {
  $$('.tab[data-tab]').forEach(b => b.addEventListener('click', () => { setHash(b.dataset.tab); showTab(b.dataset.tab); }));
  window.addEventListener('hashchange', route);
  route();
}
