/**
 * tests/response-safety.test.js
 *
 * Tests für validators/response-safety.js
 *
 * AUSFÜHREN: node tests/response-safety.test.js
 */

"use strict";

const assert = require("assert");
const { classifyIntent, validateResponse, fullSafetyCheck, INTENT } = require("../validators/response-safety.js");

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
// SUITE 1: Intent-Klassifikation — Klare Rechtsberatungs-Anfragen
// ===========================================================================
console.log("\n--- Suite 1: Klare Rechtsberatungs-Anfragen (erwartet: LEGAL_ADVICE) ---");

test("DE: 'Kann ich meinen Mitarbeiter kündigen?' → legal_advice", () => {
  const r = classifyIntent("Kann ich meinen Mitarbeiter ohne Vorwarnung kündigen?", "de");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE, `Erwartet legal_advice, erhalten: ${r.intent} (confidence: ${r.confidence})`);
});

test("DE: 'Habe ich Anspruch auf...' → legal_advice", () => {
  const r = classifyIntent("Habe ich das Recht auf eine Abfindung nach 10 Jahren?", "de");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("DE: 'Ist das rechtmäßig?' → legal_advice", () => {
  const r = classifyIntent("Ist es rechtmäßig, wenn mein Chef meine Überstunden nicht bezahlt?", "de");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("EN: 'Can I sue my landlord?' → legal_advice", () => {
  const r = classifyIntent("Can I sue my landlord for not returning my deposit?", "en");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("EN: 'Am I entitled to...' → legal_advice", () => {
  const r = classifyIntent("Am I entitled to severance pay after being fired?", "en");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("EN: 'What are the legal consequences?' → legal_advice", () => {
  const r = classifyIntent("What are the legal consequences of breaking a contract?", "en");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("FR: 'Puis-je...' → legal_advice", () => {
  const r = classifyIntent("Puis-je résilier mon bail sans payer de pénalités?", "fr");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

test("ZH: '我可以起诉...' → legal_advice", () => {
  const r = classifyIntent("我可以起诉我的雇主吗？", "zh");
  assert.strictEqual(r.intent, INTENT.LEGAL_ADVICE);
});

// ===========================================================================
// SUITE 2: Informationsanfragen (erwartet: INFORMATION)
// ===========================================================================
console.log("\n--- Suite 2: Reine Informationsanfragen (erwartet: INFORMATION) ---");

test("DE: 'Was bietet VISCHER im Arbeitsrecht an?' → information", () => {
  const r = classifyIntent("Was bietet VISCHER im Bereich Arbeitsrecht an?", "de");
  assert.strictEqual(r.intent, INTENT.INFORMATION, `Erwartet information, erhalten: ${r.intent}`);
});

test("DE: 'Welche Rechtsgebiete deckt VISCHER ab?' → information", () => {
  const r = classifyIntent("Welche Rechtsgebiete deckt VISCHER ab?", "de");
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

test("EN: 'What services does VISCHER offer in tax law?' → information", () => {
  const r = classifyIntent("What services does VISCHER offer in tax law?", "en");
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

test("EN: 'Tell me about VISCHER M&A team' → information", () => {
  const r = classifyIntent("Tell me about the VISCHER mergers and acquisitions practice.", "en");
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

test("FR: 'Quels sont les services de VISCHER?' → information", () => {
  const r = classifyIntent("Quels sont les services de VISCHER en droit du travail?", "fr");
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

test("ZH: 'VISCHER提供哪些服务？' → information", () => {
  const r = classifyIntent("VISCHER提供哪些并购相关服务？", "zh");
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

// ===========================================================================
// SUITE 3: Grenzfälle — konservative Behandlung
// ===========================================================================
console.log("\n--- Suite 3: Grenzfälle (erwartet: BORDERLINE oder LEGAL_ADVICE, nie INFORMATION) ---");

test("DE: Ambiguöse Anfrage mit 'Recht' → nicht als information klassifiziert", () => {
  const r = classifyIntent("Was sind meine Rechte wenn der Arbeitgeber den Lohn nicht zahlt?", "de");
  // Sollte NICHT information sein — enthält klares Rechtsberatungs-Signal
  assert.notStrictEqual(r.intent, INTENT.INFORMATION, `Erwartet borderline/legal_advice, erhalten: ${r.intent}`);
});

test("Confidence 0 für leere Anfrage", () => {
  const r = classifyIntent("", "de");
  assert.strictEqual(r.confidence, 0);
  assert.strictEqual(r.intent, INTENT.INFORMATION);
});

test("Confidence 0 für null-Anfrage", () => {
  const r = classifyIntent(null, "de");
  assert.strictEqual(r.confidence, 0);
});

// ===========================================================================
// SUITE 4: Output-Validierung — verbotene Phrasen
// ===========================================================================
console.log("\n--- Suite 4: Output-Validierung (verbotene Phrasen) ---");

test("DE: 'Sie sollten...' → unsichere Antwort", () => {
  const r = validateResponse("Sie sollten sofort einen Anwalt kontaktieren.", "de");
  assert.strictEqual(r.safe, false);
  assert.ok(r.violations.length > 0);
});

test("DE: 'Sie haben Anspruch auf...' → unsichere Antwort", () => {
  const r = validateResponse("Sie haben Anspruch auf eine Entschädigung.", "de");
  assert.strictEqual(r.safe, false);
});

test("EN: 'you should...' → unsichere Antwort", () => {
  const r = validateResponse("Based on this, you should file a complaint immediately.", "en");
  assert.strictEqual(r.safe, false);
});

test("EN: 'you are entitled to...' → unsichere Antwort", () => {
  const r = validateResponse("Under Swiss law, you are entitled to severance pay.", "en");
  assert.strictEqual(r.safe, false);
});

test("ZH: '您应该...' → unsichere Antwort", () => {
  const r = validateResponse("您应该立即起诉对方。", "zh");
  assert.strictEqual(r.safe, false);
});

test("DE: Reine Informationsantwort → sicher", () => {
  const r = validateResponse(
    "VISCHER bietet umfassende Dienstleistungen im Arbeitsrecht an. " +
    "Weitere Informationen finden Sie hier: https://www.vischer.com/dienstleistungen/arbeitsrecht/",
    "de"
  );
  assert.strictEqual(r.safe, true);
  assert.strictEqual(r.violations.length, 0);
});

test("EN: Pure informational response → safe", () => {
  const r = validateResponse(
    "VISCHER offers services in employment law. You can find more information here: " +
    "https://www.vischer.com/en/services/employment-law/",
    "en"
  );
  assert.strictEqual(r.safe, true);
});

test("Code-Switching: EN-Phrase in DE-Antwort → unsicher", () => {
  // EN-verbotene Phrase in einer deutschen Antwort
  const r = validateResponse("In diesem Fall, you should proceed immediately.", "de");
  assert.strictEqual(r.safe, false);
});

// ===========================================================================
// SUITE 5: Vollständige Sicherheitsprüfung
// ===========================================================================
console.log("\n--- Suite 5: fullSafetyCheck ---");

test("Rechtsberatungs-Anfrage + sichere Antwort → nicht approved (Intent blockiert)", () => {
  const r = fullSafetyCheck(
    "Kann ich meinen Mitarbeiter fristlos entlassen?",
    "VISCHER bietet Informationen zu Arbeitsrecht an: https://www.vischer.com/dienstleistungen/arbeitsrecht/",
    "de"
  );
  assert.strictEqual(r.approved, false);
  assert.ok(r.reason.includes("legal_advice") || r.reason.includes("borderline"));
});

test("Informationsanfrage + sichere Antwort → approved", () => {
  const r = fullSafetyCheck(
    "Was bietet VISCHER im Steuerrecht an?",
    "VISCHER bietet umfassende Steuerrechtsdienstleistungen an: https://www.vischer.com/dienstleistungen/steuern/",
    "de"
  );
  assert.strictEqual(r.approved, true);
  assert.strictEqual(r.reason, "OK");
});

test("Informationsanfrage + unsichere Antwort → nicht approved (Output-Verletzung)", () => {
  const r = fullSafetyCheck(
    "Was bietet VISCHER im Steuerrecht an?",
    "Sie sollten sofort unseren Steuerexperten kontaktieren, denn Sie müssen das erklären.",
    "de"
  );
  assert.strictEqual(r.approved, false);
  assert.ok(r.validationResult.violations.length > 0);
});

// ===========================================================================
// ERGEBNIS
// ===========================================================================
console.log(`\n${"=".repeat(50)}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("=".repeat(50));

if (failed > 0) process.exit(1);
