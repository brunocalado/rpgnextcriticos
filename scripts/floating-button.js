// floating-button.js
// A small draggable panel, appended to <body>, that exposes the two critical
// triggers (Acerto Crítico / Erro Crítico) by calling the public RPGNext.Critical
// API. It is a player-only affordance: the GM controls its visibility through a
// world setting but never sees the panel itself. The panel is clamped to the
// viewport so it can never be dragged (or resized) off-screen — i.e. it stays
// locked inside the visible zone.

import { MODULE_ID, SETTINGS } from "./constants.js";

/** DOM id of the singleton floating panel element. */
const PANEL_ID = "rpgnextcriticos-floating";

/** Keep the panel at least this many pixels from every viewport edge when clamping. */
const SAFETY_MARGIN = 10;

/** Pointer travel (px) before a press on the handle is treated as a real drag. */
const DRAG_THRESHOLD = 3;

/**
 * The buttons rendered in the panel, in display order. `type` is forwarded
 * verbatim to the public `RPGNext.Critical(type)` API.
 * @type {ReadonlyArray<{type: string, label: string, icon: string, variant: string}>}
 */
const CRITICAL_BUTTONS = [
  { type: "sucesso", label: "Acerto Crítico", icon: "fa-solid fa-dice-d20", variant: "success" },
  { type: "falha", label: "Erro Crítico", icon: "fa-solid fa-skull-crossbones", variant: "failure" }
];

/**
 * Clamp a desired top-left position so the panel stays fully inside the viewport.
 * @param {number} left Desired left offset, px.
 * @param {number} top Desired top offset, px.
 * @param {HTMLElement} panel The panel being positioned (read for its measured size).
 * @returns {{left: number, top: number}} The clamped position.
 */
function clampToViewport(left, top, panel) {
  const maxLeft = window.innerWidth - panel.offsetWidth - SAFETY_MARGIN;
  const maxTop = window.innerHeight - panel.offsetHeight - SAFETY_MARGIN;
  return {
    left: Math.min(Math.max(SAFETY_MARGIN, left), Math.max(SAFETY_MARGIN, maxLeft)),
    top: Math.min(Math.max(SAFETY_MARGIN, top), Math.max(SAFETY_MARGIN, maxTop))
  };
}

/**
 * Invoke the public critical API. Defensive because the panel only exists at
 * runtime (well after `init`), by which point the global is always registered.
 * @param {string} type "sucesso" | "falha" — forwarded to `RPGNext.Critical`.
 * @returns {void}
 */
function triggerCritical(type) {
  const critical = globalThis.RPGNext?.Critical;
  if (typeof critical !== "function") {
    ui.notifications.error("RPGNext.Critical não está disponível.");
    return;
  }
  critical(type);
}

/**
 * Build the panel DOM. The element carries the module id as a class so that this
 * body-level node stays within the module's CSS scope (CLAUDE.md §12).
 * @returns {{panel: HTMLDivElement, handle: HTMLDivElement}} Root panel and drag handle.
 */
function buildPanel() {
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.classList.add(MODULE_ID);

  const handle = document.createElement("div");
  handle.className = "rpgnextcriticos-fb-handle";
  handle.innerHTML = `<i class="fa-solid fa-grip-lines"></i><span>Críticos</span>`;
  panel.appendChild(handle);

  const group = document.createElement("div");
  group.className = "rpgnextcriticos-fb-buttons";
  for (const cfg of CRITICAL_BUTTONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `rpgnextcriticos-fb-btn ${cfg.variant}`;
    btn.innerHTML = `<i class="${cfg.icon}"></i><span>${cfg.label}</span>`;
    btn.addEventListener("click", () => triggerCritical(cfg.type));
    group.appendChild(btn);
  }
  panel.appendChild(group);

  return { panel, handle };
}

/**
 * Wire dragging (handle only) and resize re-clamping. All window-level listeners
 * share one AbortController so they are removed together when the panel is torn
 * down, preventing listener accumulation across re-renders.
 * @param {HTMLElement} panel The panel being moved.
 * @param {HTMLElement} handle The drag-handle child.
 * @param {AbortSignal} signal Abort signal shared by every window listener.
 * @returns {void}
 */
function wirePanel(panel, handle, signal) {
  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  handle.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = panel.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    handle.style.cursor = "grabbing";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
    hasMoved = true;
    const { left, top } = clampToViewport(initialLeft + dx, initialTop + dy, panel);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }, { signal });

  window.addEventListener("mouseup", async () => {
    if (!isDragging) return;
    isDragging = false;
    handle.style.cursor = "grab";
    if (!hasMoved) return;
    await game.settings.set(MODULE_ID, SETTINGS.FLOATING_BUTTON_POSITION, {
      left: parseInt(panel.style.left) || 0,
      top: parseInt(panel.style.top) || 0
    });
  }, { signal });

  // Re-clamp on viewport changes so the panel can never end up outside the zone.
  window.addEventListener("resize", () => {
    const { left, top } = clampToViewport(
      parseInt(panel.style.left) || 0,
      parseInt(panel.style.top) || 0,
      panel
    );
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }, { signal });
}

/**
 * Remove the panel (if present) and abort its window listeners.
 * @returns {void}
 */
function removePanel() {
  const existing = document.getElementById(PANEL_ID);
  if (!existing) return;
  existing._dragAbort?.abort();
  existing.remove();
}

/**
 * Create the panel, restore its clamped per-client position, and wire interactions.
 * @returns {void}
 */
function createPanel() {
  removePanel();

  const { panel, handle } = buildPanel();
  document.body.appendChild(panel);

  // Clamp the restored position to the current viewport so the panel never loads
  // off-screen (e.g. after a resolution change between sessions).
  const saved = game.settings.get(MODULE_ID, SETTINGS.FLOATING_BUTTON_POSITION);
  const { left, top } = clampToViewport(saved.left, saved.top, panel);
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;

  const controller = new AbortController();
  panel._dragAbort = controller;
  wirePanel(panel, handle, controller.signal);
}

/**
 * Reconcile the panel with current state: show it only for players when the
 * GM-controlled world setting is enabled; remove it otherwise (always for the GM).
 * Safe to call repeatedly — at `ready` and from the setting's `onChange`.
 * @returns {void}
 */
export function refreshFloatingButton() {
  const show = !game.user.isGM && game.settings.get(MODULE_ID, SETTINGS.SHOW_FLOATING_BUTTON);
  if (show) createPanel();
  else removePanel();
}
