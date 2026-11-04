// Progreso de la ruta, guardado en este navegador.
// Cada paso de la ruta se completa con dos cosas: ver su video y cumplir sus misiones en la Caja de práctica.
// Las misiones se cumplen con eventos que dispara la práctica (track), por ejemplo 'code-add' o 'pay-two'.

import { store } from './utils.js';
import { VIDEOS, VIDEO_IDS } from './data/videos.js';

const watched = new Set(store.get('done', []).filter(id => VIDEO_IDS.includes(id)));
const events = new Set(store.get('events', []));
const listeners = [];

function save() {
  store.set('done', [...watched]);
  store.set('events', [...events]);
  listeners.forEach(fn => fn());
}

export const onProgress = fn => listeners.push(fn);

/* ---------- Videos ---------- */
export const isWatched = id => watched.has(id);
export function setWatched(id, value = true) {
  if (value === watched.has(id)) return;
  if (value) watched.add(id); else watched.delete(id);
  save();
}

/* ---------- Misiones ---------- */
export const missionDone = ev => events.has(ev);

/** Registra un evento de la práctica. Devuelve las misiones que se cumplieron recién. */
export function track(ev) {
  if (events.has(ev)) return [];
  events.add(ev);
  const fresh = VIDEO_IDS.flatMap(id => VIDEOS[id].missions.filter(m => m[0] === ev).map(m => ({ id, text: m[1] })));
  save();
  return fresh;
}

/* ---------- Pasos ---------- */
export function stepStatus(id) {
  const ms = VIDEOS[id].missions;
  const done = ms.filter(m => events.has(m[0])).length;
  const video = watched.has(id);
  return { video, done, total: ms.length, complete: video && done === ms.length, started: video || done > 0 };
}

export function routeTotals() {
  let steps = 0, parts = 0, all = 0;
  VIDEO_IDS.forEach(id => {
    const s = stepStatus(id);
    if (s.complete) steps++;
    parts += s.done + (s.video ? 1 : 0);
    all += s.total + 1;
  });
  return { steps, total: VIDEO_IDS.length, parts, all };
}

/** El primer paso sin completar, o el primero si ya están todos. */
export const nextPending = () => VIDEO_IDS.find(id => !stepStatus(id).complete) || VIDEO_IDS[0];

/** El paso que sigue a id, o null si es el último. */
export function nextAfter(id) {
  const i = VIDEO_IDS.indexOf(id);
  return i >= 0 && i < VIDEO_IDS.length - 1 ? VIDEO_IDS[i + 1] : null;
}

/** Borra todo el progreso (para empezar de nuevo). */
export function resetProgress() {
  watched.clear(); events.clear(); save();
}
