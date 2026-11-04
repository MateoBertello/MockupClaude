// Traduce las teclas del navegador a los nombres que usa el keymap de la Caja.

import { KEY_STATES, ALL_SHORTCUTS } from './data/content.js';

const NUMPAD = { NumpadAdd: 'Num +', NumpadSubtract: 'Num −', NumpadDecimal: 'Num .', NumpadMultiply: 'Num *', NumpadDivide: 'Num /', NumpadEnter: 'Enter' };
const NAMED = { Delete: 'Supr', Escape: 'Esc', ' ': 'Espacio', Enter: 'Enter', F1: 'F1' };

/** Devuelve la combinación de la Caja ("CTRL+Q", "Num +", "B", "Supr"…) o null si la tecla no se usa. */
export function comboFromEvent(e) {
  let k = NUMPAD[e.code] || NAMED[e.key] || null;
  if (!k && /^Numpad\d$/.test(e.code)) k = e.code.slice(6);
  if (!k && /^Key[A-Z]$/.test(e.code)) k = e.code.slice(3);
  if (!k && /^Digit\d$/.test(e.code)) k = e.code.slice(5);
  if (!k && e.key && e.key.length === 1 && /[a-z0-9]/i.test(e.key)) k = e.key.toUpperCase();
  if (!k) return null;
  return (e.ctrlKey || e.metaKey) ? 'CTRL+' + k : k;
}

/** Partes de una combinación para iluminar el teclado: "CTRL+Num −" → ["CTRL", "Num −"]. */
export const comboParts = combo => (combo.startsWith('CTRL+') ? ['CTRL', combo.slice(5)] : [combo]);

/** Atajos de una pantalla que responden a la combinación. */
export const shortcutsFor = (stateId, combo) =>
  ALL_SHORTCUTS.filter(s => s.state === stateId && s.keys.includes(combo));

export const stateById = id => KEY_STATES.find(s => s.id === id);

/** Keycaps HTML para una lista de combinaciones alternativas. */
export function keycaps(keys) {
  return keys.map(c => comboParts(c).map(p => `<kbd>${p}</kbd>`).join('<span class="plus">+</span>')).join('<span class="or">o</span>');
}
