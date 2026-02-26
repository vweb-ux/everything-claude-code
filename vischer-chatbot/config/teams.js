/**
 * config/teams.js
 *
 * Team-URL-Builder — migriert auf neues Headless Frontend (Strapi).
 *
 * MIGRATION (TYPO3 → Strapi/Headless):
 * Alt: TYPO3 ll_catalog Plugin mit numerischen Filter-IDs und URL-codierten Parametern.
 *      ?tx_llcatalog_pi[filters][services][]=<numericId>&...#c4372-filters
 *
 * Neu: Saubere Slug-basierte URL.
 *      /team?expertise=<slug>
 *
 * Der Slug kommt aus dem `slug`-Feld des jeweiligen Service-Eintrags in services.js.
 * Language-Prefix wird via LANG_PREFIXES aus env.js vorangestellt.
 */

"use strict";

const { BASE_DOMAIN, LANG_PREFIXES } = require("./env.js");
const { getServiceById } = require("./services.js");

// ---------------------------------------------------------------------------
// BASIS-PFAD FÜR DEN TEAM-FINDER
// Gleiches Pfad-Segment für alle Sprachen; LANG_PREFIXES aus env.js
// stellt /en/, /fr/, /zh/ voran (DE hat keinen Prefix).
// ---------------------------------------------------------------------------
const TEAM_BASE_PATH = "/team";

/**
 * Baut die vollständige Team-Finder-URL für einen Service und eine Sprache.
 *
 * @param {string} serviceId - Kanonischer Service-Key (z.B. "employment_law")
 * @param {string} lang - Sprachcode ('de' | 'en' | 'fr' | 'zh')
 * @returns {string|null} Vollständige URL oder null, wenn Service/Sprache unbekannt
 *
 * @example
 * buildTeamUrl("employment_law", "de")
 * // → "https://www.vischer.com/team?expertise=employment-law"
 *
 * buildTeamUrl("employment_law", "en")
 * // → "https://www.vischer.com/en/team?expertise=employment-law"
 */
function buildTeamUrl(serviceId, lang) {
  const service = getServiceById(serviceId);
  if (!service) return null;

  const prefix = LANG_PREFIXES[lang];
  if (prefix === undefined) return null;

  return BASE_DOMAIN + prefix + TEAM_BASE_PATH + "?expertise=" + service.slug;
}

/**
 * Baut die Team-Finder-URL direkt aus einem Slug (Fallback).
 * Nützlich, wenn serviceId nicht bekannt, aber der Slug aus dem RAG-System kommt.
 *
 * @param {string} slug - Expertise-Slug (z.B. "employment-law")
 * @param {string} lang
 * @returns {string|null}
 */
function buildTeamUrlBySlug(slug, lang) {
  if (!slug) return null;
  const prefix = LANG_PREFIXES[lang];
  if (prefix === undefined) return null;
  return BASE_DOMAIN + prefix + TEAM_BASE_PATH + "?expertise=" + slug;
}

/**
 * Gibt die Basis-URL des Team-Finders (ohne Expertise-Filter) zurück.
 * Für allgemeine Team-Verweise ohne Fachbereichs-Filter.
 *
 * @param {string} lang
 * @returns {string}
 */
function getTeamFinderBaseUrl(lang) {
  const prefix = LANG_PREFIXES[lang] ?? "";
  return BASE_DOMAIN + prefix + TEAM_BASE_PATH;
}

module.exports = {
  TEAM_BASE_PATH,
  buildTeamUrl,
  buildTeamUrlBySlug,
  getTeamFinderBaseUrl,
};
