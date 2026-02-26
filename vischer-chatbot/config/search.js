/**
 * config/search.js
 *
 * Such-URL-Konfiguration.
 * URLs werden aus der BASE_DOMAIN in env.js abgeleitet.
 *
 * DESIGN-ENTSCHEIDUNG:
 * Alt: Vollständige hardcodierte Such-URLs pro Sprache.
 * Neu: Nur die sprachspezifischen Pfade; Domain kommt aus env.js.
 *      buildSearchUrl() kombiniert beides.
 */

"use strict";

const { BASE_DOMAIN } = require("./env.js");

// ---------------------------------------------------------------------------
// SUCH-PFADE (sprachspezifisch, relativ zur Domain)
// ---------------------------------------------------------------------------
const SEARCH_PATHS = Object.freeze({
  de: "/suche/",
  en: "/en/search/",
  fr: "/fr/recherche/",
  zh: "/zh/%E6%A3%80%E7%B4%A2/",
});

// Typo3 kesearch Plugin Query-Parameter (shared, sprachunabhängig)
const SEARCH_QUERY_PREFIX = "?tx_kesearch_pi1%5Bpage%5D=1&tx_kesearch_pi1%5BresetFilters%5D=0&query=";

/**
 * Baut eine vollständige Such-URL.
 *
 * @param {string} lang    - Sprachcode ('de' | 'en' | 'fr' | 'zh')
 * @param {string} keyword - Suchbegriff (wird URL-kodiert)
 * @returns {string}
 *
 * @example
 * buildSearchUrl("de", "Blockchain")
 * // → "https://www.vischer.com/suche/?tx_kesearch_pi1%5Bpage%5D=1&...&query=Blockchain"
 */
function buildSearchUrl(lang, keyword) {
  const path = SEARCH_PATHS[lang] ?? SEARCH_PATHS.de;
  const encodedKeyword = encodeURIComponent(keyword);
  return BASE_DOMAIN + path + SEARCH_QUERY_PREFIX + encodedKeyword;
}

/**
 * Gibt die Basis-Such-URL (ohne Query) zurück.
 * @param {string} lang
 * @returns {string}
 */
function getSearchBaseUrl(lang) {
  const path = SEARCH_PATHS[lang] ?? SEARCH_PATHS.de;
  return BASE_DOMAIN + path + SEARCH_QUERY_PREFIX;
}

module.exports = {
  SEARCH_PATHS,
  SEARCH_QUERY_PREFIX,
  buildSearchUrl,
  getSearchBaseUrl,
};
