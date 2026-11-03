// Abrir y cerrar las capas superpuestas (hoja de atajos y buscador) devolviendo el foco.

let lastFocus = null;

export function openOverlay(el, focusTarget) {
  lastFocus = document.activeElement;
  el.hidden = false;
  if (focusTarget) focusTarget.focus();
}

export function closeOverlay(el) {
  el.hidden = true;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

export const isOpen = el => !el.hidden;
