/**
 * @typedef {'Arcade' | 'Puzzle' | 'Action' | 'Classic' | 'Retro'} GameCategory
 */

/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {GameCategory} category
 * @property {string} description
 * @property {string} thumbnailIcon
 * @property {string} accentColor
 * @property {string} iframeUrl
 * @property {string[]} controls
 * @property {string[]} tags
 * @property {boolean} [featured]
 */

/**
 * @typedef {Object} CloakProfile
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} icon
 */

export const CATEGORIES = ['Arcade', 'Puzzle', 'Action', 'Classic', 'Retro'];
