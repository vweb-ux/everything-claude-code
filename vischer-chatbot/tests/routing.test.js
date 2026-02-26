/**
 * tests/routing.test.js
 *
 * Tests für config/routing.js und config/services.js
 *
 * AUSFÜHREN: node tests/routing.test.js
 */

"use strict";

const assert = require("assert");
const { detectServiceFromQuery, detectAllServicesFromQuery, getRagStrategy } = require("../config/routing.js");
const { getServiceById, getServiceByNumericId, getServicePath, getAllServices } = require("../config/services.js");

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
// SUITE 1: Service-Routing (DE)
// ===========================================================================
console.log("\n--- Suite 1: Service-Routing Deutsch ---");

test("DE: 'Kündigung' → employment_law", () => {
  const s = detectServiceFromQuery("Ich habe eine Frage zur Kündigung meines Arbeitnehmers.", "de");
  assert.strictEqual(s, "employment_law");
});

test("DE: 'Steuer' → tax", () => {
  const s = detectServiceFromQuery("Was bietet VISCHER im Bereich Steuerrecht?", "de");
  assert.strictEqual(s, "tax");
});

test("DE: 'Datenschutz' → data_privacy", () => {
  const s = detectServiceFromQuery("Welche Dienstleistungen gibt es im Datenschutz?", "de");
  assert.strictEqual(s, "data_privacy");
});

test("DE: 'M&A' → mergers_acquisitions", () => {
  const s = detectServiceFromQuery("Unser Unternehmen plant eine M&A-Transaktion.", "de");
  assert.strictEqual(s, "mergers_acquisitions");
});

test("DE: 'Startup' → startup_desk", () => {
  const s = detectServiceFromQuery("Ich gründe ein Startup und brauche Beratung.", "de");
  assert.strictEqual(s, "startup_desk");
});

test("DE: 'China' → china_desk", () => {
  const s = detectServiceFromQuery("Wir möchten in China investieren.", "de");
  assert.strictEqual(s, "china_desk");
});

test("DE: 'Patent' → intellectual_property", () => {
  const s = detectServiceFromQuery("Fragen zum Patentrecht und Markenrecht.", "de");
  assert.strictEqual(s, "intellectual_property");
});

test("DE: Unbekanntes Thema → null", () => {
  const s = detectServiceFromQuery("Was ist das Wetter in Basel?", "de");
  assert.strictEqual(s, null);
});

// ===========================================================================
// SUITE 2: Service-Routing (EN)
// ===========================================================================
console.log("\n--- Suite 2: Service-Routing English ---");

test("EN: 'employment contract' → employment_law", () => {
  const s = detectServiceFromQuery("Questions about an employment contract.", "en");
  assert.strictEqual(s, "employment_law");
});

test("EN: 'tax' → tax", () => {
  const s = detectServiceFromQuery("What does VISCHER offer in tax law?", "en");
  assert.strictEqual(s, "tax");
});

test("EN: 'data protection' → data_privacy", () => {
  const s = detectServiceFromQuery("GDPR compliance and data protection services.", "en");
  assert.strictEqual(s, "data_privacy");
});

test("EN: 'merger' → mergers_acquisitions", () => {
  const s = detectServiceFromQuery("We need advice on a merger transaction.", "en");
  assert.strictEqual(s, "mergers_acquisitions");
});

test("EN: 'intellectual property' → intellectual_property", () => {
  const s = detectServiceFromQuery("We need help with intellectual property rights.", "en");
  assert.strictEqual(s, "intellectual_property");
});

test("EN: 'litigation' → litigation", () => {
  const s = detectServiceFromQuery("We are involved in a dispute requiring litigation.", "en");
  assert.strictEqual(s, "litigation");
});

// ===========================================================================
// SUITE 3: Service-Routing (FR + ZH)
// ===========================================================================
console.log("\n--- Suite 3: Service-Routing FR/ZH ---");

test("FR: 'droit du travail' → employment_law", () => {
  const s = detectServiceFromQuery("Questions sur le droit du travail.", "fr");
  assert.strictEqual(s, "employment_law");
});

test("FR: 'propriété intellectuelle' → intellectual_property", () => {
  const s = detectServiceFromQuery("Nous avons besoin d'aide pour la propriété intellectuelle.", "fr");
  assert.strictEqual(s, "intellectual_property");
});

test("ZH: '劳动法' → employment_law", () => {
  const s = detectServiceFromQuery("关于劳动法的问题。", "zh");
  assert.strictEqual(s, "employment_law");
});

test("ZH: '并购' → mergers_acquisitions", () => {
  const s = detectServiceFromQuery("我们正在计划并购交易。", "zh");
  assert.strictEqual(s, "mergers_acquisitions");
});

test("ZH: '知识产权' → intellectual_property", () => {
  const s = detectServiceFromQuery("我们需要知识产权保护方面的帮助。", "zh");
  assert.strictEqual(s, "intellectual_property");
});

