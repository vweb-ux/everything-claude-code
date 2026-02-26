/**
 * tests/team-urls.test.js
 *
 * Tests für config/teams.js und config/search.js
 *
 * AUSFÜHREN: node tests/team-urls.test.js
 */

"use strict";

const assert = require("assert");
const { buildTeamUrl, buildTeamUrlBySlug, getTeamFinderBaseUrl } = require("../config/teams.js");
const { buildSearchUrl, getSearchBaseUrl } = require("../config/search.js");
const { BASE_DOMAIN } = require("../config/env.js");

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${description}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// ===========================================================================
// SUITE 1: Team-URL-Builder (neue slug-basierte Struktur)
// ===========================================================================
console.log("\n--- Suite 1: Team-URL-Builder ---");

test("DE: buildTeamUrl('employment_law', 'de') enthält slug 'employment-law'", () => {
  const url = buildTeamUrl("employment_law", "de");
  assert.ok(url, "URL ist null");
  assert.ok(url.includes("expertise=employment-law"), `Slug nicht gefunden in: ${url}`);
  assert.ok(url.startsWith(BASE_DOMAIN), `URL beginnt nicht mit ${BASE_DOMAIN}`);
  assert.ok(!url.includes("/en/"), "DE-URL enthält unerwartet /en/");
});

test("EN: buildTeamUrl('tax', 'en') enthält slug 'tax' und /en/", () => {
  const url = buildTeamUrl("tax", "en");
  assert.ok(url);
  assert.ok(url.includes("expertise=tax"), `Slug nicht gefunden in: ${url}`);
  assert.ok(url.includes("/en/"), `URL enthält nicht /en/: ${url}`);
});

test("FR: buildTeamUrl('mergers_acquisitions', 'fr') enthält slug und /fr/", () => {
  const url = buildTeamUrl("mergers_acquisitions", "fr");
  assert.ok(url);
  assert.ok(url.includes("expertise=mergers-and-acquisitions"), `Slug nicht gefunden in: ${url}`);
  assert.ok(url.includes("/fr/"), `URL enthält nicht /fr/: ${url}`);
});

test("ZH: buildTeamUrl('china_desk', 'zh') enthält slug 'china-desk'", () => {
  const url = buildTeamUrl("china_desk", "zh");
  assert.ok(url);
  assert.ok(url.includes("expertise=china-desk"), `Slug nicht gefunden in: ${url}`);
  assert.ok(url.includes("/zh/"), `URL enthält nicht /zh/: ${url}`);
});

test("buildTeamUrl('antitrust', 'en') → korrekter Slug", () => {
  const url = buildTeamUrl("antitrust", "en");
  assert.ok(url);
  assert.ok(url.includes("expertise=antitrust-and-competition"), `Slug falsch in: ${url}`);
});

test("buildTeamUrl('sports_business', 'de') → slug 'sports-law' (Slug unveraendert)", () => {
  const url = buildTeamUrl("sports_business", "de");
  assert.ok(url);
  assert.ok(url.includes("expertise=sports-law"), `Slug nicht gefunden in: ${url}`);
});

test("buildTeamUrl('data_ai', 'en') → slug 'data-and-ai'", () => {
  const url = buildTeamUrl("data_ai", "en");
  assert.ok(url);
  assert.ok(url.includes("expertise=data-and-ai"), `Slug nicht gefunden in: ${url}`);
});

test("buildTeamUrl('insurance', 'en') → slug 'insurance'", () => {
  const url = buildTeamUrl("insurance", "en");
  assert.ok(url);
  assert.ok(url.includes("expertise=insurance"), `Slug nicht gefunden in: ${url}`);
});

test("buildTeamUrl mit unbekanntem Service → null", () => {
  const url = buildTeamUrl("nonexistent_service", "de");
  assert.strictEqual(url, null);
});

test("buildTeamUrl mit unbekannter Sprache → null", () => {
  const url = buildTeamUrl("employment_law", "xx");
  assert.strictEqual(url, null);
});

