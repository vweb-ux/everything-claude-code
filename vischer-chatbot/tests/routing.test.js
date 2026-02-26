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
const { getServiceById, getServiceByNumericId, getServiceBySlug, getServicePath, getAllServices } = require("../config/services.js");

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

test("DE: 'Datenschutz' → data_ai", () => {
  const s = detectServiceFromQuery("Welche Dienstleistungen gibt es im Datenschutz?", "de");
  assert.strictEqual(s, "data_ai");
});

test("DE: 'KI-Recht' → data_ai", () => {
  const s = detectServiceFromQuery("Fragen zum KI-Recht und künstlicher Intelligenz.", "de");
  assert.strictEqual(s, "data_ai");
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

test("DE: 'Versicherung' → insurance", () => {
  const s = detectServiceFromQuery("Fragen zu Versicherungsrecht und Versicherungsvertrag.", "de");
  assert.strictEqual(s, "insurance");
});

test("DE: 'Compliance' → regulatory_compliance", () => {
  const s = detectServiceFromQuery("Wir brauchen Unterstützung bei Compliance.", "de");
  assert.strictEqual(s, "regulatory_compliance");
});

test("DE: 'Sports Business' → sports_business", () => {
  const s = detectServiceFromQuery("Fragen zum Sportrecht und Sportveranstaltungen.", "de");
  assert.strictEqual(s, "sports_business");
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

test("EN: 'data protection' → data_ai", () => {
  const s = detectServiceFromQuery("GDPR compliance and data protection services.", "en");
  assert.strictEqual(s, "data_ai");
});

test("EN: 'AI law' → data_ai", () => {
  const s = detectServiceFromQuery("Questions about AI law and artificial intelligence regulation.", "en");
  assert.strictEqual(s, "data_ai");
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

test("EN: 'insurance' → insurance", () => {
  const s = detectServiceFromQuery("Questions about insurance law and insurance contracts.", "en");
  assert.strictEqual(s, "insurance");
});

test("EN: 'compliance' → regulatory_compliance", () => {
  const s = detectServiceFromQuery("We need support with regulatory compliance procedures.", "en");
  assert.strictEqual(s, "regulatory_compliance");
});

test("EN: 'sports business' → sports_business", () => {
  const s = detectServiceFromQuery("Questions about sports business and athletes.", "en");
  assert.strictEqual(s, "sports_business");
});

test("EN: 'ICT' → ict_emerging_tech", () => {
  const s = detectServiceFromQuery("Questions about ICT and emerging technologies.", "en");
  assert.strictEqual(s, "ict_emerging_tech");
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

test("FR: 'assurance' → insurance", () => {
  const s = detectServiceFromQuery("Questions sur le droit des assurances.", "fr");
  assert.strictEqual(s, "insurance");
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

test("ZH: '保险' → insurance", () => {
  const s = detectServiceFromQuery("保险合同方面的法律问题。", "zh");
  assert.strictEqual(s, "insurance");
});

// ===========================================================================
// SUITE 4: Service-Registry Konsistenz
// ===========================================================================
console.log("\n--- Suite 4: Service-Registry Konsistenz ---");

test("Alle Services haben eine numericId (Strapi ID)", () => {
  const services = getAllServices();
  const missing = services.filter((s) => !s.numericId);
  assert.strictEqual(missing.length, 0, `Services ohne numericId: ${missing.map((s) => s.id).join(", ")}`);
});

test("Alle Services haben einen slug", () => {
  const services = getAllServices();
  const missing = services.filter((s) => !s.slug);
  assert.strictEqual(missing.length, 0, `Services ohne slug: ${missing.map((s) => s.id).join(", ")}`);
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

test("Keine doppelten numericIds (Strapi IDs)", () => {
  const services = getAllServices();
  const ids = services.map((s) => s.numericId);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.strictEqual(duplicates.length, 0, `Doppelte numericIds: ${duplicates.join(", ")}`);
});

test("Keine doppelten slugs", () => {
  const services = getAllServices();
  const slugs = services.map((s) => s.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  assert.strictEqual(duplicates.length, 0, `Doppelte slugs: ${duplicates.join(", ")}`);
});

test("getServiceById('employment_law') → Strapi ID 1522", () => {
  const service = getServiceById("employment_law");
  assert.ok(service, "Service nicht gefunden");
  assert.strictEqual(service.numericId, "1522");
  assert.strictEqual(service.slug, "employment-law");
});

test("getServiceById('tax') → Strapi ID 1319", () => {
  const service = getServiceById("tax");
  assert.ok(service);
  assert.strictEqual(service.numericId, "1319");
  assert.strictEqual(service.slug, "tax");
});

test("getServiceById('data_ai') → Strapi ID 1448", () => {
  const service = getServiceById("data_ai");
  assert.ok(service, "data_ai Service nicht gefunden (war: data_privacy)");
  assert.strictEqual(service.numericId, "1448");
  assert.strictEqual(service.slug, "data-and-ai");
});

test("getServiceById('sports_business') → slug 'sports-law'", () => {
  const service = getServiceById("sports_business");
  assert.ok(service, "sports_business nicht gefunden (war: sports_law)");
  assert.strictEqual(service.slug, "sports-law");
});

test("getServiceById('ict_emerging_tech') → Strapi ID 1413", () => {
  const service = getServiceById("ict_emerging_tech");
  assert.ok(service, "ict_emerging_tech nicht gefunden (war: information_technology_law)");
  assert.strictEqual(service.numericId, "1413");
});

test("getServiceById('insurance') → neuer Service vorhanden", () => {
  const service = getServiceById("insurance");
  assert.ok(service, "insurance nicht gefunden");
  assert.strictEqual(service.numericId, "1462");
  assert.strictEqual(service.slug, "insurance");
});

test("getServiceById('regulatory_compliance') → neuer Service vorhanden", () => {
  const service = getServiceById("regulatory_compliance");
  assert.ok(service, "regulatory_compliance nicht gefunden");
  assert.strictEqual(service.numericId, "1415");
});

test("getServiceByNumericId('1590') → mergers_acquisitions", () => {
  const service = getServiceByNumericId("1590");
  assert.ok(service);
  assert.strictEqual(service.id, "mergers_acquisitions");
});

test("getServiceBySlug('antitrust-and-competition') → antitrust", () => {
  const service = getServiceBySlug("antitrust-and-competition");
  assert.ok(service);
  assert.strictEqual(service.id, "antitrust");
});

test("getServicePath('employment_law', 'de') → /expertise/employment-law", () => {
  const p = getServicePath("employment_law", "de");
  assert.strictEqual(p, "/expertise/employment-law");
});

test("getServicePath('employment_law', 'en') → /expertise/employment-law", () => {
  const p = getServicePath("employment_law", "en");
  assert.strictEqual(p, "/expertise/employment-law");
});

test("getServicePath('antitrust', 'en') → /expertise/antitrust-and-competition", () => {
  const p = getServicePath("antitrust", "en");
  assert.strictEqual(p, "/expertise/antitrust-and-competition");
});

test("getServiceById('unknown') → null", () => {
  const service = getServiceById("unknown_service");
  assert.strictEqual(service, null);
});

test("Genau 33 Services registriert", () => {
  const services = getAllServices();
  assert.strictEqual(services.length, 33, `Erwartet: 33, Gefunden: ${services.length}`);
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

test("DE: 'Steuer und Datenschutz' → tax + data_ai", () => {
  const services = detectAllServicesFromQuery("Wir haben Fragen zu Steuern und Datenschutz.", "de");
  assert.ok(services.includes("tax"), `tax nicht gefunden in: ${services}`);
  assert.ok(services.includes("data_ai"), `data_ai nicht gefunden in: ${services}`);
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
