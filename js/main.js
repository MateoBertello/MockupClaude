// Punto de entrada: arma cada sección y conecta los atajos globales.

import { $, $$ } from './utils.js';
import { OWL, OWL_SMALL, line } from './icons.js';
import { initCaja, handleCajaKey } from './caja/index.js';
import { initLesson } from './lesson.js';
import { initWeb } from './web.js';
import { initCheat, openCheat, isCheatOpen, cheatKey } from './cheatsheet.js';
import { initSearch, openSearch, isSearchOpen } from './search.js';
import { initRouter, goWeb } from './router.js';

$$('[data-owl]').forEach(el => { el.innerHTML = OWL; });
$$('[data-owl-small]').forEach(el => { el.innerHTML = OWL_SMALL; });
$$('[data-line]').forEach(el => { el.outerHTML = line(el.dataset.line); });

initCaja();
initLesson();
initWeb();
initCheat();
initSearch();
initRouter();

$$('[data-open-search]').forEach(b => b.addEventListener('click', () => openSearch()));
$('#openCheat').addEventListener('click', openCheat);
$('#cheatBanner').addEventListener('click', openCheat);
$('#webBanner').addEventListener('click', () => goWeb(null));
$('#heroChips').addEventListener('click', e => { const c = e.target.closest('[data-query]'); if (c) openSearch(c.dataset.query); });

document.addEventListener('keydown', e => {
  if (isCheatOpen()) { cheatKey(e); return; }
  if (isSearchOpen()) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.key === '/') { e.preventDefault(); openSearch(); return; }
  if (e.key === '?') { e.preventDefault(); openCheat(); return; }
  if ($('#view-caja').hidden || e.ctrlKey || e.metaKey || e.altKey) return;
  handleCajaKey(e);
});
