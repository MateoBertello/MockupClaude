// Progreso de la ruta de videos, guardado en este navegador.

import { store } from './utils.js';
import { VIDEO_IDS } from './data/videos.js';

const done = new Set(store.get('done', []).filter(id => VIDEO_IDS.includes(id)));
const listeners = [];

const save = () => { store.set('done', [...done]); listeners.forEach(fn => fn()); };

export const isDone = id => done.has(id);
export const doneCount = () => done.size;
export const onProgress = fn => listeners.push(fn);

export function setDone(id, value = true) {
  if (value === done.has(id)) return;
  if (value) done.add(id); else done.delete(id);
  save();
}

/** El primer video sin ver, o el primero si ya están todos. */
export const nextPending = () => VIDEO_IDS.find(id => !done.has(id)) || VIDEO_IDS[0];

/** El video que sigue a id en la ruta, o null si es el último. */
export function nextAfter(id) {
  const i = VIDEO_IDS.indexOf(id);
  return i >= 0 && i < VIDEO_IDS.length - 1 ? VIDEO_IDS[i + 1] : null;
}
