/**
 * validators/response-safety.js
 *
 * Zweistufige Sicherheitsprüfung für Chatbot-Antworten.
 *
 * STUFE 1 — Intent-Klassifikation (vor der Antwortgenerierung):
 *   classifyIntent(query, lang) → { intent, confidence, signals }
 *
 * STUFE 2 — Output-Prüfung (nach der Antwortgenerierung):
 *   validateResponse(responseText, lang) → { safe, violations }
 *
 * PHILOSOPHIE:
 *   - Im Zweifel konservativ: lieber false positive (zu viel redirecten)
 *     als false negative (unbeabsichtigt Rechtsberatung geben).
 *   - Phrase-Listen sind EINE Schicht, nicht die einzige.
 *   - Confidence-Scoring erlaubt Grenzfall-Behandlung.
 */

"use strict";

const {
  LEGAL_ADVICE_SIGNALS,
  WEAK_LEGAL_SIGNALS,
  PROHIBITED_OUTPUT_PHRASES,
  CONFIDENCE,
  ESCALATION_RULES,
} = require("../config/policy.js");

// ---------------------------------------------------------------------------
// INTENT-TYPEN
// ---------------------------------------------------------------------------
const INTENT = Object.freeze({
  LEGAL_ADVICE: "legal_advice",    // Klarer Rechtsberatungs-Intent → Ablehnung + Redirect
  BORDERLINE: "borderline",        // Grenzfall → konservativ wie LEGAL_ADVICE behandeln
  INFORMATION: "information",      // Informationsanfrage → normal beantworten
  TEAM_LOOKUP: "team_lookup",      // Experten-/Team-Suche → Team-URL zurückgeben
  NAVIGATION: "navigation",        // Website-Navigation → Link zurückgeben
});

// ---------------------------------------------------------------------------
// STUFE 1: INTENT-KLASSIFIKATION
// ---------------------------------------------------------------------------

/**
 * Klassifiziert den Intent einer Benutzeranfrage.
 *
 * @param {string} query - Originaltext der Anfrage
 * @param {string} lang  - Erkannte Sprache ('de' | 'en' | 'fr' | 'zh')
 * @returns {{
 *   intent: string,
 *   confidence: number,
 *   signals: string[],
 *   escalation: Object
 * }}
 */
function classifyIntent(query, lang) {
  if (!query || typeof query !== "string") {
    return { intent: INTENT.INFORMATION, confidence: 0, signals: [], escalation: ESCALATION_RULES.information };
  }

  const strongSignals = LEGAL_ADVICE_SIGNALS[lang] ?? LEGAL_ADVICE_SIGNALS.de;
  const weakSignals   = WEAK_LEGAL_SIGNALS[lang]   ?? WEAK_LEGAL_SIGNALS.de;

  const triggeredStrongSignals = strongSignals.filter((pattern) => pattern.test(query));
  const triggeredWeakSignals   = weakSignals.filter((pattern) => pattern.test(query));

  // Confidence berechnen
  let confidence = 0;

  // Ein starkes Signal reicht für hohe Confidence
  if (triggeredStrongSignals.length > 0) {
    confidence = CONFIDENCE.STRONG_SIGNAL_WEIGHT;
  }

  // Schwache Signale addieren (bis zum definierten Maximum)
  const weakContribution = Math.min(
    triggeredWeakSignals.length * CONFIDENCE.WEAK_SIGNAL_WEIGHT,
    CONFIDENCE.WEAK_SIGNAL_MAX
  );
  confidence = Math.min(1.0, confidence + weakContribution);

  // Intent bestimmen
  let intent;
  if (confidence >= CONFIDENCE.LEGAL_ADVICE_THRESHOLD) {
    intent = INTENT.LEGAL_ADVICE;
  } else if (confidence >= 0.4) {
    // Grenzfall: konservativ behandeln
    intent = INTENT.BORDERLINE;
  } else {
    intent = INTENT.INFORMATION;
  }

  // Lesbare Signal-Beschreibungen für Debugging
  const signals = [
    ...triggeredStrongSignals.map((p) => `[STRONG] ${p}`),
    ...triggeredWeakSignals.map((p) => `[WEAK] ${p}`),
  ];

  const escalation = ESCALATION_RULES[intent] ?? ESCALATION_RULES.information;

  return { intent, confidence, signals, escalation };
}

