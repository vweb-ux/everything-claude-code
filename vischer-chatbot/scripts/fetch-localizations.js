#!/usr/bin/env node
/**
 * scripts/fetch-localizations.js
 *
 * Fetcht Expertise-Lokalizations von Strapi v5 und gibt
 * ein fertiges `paths`-Mapping für services.js aus.
 *
 * AUSFÜHREN (lokal, mit Node.js 18+):
 *   STRAPI_TOKEN=<token> node scripts/fetch-localizations.js
 *
 * OUTPUT:
 *   Druckt für jede Expertise das paths-Objekt (de/en/fr/zh)
 *   bereit zum Einfügen in services.js.
 */

"use strict";

const STRAPI_BASE = process.env.STRAPI_URL || "https://d941-backend.demios.xyz/api";
const TOKEN = process.env.STRAPI_TOKEN;

if (!TOKEN) {
  console.error("ERROR: STRAPI_TOKEN environment variable not set.");
  console.error("Usage: STRAPI_TOKEN=<token> node scripts/fetch-localizations.js");
  process.exit(1);
}

// Kanonische ID-Map: documentId → canonical service id
// (aus dem EN-Strapi-Dump abgeleitet)
const DOC_ID_TO_SERVICE = {
  "exp-1":    "legal_profession_law",
  "exp-105":  "employment_law",
  "exp-209":  "banking_finance",
  "exp-313":  "pension_funds",
  "exp-417":  "china_desk",
  "exp-521":  "data_ai",
  "exp-625":  "energy",
  "exp-729":  "corporate_commercial",
  "exp-833":  "intellectual_property",
  "exp-937":  "immigration",
  "exp-1041": "real_estate",
  "exp-1145": "antitrust",
  "exp-1249": "mergers_acquisitions",
  "exp-1353": "notaries",
  "exp-1457": "private_equity",
  "exp-1561": "private_clients",
  "exp-1665": "litigation",
  "exp-1769": "restructuring",
  "exp-1873": "sports_business",
  "exp-1977": "startup_desk",
  "exp-2081": "tax",
  "exp-2185": "esg",
  "exp-2289": "transport_aviation",
  "exp-2393": "white_collar_crime",
  "exp-2497": "health_care",
  "exp-2601": "ict_emerging_tech",
  "exp-2705": "judicial_assistance",
  "exp-2809": "investigations_ediscovery",
  "exp-2913": "regulatory_compliance",
  "exp-3017": "media_entertainment",
  "exp-3121": "public_sector",
  "exp-3225": "life_sciences",
  "oxw66n5mjjydpmadfgrvq6x3": "insurance",
};

async function fetchExpertises(locale) {
  const url = `${STRAPI_BASE}/expertises?locale=${locale}&pagination[limit]=100&fields[0]=title&fields[1]=slug&fields[2]=locale&fields[3]=documentId`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for locale=${locale}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data;
}

async function main() {
  console.error("Fetching expertises for all locales...\n");

  const [enData, deData, frData, zhData] = await Promise.all([
    fetchExpertises("en"),
    fetchExpertises("de"),
    fetchExpertises("fr"),
    fetchExpertises("zh"),
  ]);

  // Baue Map: documentId → slug pro Locale
  function buildSlugMap(data) {
    const map = {};
    for (const item of data) {
      map[item.documentId] = item.slug;
    }
    return map;
  }

  const enSlugs = buildSlugMap(enData);
  const deSlugs = buildSlugMap(deData);
  const frSlugs = buildSlugMap(frData);
  const zhSlugs = buildSlugMap(zhData);

  // Sammle alle documentIds (aus EN als Master)
  const results = {};
  for (const item of enData) {
    const docId = item.documentId;
    const serviceId = DOC_ID_TO_SERVICE[docId];
    if (!serviceId) {
      console.error(`WARN: unbekannte documentId: ${docId} (title: ${item.title})`);
      continue;
    }
    results[serviceId] = {
      documentId: docId,
      title_en: item.title,
      paths: {
        de: deSlugs[docId] ? `/expertise/${deSlugs[docId]}` : `/expertise/${item.slug}`,
        en: `/expertise/${item.slug}`,
        fr: frSlugs[docId] ? `/expertise/${frSlugs[docId]}` : `/expertise/${item.slug}`,
        zh: zhSlugs[docId] ? `/expertise/${zhSlugs[docId]}` : `/expertise/${item.slug}`,
      },
    };
  }

  // Output: Tabellarisch für Überprüfung
  console.error("=== LOCALE SLUG MAP ===\n");
  console.error("serviceId | EN slug | DE slug | FR slug | ZH slug");
  console.error("-".repeat(90));
  for (const [serviceId, data] of Object.entries(results)) {
    const de = data.paths.de.replace("/expertise/", "");
    const en = data.paths.en.replace("/expertise/", "");
    const fr = data.paths.fr.replace("/expertise/", "");
    const zh = data.paths.zh.replace("/expertise/", "");
    console.error(`${serviceId.padEnd(30)} | ${en.padEnd(40)} | ${de.padEnd(40)} | ${fr.padEnd(40)} | ${zh}`);
  }

  // Output: JSON für services.js Patch (stdout — kann in Datei umgeleitet werden)
  console.log("\n// === PATHS PATCH für services.js ===");
  console.log("// Kopiere die paths-Blöcke in den jeweiligen Service-Eintrag.\n");
  console.log("const PATHS_PATCH = " + JSON.stringify(
    Object.fromEntries(
      Object.entries(results).map(([id, d]) => [id, d.paths])
    ),
    null, 2
  ) + ";\n");

  // Output: Vollständige services.js paths-Einträge
  console.log("// === FERTIGE paths-BLÖCKE ===");
  for (const [serviceId, data] of Object.entries(results)) {
    console.log(`// ${serviceId}`);
    console.log(`    paths: {`);
    console.log(`      de: "${data.paths.de}",`);
    console.log(`      en: "${data.paths.en}",`);
    console.log(`      fr: "${data.paths.fr}",`);
    console.log(`      zh: "${data.paths.zh}",`);
    console.log(`    },`);
    console.log();
  }

  console.error("\nFertig.");
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
