// ============================================================================
// KAYFO GAME CATALOG
// The set of Kayfo H5 (PlayCanvas) games surfaced by this mini-app POC.
// Each `path` is appended to config.KAYFO_PLAY_HOST to build the web-view src.
// ============================================================================

import { config } from './config';

/**
 * @typedef {Object} KayfoGame
 * @property {string} id        Stable slug used for routing / analytics.
 * @property {string} title     Display name.
 * @property {string} category  Portal category label.
 * @property {string} tagline   Short marketing line.
 * @property {string} path      Path under KAYFO_PLAY_HOST (leading slash).
 * @property {string} accent    Brand accent color for the card.
 */

/** @type {KayfoGame[]} */
export const GAMES = [
  {
    id: 'afrokick-tournament',
    title: 'Afro Kick Tournament',
    category: 'Best Picks',
    tagline: 'Penalty-shootout football with an African twist.',
    path: '/Kayfo/20250913_afrokicktournament/',
    accent: '#F16E00',
  },
];

/**
 * Build the absolute web-view URL for a game.
 * @param {KayfoGame} game
 * @returns {string}
 */
export function buildGameUrl(game) {
  return `${config.KAYFO_PLAY_HOST}${game.path}`;
}

/**
 * Look up a game by its id.
 * @param {string} id
 * @returns {KayfoGame | undefined}
 */
export function getGameById(id) {
  return GAMES.find((g) => g.id === id);
}
