#!/usr/bin/env node
/**
 * scripts/import-sitemap.js
 *
 * Sitemap-Importer: Analysiert eine XML-Sitemap und vergleicht sie mit der
 * bestehenden Konfiguration in config/services.js und config/services.js.
 *
 * VERWENDUNG:
 *   node scripts/import-sitemap.js --sitemap <URL oder Dateipfad>
 *   node scripts/import-sitemap.js --sitemap https://staging.vischer.com/sitemap.xml
 *   node scripts/import-sitemap.js --sitemap ./sitemap.xml
 *   node scripts/import-sitemap.js --sitemap ./sitemap.xml --lang de
 *
 * OUTPUT:
 *   - Migration-Report (Diff: unverändert / geändert / neu / entfernt)
 *   - Optional: aktualisierte services.js-Einträge als Vorschlag
 *
 * ABHÄNGIGKEITEN: Nur Node.js Built-ins (https, http, fs, path, readline)
 */

"use strict";

const https    = require("https");
const http     = require("http");
const fs       = require("fs");
const path     = require("path");

const { SERVICES, SECTION_PATHS } = require("../config/services.js");
const { BASE_DOMAIN }             = require("../config/env.js");

// ---------------------------------------------------------------------------
// HILFSFUNKTIONEN
// ---------------------------------------------------------------------------

/** Lädt eine URL und gibt den Body als String zurück. */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

/** Lädt eine lokale Datei als String. */
function readFile(filePath) {
  return fs.readFileSync(path.resolve(filePath), "utf-8");
}

/**
 * Simplex XML-Sitemap-Parser (ohne externe Abhängigkeiten).
 * Extrahiert alle <loc>-Einträge.
 *
 * @param {string} xml - Sitemap-XML-Inhalt
 * @returns {string[]} - Array von URLs
 */
function parseSitemapXml(xml) {
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/gs);
  const urls = [];
  for (const match of matches) {
    const url = match[1].trim();
    if (url) urls.push(url);
  }
  return urls;
}

/**
 * Normalisiert eine URL zu einem Pfad (ohne Domain, ohne trailing slash).
 * @param {string} url
 * @param {string} domain - z.B. "https://www.vischer.com"
 * @returns {string} z.B. "/dienstleistungen/arbeitsrecht"
 */
function urlToPath(url, domain) {
  let path = url.replace(domain, "").replace(/\/$/, "") || "/";
  // URL-dekodieren für lesbaren Vergleich
  try { path = decodeURIComponent(path); } catch (_) { /* ungültige Kodierung — behalten */ }
  return path;
}

// ---------------------------------------------------------------------------
// DIFF-BERECHNUNG
// ---------------------------------------------------------------------------

/**
 * Vergleicht Sitemap-URLs mit der bestehenden Konfiguration.
 *
 * @param {string[]} sitemapUrls - URLs aus der neuen Sitemap
 * @param {string}   domain      - Basis-Domain
 * @returns {{
 *   unchanged: string[],
 *   changed: Array<{canonical: string, configured: string, actual: string}>,
 *   new: string[],
 *   removed: Array<{canonical: string, configured: string}>
 * }}
 */
function computeDiff(sitemapUrls, domain) {
  const sitemapPaths = new Set(sitemapUrls.map((u) => urlToPath(u, domain)));

  // Alle konfigurierten Pfade (Service-Pfade + Section-Pfade)
  const configuredPaths = new Map(); // path → description

  for (const service of SERVICES) {
    for (const [lang, servicePath] of Object.entries(service.paths)) {
      let decoded;
      try { decoded = decodeURIComponent(servicePath); } catch (_) { decoded = servicePath; }
      configuredPaths.set(decoded, `service:${service.id}[${lang}]`);
    }
  }

  for (const [lang, sections] of Object.entries(SECTION_PATHS)) {
    for (const [key, sectionPath] of Object.entries(sections)) {
      let decoded;
      try { decoded = decodeURIComponent(sectionPath); } catch (_) { decoded = sectionPath; }
      configuredPaths.set(decoded, `section:${key}[${lang}]`);
    }
  }

  const result = {
    unchanged: [],
    changed:   [],
    new_in_sitemap: [],
    removed_from_sitemap: [],
  };

  // Prüfe konfigurierte Pfade gegen Sitemap
  for (const [configPath, description] of configuredPaths.entries()) {
    if (sitemapPaths.has(configPath)) {
      result.unchanged.push(`${configPath}  (${description})`);
    } else {
      result.removed_from_sitemap.push({ path: configPath, description });
    }
  }

  // Finde neue Pfade in der Sitemap (nicht in der Config)
  for (const sitemapPath of sitemapPaths) {
    // Nur Service/Dienstleistungs-Pfade analysieren (keine Blog-Posts etc.)
    const isRelevant =
      sitemapPath.includes("/dienstleistungen/") ||
      sitemapPath.includes("/services/") ||
      sitemapPath.includes("/team/") ||
      sitemapPath.includes("/equipe/") ||
      sitemapPath.includes("/karriere/") ||
      sitemapPath.includes("/careers/") ||
      sitemapPath.includes("/carrieres/") ||
      sitemapPath.includes("/kontakt") ||
      sitemapPath.includes("/contact");

    if (isRelevant && !configuredPaths.has(sitemapPath)) {
      result.new_in_sitemap.push(sitemapPath);
    }
  }

  return result;
}

