// constants.js
// Dependency-free leaf: imports nothing from the rest of the module so it can be
// imported anywhere without circular-import risk (CLAUDE.md §1).

/** Module id — single source of truth, mirrors the `id` in module.json. */
export const MODULE_ID = "rpgnextcriticos";

/** Hard-dependency module (a `requires` in module.json) that renders the 3D card. */
export const EPIC_CARDS_MODULE_ID = "epic-3d-card-reveal";

/** Number of card images shipped per critical type (images/<folder>/01.jpg … 52.jpg). */
export const CARDS_PER_DECK = 52;

/**
 * Canonical critical types → the shipped card art folder and themed back image.
 * The public API accepts "sucesso"/"falha" (plus aliases) which resolve to these keys.
 * @type {Record<string, { folder: string, back: string }>}
 */
export const CRITICAL_TYPES = {
  sucesso: {
    folder: `modules/${MODULE_ID}/images/acerto`,
    back: `modules/${MODULE_ID}/images/dadosacerto/costas-cartas-acerto-critico.jpg`
  },
  falha: {
    folder: `modules/${MODULE_ID}/images/falha`,
    back: `modules/${MODULE_ID}/images/dadosfalha/costas-cartas-falha-critica.jpg`
  }
};
