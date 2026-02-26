/**
 * config/teams.js
 *
 * Team-URL-Builder und Team-Finder-Konfiguration.
 *
 * DESIGN-ENTSCHEIDUNG (Behobenes Problem aus der alten Config):
 * Alt: URL-Builder als JS-Funktion als String — nicht aufrufbar, nicht testbar.
 *      team_member_base_urls enthielt doppelte Pfadsegmente (CMS-Artefakt).
 *
 * Neu: Echte JS-Funktion. Basis-URLs aus env.js + SECTION_PATHS abgeleitet.
 *      Die doppelten Pfadsegmente (.../teammitglieder-finden/teammitglieder-finden/)
 *      wurden beibehalten — sie sind ein bekanntes CMS-Routing-Muster bei Typo3
 *      und müssen validiert werden, wenn die neue Sitemap vorliegt.
 *
 * QUERY-PARAMETER-STRUKTUR:
 * Der Team-Finder verwendet Typo3 ll_catalog Plugin:
 *   tx_llcatalog_pi[filters][services][]   → Numeric Service ID
 *   tx_llcatalog_pi[filters][position][]   → 'all'
 *   tx_llcatalog_pi[filters][practice_areas][] → 'all'
 *   tx_llcatalog_pi[filters][location][]   → 'all'
 *   #c4372-filters                          → Anchor für direkte Filteransicht
 */

"use strict";

const { BASE_DOMAIN } = require("./env.js");
const { getServiceById } = require("./services.js");

// ---------------------------------------------------------------------------
// BASIS-PFADE FÜR DEN TEAM-FINDER
// NOTE: Die doppelten Segmente (z.B. .../teammitglieder-finden/teammitglieder-finden/)
//       sind ein bekanntes Typo3-Verhalten und müssen gegen die neue Sitemap geprüft werden.
// ---------------------------------------------------------------------------
const TEAM_FINDER_PATHS = Object.freeze({
  de: "/team/teammitglieder-finden/teammitglieder-finden/",
  en: "/en/team/find-team-members/find-team-members/",
  fr: "/fr/equipe/trouver-des-membres-de-lequipe/trouver-des-membres-de-lequipe/",
  zh: "/zh/%E4%B8%93%E4%B8%9A%E5%9B%A2%E9%98%9F/%E6%9F%A5%E8%AF%A2%E5%BE%8B%E5%B8%88/%E6%9F%A5%E8%AF%A2%E5%BE%8B%E5%B8%88/",
});

// Query-Parameter-Template (URL-kodiert)
const TEAM_FILTER_PARAMS = (serviceNumericId) =>
  `?tx_llcatalog_pi%5Bfilters%5D%5Bservices%5D%5B%5D=${serviceNumericId}` +
  `&tx_llcatalog_pi%5Bfilters%5D%5Bposition%5D%5B%5D=all` +
  `&tx_llcatalog_pi%5Bfilters%5D%5Bpractice_areas%5D%5B%5D=all` +
  `&tx_llcatalog_pi%5Bfilters%5D%5Blocation%5D%5B%5D=all` +
  `#c4372-filters`;

/**
 * Baut die vollständige Team-Finder-URL für einen Service und eine Sprache.
 *
 * @param {string} serviceId - Kanonischer Service-Key (z.B. "employment_law")
 * @param {string} lang - Sprachcode ('de' | 'en' | 'fr' | 'zh')
 * @returns {string|null} Vollständige URL oder null, wenn Service unbekannt
 *
 * @example
 * buildTeamUrl("employment_law", "de")
 * // → "https://www.vischer.com/team/teammitglieder-finden/...?...=725..."
 */
function buildTeamUrl(serviceId, lang) {
  const service = getServiceById(serviceId);
  if (!service) {
    return null;
  }
  const basePath = TEAM_FINDER_PATHS[lang];
  if (!basePath) {
    return null;
  }
  return BASE_DOMAIN + basePath + TEAM_FILTER_PARAMS(service.numericId);
}

/**
 * Baut die Team-Finder-URL direkt aus einer numeric ID (Fallback).
 * Nützlich, wenn serviceId nicht bekannt, aber numeric ID aus dem RAG-System kommt.
 *
 * @param {string|number} numericId
 * @param {string} lang
 * @returns {string|null}
 */
function buildTeamUrlByNumericId(numericId, lang) {
  const basePath = TEAM_FINDER_PATHS[lang];
  if (!basePath) return null;
  return BASE_DOMAIN + basePath + TEAM_FILTER_PARAMS(String(numericId));
}

/**
 * Gibt die Basis-URL des Team-Finders (ohne Filter) zurück.
 * Für allgemeine Team-Verweise ohne Fachbereichs-Filter.
 *
 * @param {string} lang
 * @returns {string}
 */
function getTeamFinderBaseUrl(lang) {
  const basePath = TEAM_FINDER_PATHS[lang] ?? TEAM_FINDER_PATHS.de;
  return BASE_DOMAIN + basePath;
}

module.exports = {
  TEAM_FINDER_PATHS,
  buildTeamUrl,
  buildTeamUrlByNumericId,
  getTeamFinderBaseUrl,
};
