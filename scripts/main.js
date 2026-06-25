// main.js
// Public API for RPG Next - Críticos. Delegates all visual presentation (the 3D
// card reveal and its chat message) to the epic-3d-card-reveal module.

import { MODULE_ID, EPIC_CARDS_MODULE_ID, CARDS_PER_DECK, CRITICAL_TYPES, SETTINGS } from "./constants.js";
import { refreshFloatingButton } from "./floating-button.js";

/**
 * Maps every accepted public-API argument to a canonical {@link CRITICAL_TYPES} key.
 * @type {Record<string, string>}
 */
const TYPE_ALIASES = {
  sucesso: "sucesso",
  acerto: "sucesso",
  falha: "falha",
  erro: "falha"
};

/**
 * Draws a random critical card image and reveals it to every client through the
 * Epic 3D Card Reveal module. No deck state is touched — it is a pure random pick
 * over the shipped card art, so the same card may come up more than once (expected).
 * @param {string} type "sucesso" | "falha" (aliases "acerto" | "erro"); case-insensitive.
 * @returns {void}
 */
function showCritical(type) {
  const key = TYPE_ALIASES[String(type ?? "").trim().toLowerCase()];
  if (!key) {
    ui.notifications.warn(`RPGNext.Critical: tipo inválido "${type}". Use "sucesso" ou "falha".`);
    return;
  }

  // epic-3d-card-reveal exposes its API as the global `EpicCards` (assigned at the
  // `ready` hook) and mirrors it on the module's `.api`. Resolve defensively.
  const epic = game.modules.get(EPIC_CARDS_MODULE_ID);
  const api = epic?.active ? (globalThis.EpicCards ?? epic.api) : null;
  if (!api?.Display) {
    ui.notifications.error(`RPGNext.Critical: o módulo "${EPIC_CARDS_MODULE_ID}" não está instalado/ativo.`);
    return;
  }

  const { folder, back } = CRITICAL_TYPES[key];
  const n = Math.floor(Math.random() * CARDS_PER_DECK) + 1;
  const front = `${folder}/${String(n).padStart(2, "0")}.jpg`;

  // Appearance (glow, sound, reveal style) is intentionally left to the EpicCards
  // world settings / per-user config; we only set the themed back and share to all.
  api.Display({ front, back }).render(true);
}

/**
 * Expose the public global API requested by the module spec: `RPGNext.Critical(...)`,
 * and register the settings backing the players' floating critical panel.
 * Registered at `init` so the namespace exists early; the API body runs on demand,
 * well after `ready`, when EpicCards and the card assets are available.
 */
Hooks.once("init", () => {
  globalThis.RPGNext ??= {};
  globalThis.RPGNext.Critical = showCritical;
  game.modules.get(MODULE_ID).api = globalThis.RPGNext;

  // GM-only world toggle for the players' floating critical panel (on by default).
  // World scope means only the GM sees/edits it in the settings menu; its onChange
  // fires on every client, so toggling it instantly shows/hides the panel for players.
  game.settings.register(MODULE_ID, SETTINGS.SHOW_FLOATING_BUTTON, {
    name: "Botões flutuantes de críticos",
    hint: "Exibe o painel flutuante de Acerto Crítico e Erro Crítico para os jogadores. Não aparece para o Mestre.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => refreshFloatingButton()
  });

  // Per-client persisted panel position (hidden from the settings menu).
  game.settings.register(MODULE_ID, SETTINGS.FLOATING_BUTTON_POSITION, {
    scope: "client",
    config: false,
    type: Object,
    default: { left: 20, top: 120 }
  });
});

/**
 * Build the players' floating panel once the world and settings are ready. The
 * panel never appears for the GM; {@link refreshFloatingButton} enforces this.
 */
Hooks.once("ready", () => {
  refreshFloatingButton();
});