// ---------------------------------------------------------------------------
// STUFE 2: OUTPUT-VALIDIERUNG
// ---------------------------------------------------------------------------

/**
 * Prüft eine generierte Antwort auf verbotene Phrasen und Muster.
 * Sollte VOR der Auslieferung jeder Antwort aufgerufen werden.
 *
 * @param {string} responseText - Generierte Antwort
 * @param {string} lang         - Erkannte Sprache
 * @returns {{
 *   safe: boolean,
 *   violations: Array<{ phrase: string, lang: string, type: string }>,
 *   reformulationRequired: boolean
 * }}
 */
function validateResponse(responseText, lang) {
  if (!responseText || typeof responseText !== "string") {
    return { safe: true, violations: [], reformulationRequired: false };
  }

  const violations = [];

  // Prüfe verbotene Ausgabe-Phrasen in der erkannten Sprache
  const phrasesToCheck = PROHIBITED_OUTPUT_PHRASES[lang] ?? [];
  for (const phrase of phrasesToCheck) {
    if (responseText.toLowerCase().includes(phrase.toLowerCase())) {
      violations.push({ phrase, lang, type: "prohibited_output_phrase" });
    }
  }

  // Zusätzlich: Englische Phrases immer prüfen (Code-Switching-Schutz)
  if (lang !== "en") {
    for (const phrase of PROHIBITED_OUTPUT_PHRASES.en ?? []) {
      if (responseText.toLowerCase().includes(phrase.toLowerCase())) {
        violations.push({ phrase, lang: "en", type: "prohibited_output_phrase_codeswitching" });
      }
    }
  }

  // Muster-basierte Prüfungen (sprachunabhängig)
  const dangerousPatterns = [
    { pattern: /\b(§|Art\.|Artikel)\s*\d+/i, type: "law_reference_in_advice_context" },
    { pattern: /\b(höchst|sehr|äusserst|clearly|manifestement)\s+(wahrscheinlich|likely|probable)/i, type: "outcome_prediction" },
    { pattern: /\b(Erfolgsaussicht|chance of success|chances de succès|胜诉概率)/i, type: "success_prediction" },
  ];

  for (const { pattern, type } of dangerousPatterns) {
    if (pattern.test(responseText)) {
      violations.push({ phrase: pattern.toString(), lang: "any", type });
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    reformulationRequired: violations.length > 0,
  };
}

// ---------------------------------------------------------------------------
// KOMBINIERTE PRÜFUNG (Convenience-Funktion)
// ---------------------------------------------------------------------------

/**
 * Vollständige Sicherheitsprüfung: Intent + Output-Validierung.
 *
 * @param {string} query        - Originalanfrage
 * @param {string} responseText - Generierte Antwort
 * @param {string} lang         - Erkannte Sprache
 * @returns {{
 *   intentResult: Object,
 *   validationResult: Object,
 *   approved: boolean,
 *   reason: string
 * }}
 */
function fullSafetyCheck(query, responseText, lang) {
  const intentResult     = classifyIntent(query, lang);
  const validationResult = validateResponse(responseText, lang);

  let approved = true;
  let reason = "OK";

  if (intentResult.intent === INTENT.LEGAL_ADVICE || intentResult.intent === INTENT.BORDERLINE) {
    approved = false;
    reason = `Legal advice intent detected (confidence: ${intentResult.confidence.toFixed(2)}, intent: ${intentResult.intent})`;
  }

  if (!validationResult.safe) {
    approved = false;
    reason = `Response contains ${validationResult.violations.length} violation(s): ${validationResult.violations.map((v) => `"${v.phrase}"`).join(", ")}`;
  }

  return { intentResult, validationResult, approved, reason };
}

module.exports = {
  INTENT,
  classifyIntent,
  validateResponse,
  fullSafetyCheck,
};