// ===========================================================================
// SUITE 4: Service-Registry Konsistenz
// ===========================================================================
console.log("\n--- Suite 4: Service-Registry Konsistenz ---");

test("Alle Services haben eine numericId", () => {
  const services = getAllServices();
  const missing = services.filter((s) => !s.numericId);
  assert.strictEqual(missing.length, 0, `Services ohne numericId: ${missing.map((s) => s.id).join(", ")}`);
});

test("Alle Services haben Pfade für alle 4 Sprachen", () => {
  const services = getAllServices();
  const langs = ["de", "en", "fr", "zh"];
  const problems = [];
  for (const service of services) {
    for (const lang of langs) {
      if (!service.paths[lang]) {
        problems.push(`${service.id}[${lang}]`);
      }
    }
  }
  assert.strictEqual(problems.length, 0, `Fehlende Pfade: ${problems.join(", ")}`);
});

test("Alle Services haben Labels für alle 4 Sprachen", () => {
  const services = getAllServices();
  const langs = ["de", "en", "fr", "zh"];
  const problems = [];
  for (const service of services) {
    for (const lang of langs) {
      if (!service.label[lang]) {
        problems.push(`${service.id}.label[${lang}]`);
      }
    }
  }
  assert.strictEqual(problems.length, 0, `Fehlende Labels: ${problems.join(", ")}`);
});

test("Keine doppelten numericIds", () => {
  const services = getAllServices();
  const ids = services.map((s) => s.numericId);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.strictEqual(duplicates.length, 0, `Doppelte numericIds: ${duplicates.join(", ")}`);
});

test("getServiceById('employment_law') → korrekte numericId", () => {
  const service = getServiceById("employment_law");
  assert.ok(service, "Service nicht gefunden");
  assert.strictEqual(service.numericId, "725");
});

test("getServiceById('tax') → korrekte numericId", () => {
  const service = getServiceById("tax");
  assert.ok(service);
  assert.strictEqual(service.numericId, "752");
});

test("getServiceByNumericId('743') → mergers_acquisitions", () => {
  const service = getServiceByNumericId("743");
  assert.ok(service);
  assert.strictEqual(service.id, "mergers_acquisitions");
});

test("getServicePath('employment_law', 'de') → korrekter Pfad", () => {
  const p = getServicePath("employment_law", "de");
  assert.strictEqual(p, "/dienstleistungen/arbeitsrecht/");
});

test("getServicePath('employment_law', 'en') → korrekter Pfad", () => {
  const p = getServicePath("employment_law", "en");
  assert.strictEqual(p, "/services/employment-law/");
});

test("getServiceById('unknown') → null", () => {
  const service = getServiceById("unknown_service");
  assert.strictEqual(service, null);
});

// ===========================================================================
// SUITE 5: RAG-Strategie
// ===========================================================================
console.log("\n--- Suite 5: RAG-Strategie ---");

test("Default-Strategie für unbekannten Service", () => {
  const strategy = getRagStrategy(null);
  assert.strictEqual(strategy.search_depth, 3);
  assert.strictEqual(strategy.max_results, 5);
  assert.strictEqual(strategy.relevance_threshold, 0.7);
});

test("Tax → erhöhte Suchtiefe", () => {
  const strategy = getRagStrategy("tax");
  assert.strictEqual(strategy.search_depth, 5);
  assert.ok(strategy.max_results > 5);
});

test("Life Sciences → erhöhte Suchtiefe", () => {
  const strategy = getRagStrategy("life_sciences");
  assert.strictEqual(strategy.search_depth, 5);
});

test("RAG-Strategie für Employment → Default", () => {
  const strategy = getRagStrategy("employment_law");
  assert.strictEqual(strategy.search_depth, 3);
});

// ===========================================================================
// SUITE 6: detectAllServicesFromQuery
// ===========================================================================
console.log("\n--- Suite 6: Mehrere Services pro Query ---");

test("DE: 'Steuer und Datenschutz' → beide erkannt", () => {
  const services = detectAllServicesFromQuery("Wir haben Fragen zu Steuern und Datenschutz.", "de");
  assert.ok(services.includes("tax"), `tax nicht gefunden in: ${services}`);
  assert.ok(services.includes("data_privacy"), `data_privacy nicht gefunden in: ${services}`);
});

test("EN: 'M&A and tax' → beide erkannt", () => {
  const services = detectAllServicesFromQuery("We need advice on M&A and tax implications.", "en");
  assert.ok(services.includes("mergers_acquisitions"));
  assert.ok(services.includes("tax"));
});

// ===========================================================================
// ERGEBNIS
// ===========================================================================
console.log(`\n${"=".repeat(50)}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("=".repeat(50));

if (failed > 0) process.exit(1);
