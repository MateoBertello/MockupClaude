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

/* La réplica usa los píxeles reales de la Caja (1040 x 655); estas funciones los pasan a porcentajes
   y el tamaño de letra a unidades del contenedor, para que todo escale junto. */
export const CW = 1040, CH = 655;
const pc = (v, d) => +(v / d * 100).toFixed(4);
export const box = (x, y, w, h) => `left:${pc(x, CW)}%;top:${pc(y, CH)}%;width:${pc(w, CW)}%;height:${pc(h, CH)}%`;
export const at = (x, y) => `left:${pc(x, CW)}%;top:${pc(y, CH)}%`;
export const fs = px => `font-size:${pc(px, CW)}cqw`;

export const play = video => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
export const flash = el => { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };
