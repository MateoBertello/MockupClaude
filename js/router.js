// Navegación sin recargar. Dos entornos con sus vistas, y enlaces directos por hash:
//   Caja POS:    #caja · #ruta · #mapa · #punto-<id> · #video-<nn>
//   Sistema Web: #web · #web-<módulo>

import { $, $$, flash } from './utils.js';
import { SPOTS } from './data/spots.js';
import { VIDEOS } from './data/videos.js';
import { WEB } from './data/content.js';
import { pin } from './caja/inspector.js';
import { spotEl } from './caja/replica.js';
import { pausePlayer } from './caja/player.js';
import { setMode } from './caja/index.js';
import { openLesson, pauseLesson } from './lesson.js';
import { openWeb, showWebHome } from './web.js';
import { openCheat, flashShortcut } from './cheatsheet.js';

const VIEWS = ['caja', 'video', 'web'];
const HERO = {
  pos: {
    eyebrow: 'Caja POS · escritorio · versión 4.46.1',
    title: 'Aprendé la Caja <span>tocándola.</span>',
    lede: 'Videos cortos, el paso a paso y una Caja de práctica donde podés equivocarte tranquilo.',
    chips: ['Descuento', 'Vuelto', 'Tecla B', 'Cancelar']
  },
  web: {
    eyebrow: 'Sistema Web · Plan Nube · versión 3.59.2',
    title: 'Tu comercio en la nube, <span>módulo por módulo.</span>',
    lede: 'Artículos, stock, clientes y reportes. Lo que configurás acá llega a la Caja.',
    chips: ['Artículos', 'Promociones', 'Clientes', 'Precios']
  }
};
let env = 'pos';

export const currentEnv = () => env;

function setHash(h) {
  if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h);
}

function setEnv(next) {
  env = next;
  $$('.envs [data-env]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.env === env)));
  const h = HERO[env];
  $('#heroEyebrow').textContent = h.eyebrow;
  $('#heroTitle').innerHTML = h.title;
  $('#heroLede').textContent = h.lede;
  $('#heroChips').innerHTML = '<span>Probá buscar</span>' + h.chips.map(c => `<button type="button" class="chip" data-query="${c}">${c}</button>`).join('');
  document.documentElement.dataset.area = env;
}

/** Muestra una vista. La portada con el buscador se oculta en la lección y dentro de un módulo web. */
function show(view, { hero = view !== 'video' } = {}) {
  VIEWS.forEach(v => { $('#view-' + v).hidden = v !== view; });
  $('#hero').hidden = !hero;
  setEnv(view === 'web' ? 'web' : 'pos');
  if (view !== 'video') pauseLesson();
  if (view !== 'caja') pausePlayer();
}

const scrollTo = el => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

/** Inicio de Caja POS; section puede ser 'ruta' o 'mapa'. */
export function goHome(section) {
  setHash(section || 'caja');
  show('caja');
  if (section) scrollTo($('#sec-' + section)); else window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function goSpot(id, opts = {}) {
  setHash('punto-' + id);
  show('caja');
  if (opts.practice) setMode('practice');
  pin(id);
  flash(spotEl(id));
  $('#pos').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function goVideo(id, t = 0) {
  setHash('video-' + id);
  show('video');
  openLesson(id, t, t > 0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Sistema Web: sin módulo muestra la grilla. */
export function goWeb(mod, sub = null) {
  setHash(mod ? 'web-' + mod : 'web');
  show('web', { hero: !mod });
  if (mod) openWeb(mod, sub); else showWebHome();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Sigue un destino declarado en los datos: { spot, practice } | { video, t } | { shortcut } | { web, sub }. */
export function follow(go) {
  if (go.spot) goSpot(go.spot, go);
  else if (go.video) goVideo(go.video, go.t || 0);
  else if (go.shortcut) { openCheat(); flashShortcut(go.shortcut, go.state); }
  else if (go.web) goWeb(go.web, go.sub || null);
}

function route() {
  const h = location.hash.slice(1);
  const [kind, ...rest] = h.split('-');
  const arg = rest.join('-');
  if (kind === 'punto' && SPOTS[arg]) { show('caja'); pin(arg); return; }
  if (kind === 'video' && VIDEOS[arg]) { show('video'); openLesson(arg); return; }
  if (kind === 'web') {
    const mod = arg && WEB.some(m => m.id === arg) ? arg : null;
    show('web', { hero: !mod });
    if (mod) openWeb(mod); else showWebHome();
    return;
  }
  show('caja');
  if (h === 'ruta' || h === 'mapa') requestAnimationFrame(() => scrollTo($('#sec-' + h)));
}

export function initRouter() {
  $$('.envs [data-env]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.env === 'web') goWeb(null); else goHome();
  }));
  window.addEventListener('hashchange', route);
  route();
}