test("buildTeamUrlBySlug('employment-law', 'de') funktioniert", () => {
  const url = buildTeamUrlBySlug("employment-law", "de");
  assert.ok(url);
  assert.ok(url.includes("expertise=employment-law"));
  assert.ok(url.startsWith(BASE_DOMAIN));
});

test("buildTeamUrlBySlug mit null slug → null", () => {
  const url = buildTeamUrlBySlug(null, "de");
  assert.strictEqual(url, null);
});

test("getTeamFinderBaseUrl('de') startet mit BASE_DOMAIN", () => {
  const url = getTeamFinderBaseUrl("de");
  assert.ok(url.startsWith(BASE_DOMAIN));
  assert.ok(url.includes("/team"));
  assert.ok(!url.includes("/en/"), "DE-URL enthält unerwartet /en/");
});

test("getTeamFinderBaseUrl('en') enthält /en/team", () => {
  const url = getTeamFinderBaseUrl("en");
  assert.ok(url.includes("/en/team"), `URL: ${url}`);
});

test("Team-URLs enthalten KEIN TYPO3 tx_llcatalog Muster", () => {
  const url = buildTeamUrl("employment_law", "de");
  assert.ok(!url.includes("tx_llcatalog"), `Veraltetes TYPO3-Muster gefunden in: ${url}`);
  assert.ok(!url.includes("#c4372"), `Veralteter Anchor gefunden in: ${url}`);
});

// ===========================================================================
// SUITE 2: Such-URLs
// ===========================================================================
console.log("\n--- Suite 2: Such-URLs ---");

test("DE: buildSearchUrl('de', 'Blockchain') enthält encodierten Suchterm", () => {
  const url = buildSearchUrl("de", "Blockchain");
  assert.ok(url.includes("Blockchain"));
  assert.ok(url.includes("/suche/"));
  assert.ok(url.startsWith(BASE_DOMAIN));
});

test("EN: buildSearchUrl('en', 'NFT') enthält /en/search/", () => {
  const url = buildSearchUrl("en", "NFT");
  assert.ok(url.includes("/en/search/"));
  assert.ok(url.includes("NFT"));
});

test("FR: buildSearchUrl('fr', 'fusion') enthält /fr/recherche/", () => {
  const url = buildSearchUrl("fr", "fusion");
  assert.ok(url.includes("/fr/recherche/"));
});

test("ZH: buildSearchUrl('zh', '并购') URL-kodiert den Suchterm", () => {
  const url = buildSearchUrl("zh", "并购");
  assert.ok(url.includes(encodeURIComponent("并购")), `URL: ${url}`);
});

test("Sonderzeichen in Suchterm werden korrekt kodiert", () => {
  const url = buildSearchUrl("de", "GmbH & Co. KG");
  assert.ok(!url.includes("&Co"), "Unkodiertes & gefunden");
  assert.ok(url.includes("GmbH"), "GmbH fehlt in URL");
});

test("getSearchBaseUrl('de') enthält Query-Präfix", () => {
  const base = getSearchBaseUrl("de");
  assert.ok(base.includes("tx_kesearch_pi1"));
  assert.ok(base.includes("query="));
});

test("buildSearchUrl Fallback auf 'de' bei unbekannter Sprache", () => {
  const url = buildSearchUrl("xx", "test");
  assert.ok(url.includes("/suche/"));
});

// ===========================================================================
// SUITE 3: ENV-Konfiguration
// ===========================================================================
console.log("\n--- Suite 3: ENV-Konfiguration ---");

test("BASE_DOMAIN ist gesetzt", () => {
  assert.ok(BASE_DOMAIN, "BASE_DOMAIN ist leer");
  assert.ok(BASE_DOMAIN.startsWith("http"), `BASE_DOMAIN beginnt nicht mit http: ${BASE_DOMAIN}`);
});

test("BASE_DOMAIN endet nicht auf '/'", () => {
  assert.ok(!BASE_DOMAIN.endsWith("/"), `BASE_DOMAIN endet auf '/': ${BASE_DOMAIN}`);
});

// ===========================================================================
// ERGEBNIS
// ===========================================================================
console.log(`\n${"=".repeat(50)}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("=".repeat(50));

if (failed > 0) process.exit(1);
