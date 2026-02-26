/**
 * config/env.js
 *
 * Zentrale Domain- und Umgebungskonfiguration.
 * Alle URLs werden von dieser einzigen Quelle abgeleitet.
 *
 * Umschalten zwischen Staging und Produktion:
 *   VISCHER_BASE_DOMAIN=https://www.vischer.com          # Produktion
 *   VISCHER_BASE_DOMAIN=https://staging.vischer.com      # Staging
 *
 * Ohne ENV-Variable: Fallback auf Produktion (sicher für Deployment).
 */

"use strict";

const DEFAULT_DOMAIN = "https://www.vischer.com";

const BASE_DOMAIN = (process.env.VISCHER_BASE_DOMAIN || DEFAULT_DOMAIN).replace(/\/$/, "");

/**
 * Sprachpräfixe, die der Domain vorangestellt werden.
 * Deutsch hat keinen Präfix (ist die Default-Sprache der Domain).
 */
const LANG_PREFIXES = {
  de: "",
  en: "/en",
  fr: "/fr",
  zh: "/zh",
};

/**
 * Gibt die vollständige Basis-URL für eine Sprache zurück.
 * @param {string} lang - Sprachcode ('de' | 'en' | 'fr' | 'zh')
 * @returns {string} z.B. "https://www.vischer.com/en"
 */
function baseUrl(lang) {
  const prefix = LANG_PREFIXES[lang];
  if (prefix === undefined) {
    throw new Error(`Unbekannte Sprache: "${lang}". Erlaubt: ${Object.keys(LANG_PREFIXES).join(", ")}`);
  }
  return BASE_DOMAIN + prefix;
}

/**
 * Erstellt eine vollständige URL aus Basis-Domain + Pfad.
 * @param {string} path - Pfad, z.B. "/dienstleistungen/arbeitsrecht/"
 * @returns {string}
 */
function url(path) {
  return BASE_DOMAIN + path;
}

/**
 * Gibt an, ob wir uns auf Staging befinden.
 * @returns {boolean}
 */
function isStaging() {
  return BASE_DOMAIN !== DEFAULT_DOMAIN;
}

module.exports = { BASE_DOMAIN, LANG_PREFIXES, baseUrl, url, isStaging };