/**
 * Gibt einen formatierten Migration-Report aus.
 * @param {Object} diff
 */
function printReport(diff, domain) {
  console.log("\n" + "=".repeat(70));
  console.log("VISCHER SITEMAP MIGRATION REPORT");
  console.log(`Domain: ${domain}`);
  console.log(`Datum:  ${new Date().toISOString()}`);
  console.log("=".repeat(70));

  console.log(`\n✅ UNVERÄNDERT (${diff.unchanged.length} Pfade)`);
  if (diff.unchanged.length === 0) {
    console.log("   (keine)");
  } else {
    diff.unchanged.forEach((p) => console.log(`   ${p}`));
  }

  console.log(`\n🆕 NEU IN SITEMAP — NICHT in Config (${diff.new_in_sitemap.length} Pfade)`);
  console.log("   → Diese Pfade müssen ggf. in config/services.js oder config/services.js ergänzt werden.");
  if (diff.new_in_sitemap.length === 0) {
    console.log("   (keine)");
  } else {
    diff.new_in_sitemap.forEach((p) => console.log(`   ${p}`));
  }

  console.log(`\n❌ IN CONFIG, ABER NICHT IN SITEMAP (${diff.removed_from_sitemap.length} Pfade)`);
  console.log("   → Diese Pfade könnten gelöscht, umbenannt oder umgezogen sein.");
  if (diff.removed_from_sitemap.length === 0) {
    console.log("   (keine)");
  } else {
    diff.removed_from_sitemap.forEach(({ path, description }) =>
      console.log(`   ${path}  (${description})`)
    );
  }

  console.log("\n" + "=".repeat(70));
  console.log("EMPFOHLENE AKTIONEN:");
  if (diff.removed_from_sitemap.length > 0) {
    console.log("1. Prüfe, ob entfernte Pfade umgezogen sind (301-Redirect) oder gelöscht wurden.");
    console.log("2. Aktualisiere config/services.js mit neuen Pfaden.");
  }
  if (diff.new_in_sitemap.length > 0) {
    console.log("3. Prüfe neue Sitemap-Pfade: neue Services, neue Sprachversionen?");
    console.log("4. Ergänze fehlende Einträge in config/services.js.");
  }
  if (diff.removed_from_sitemap.length === 0 && diff.new_in_sitemap.length === 0) {
    console.log("Keine Aktionen erforderlich — Config ist aktuell.");
  }
  console.log("=".repeat(70) + "\n");
}

// ---------------------------------------------------------------------------
// HAUPTPROGRAMM
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const sitemapIndex = args.indexOf("--sitemap");

  if (sitemapIndex === -1 || !args[sitemapIndex + 1]) {
    console.error("VERWENDUNG: node scripts/import-sitemap.js --sitemap <URL oder Pfad>");
    console.error("BEISPIEL:   node scripts/import-sitemap.js --sitemap https://staging.vischer.com/sitemap.xml");
    process.exit(1);
  }

  const sitemapSource = args[sitemapIndex + 1];
  const domain = BASE_DOMAIN;

  console.log(`Lade Sitemap von: ${sitemapSource}`);
  console.log(`Vergleiche mit Domain: ${domain}`);

  let xml;
  try {
    if (sitemapSource.startsWith("http://") || sitemapSource.startsWith("https://")) {
      xml = await fetchUrl(sitemapSource);
    } else {
      xml = readFile(sitemapSource);
    }
  } catch (err) {
    console.error(`Fehler beim Laden der Sitemap: ${err.message}`);
    process.exit(1);
  }

  const urls = parseSitemapXml(xml);
  console.log(`${urls.length} URLs in der Sitemap gefunden.`);

  if (urls.length === 0) {
    console.warn("⚠️  Keine URLs gefunden. Ist die Sitemap eine Index-Sitemap (sitemapindex)?");
    console.warn("   Verwende stattdessen die einzelne Sprach-Sitemap, z.B. /sitemap-de.xml");
    process.exit(1);
  }

  const diff = computeDiff(urls, domain);
  printReport(diff, domain);

  // Exit Code: 1 wenn es Abweichungen gibt (nützlich für CI)
  if (diff.removed_from_sitemap.length > 0 || diff.new_in_sitemap.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unerwarteter Fehler:", err);
  process.exit(1);
});
