// Utilidades compartidas: DOM, formato, texto y almacenamiento local.

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const money = n => '$ ' + (Math.round(n * 100) / 100).toFixed(2);
export const fmtQty = q => (Number.isInteger(q) ? String(q) : q.toFixed(3));
export const mmss = t => {
  t = Math.max(0, Math.floor(t));
  return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
};
/** Segundo al que se salta en un video: un poco antes de que aparezca el subtítulo. */
export const seekT = t => Math.max(0, t - 0.6);

/** Minúsculas y sin tildes, para buscar sin importar acentos. */
export const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/** Convierte *texto* en un rótulo resaltado. */
export const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
export const plain = s => s.replace(/\*/g, '');

export const store = {
  get(k, d) {
    try { const v = localStorage.getItem('bh-help-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
  },
  set(k, v) {
    try { localStorage.setItem('bh-help-' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ }
  }
};

export const canHover = window.matchMedia('(hover: hover)').matches;

/* El lienzo de la Caja mide 1000 x 600 unidades; estas funciones las pasan a porcentajes. */
export const box = (x, y, w, h) => `left:${x / 10}%;top:${y / 6}%;width:${w / 10}%;height:${h / 6}%`;
export const at = (x, y) => `left:${x / 10}%;top:${y / 6}%`;

export const play = video => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
export const flash = el => { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };
