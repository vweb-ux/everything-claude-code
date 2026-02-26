/**
 * config/policy.js
 *
 * Rechtliche Sicherheitsregeln — NICHT VERÄNDERBAR ohne explizite Freigabe.
 *
 * Enthält:
 *  - Kategorisierung verbotener Antworttypen
 *  - Intent-Signal-Kategorien (statt reine Phrase-Blacklists)
 *  - Confidence-Schwellenwerte für konservative Safety
 *  - Eskalationsregeln
 *
 * WICHTIG: Diese Regeln implementieren eine mehrschichtige Verteidigung.
 * Phrase-Listen allein reichen nicht — sie sind NUR eine Schicht.
 */

"use strict";

// ---------------------------------------------------------------------------
// ABSOLUT VERBOTENE ANTWORTTYPEN
// Keine Ausnahmen, keine Grenzfälle.
// ---------------------------------------------------------------------------
const PROHIBITED_RESPONSE_TYPES = Object.freeze({
  LEGAL_ADVICE: "legal_advice",
  CASE_ANALYSIS: "case_specific_analysis",
  LAW_INTERPRETATION: "law_interpretation",
  LEGAL_RECOMMENDATION: "legal_recommendation",
  OUTCOME_PREDICTION: "outcome_prediction",
  RIGHTS_ASSERTION: "rights_assertion",
});

// ---------------------------------------------------------------------------
// INTENT-KLASSIFIKATION
// Mehrschichtig: Phrase-Signale + Kontext-Signale + Thema-Signale
// ---------------------------------------------------------------------------

/**
 * Starke Signale für Rechtsberatungs-Intent.
 * Wenn ≥1 dieser Muster matcht → Intent = LEGAL_ADVICE (Confidence: HOCH)
 *
 * Designprinzip: Muster auf Wortgrenzen/Satzanfänge ausrichten,
 * um False Positives zu reduzieren (z.B. "author" ≠ "hat... Recht").
 */
const LEGAL_ADVICE_SIGNALS = Object.freeze({
  de: [
    // Direkte Beratungsanfragen
    /\bkann ich\b/i,
    /\bdarf ich\b/i,
    /\bmuss ich\b/i,
    /\bbin ich verpflichtet\b/i,
    /\bhabe ich (das )?recht\b/i,
    /\bwelche rechte habe ich\b/i,
    /\bwas steht mir zu\b/i,
    /\bhätte ich anspruch\b/i,
    /\bbin ich berechtigt\b/i,
    // Konsequenz-Anfragen
    /\bwas passiert wenn\b/i,
    /\bwelche (rechtlichen? )?folgen\b/i,
    /\bwelche konsequenzen\b/i,
    /\bwann verjährt\b/i,
    // Handlungs-Anfragen
    /\bwie gehe ich vor\b/i,
    /\bwie kann ich (das )?durchsetzen\b/i,
    /\bwie kann ich klagen\b/i,
    /\bwas (soll|muss) ich tun\b/i,
    /\bwie wehre ich mich\b/i,
    // Rechte-Anfragen
    /\bmeine rechte\b/i,
    /\bwelche rechte\b/i,
    // Bewertungsanfragen
    /\bist (das|es) ?(das )?rechtmäßig\b/i,
    /\bist (das|es) ?legal\b/i,
    /\bist (das|es) ?erlaubt\b/i,
    /\bist (das|es) ?strafbar\b/i,
    /\bwas sagt das gesetz (dazu|über)\b/i,
    /\bwie ist die rechtslage\b/i,
  ],
  en: [
    /\bcan i\b/i,
    /\bam i allowed\b/i,
    /\bdo i have to\b/i,
    /\bam i obligated\b/i,
    /\bdo i have (the )?right\b/i,
    /\bwhat rights do i have\b/i,
    /\bwhat am i entitled to\b/i,
    /\bam i entitled to\b/i,
    /\bwould i be entitled\b/i,
    /\bwhat happens if\b/i,
    /\bwhat are the (legal )?consequences\b/i,
    /\bwhen does it (expire|lapse)\b/i,
    /\bhow (do i|can i) proceed\b/i,
    /\bhow can i enforce\b/i,
    /\bhow can i sue\b/i,
    /\bwhat should i do\b/i,
    /\bis (it|this) (lawful|legal|permissible|allowed)\b/i,
    /\bis (it|this) a crime\b/i,
    /\bwhat does the law say\b/i,
    /\bwhat is the legal (situation|position|status)\b/i,
    /\bcan i be sued\b/i,
  ],
  fr: [
    /\bpuis-je\b/i,
    /\best-ce que je peux\b/i,
    /\bsuis-je obligé\b/i,
    /\bai-je le droit\b/i,
    /\bquels droits (ai-je|j'ai)\b/i,
    /\bà quoi ai-je droit\b/i,
    /\baurais-je droit\b/i,
    /\bque (se passe-t-il|se passera-t-il) si\b/i,
    /\bquelles (sont les )?conséquences\b/i,
    /\bquand (est-ce que ça)? (expire|se prescrit)\b/i,
    /\bcomment (procéder|puis-je procéder)\b/i,
    /\bcomment (puis-je )?faire valoir\b/i,
    /\bcomment puis-je poursuivre\b/i,
    /\bque dois-je faire\b/i,
    /\best-ce (légal|légitim|permis|autorisé)\b/i,
    /\bque dit la loi\b/i,
    /\bquelle est la situation juridique\b/i,
    /\bpuis-je être poursuivi\b/i,
  ],
  zh: [
    /我可以(吗|.*吗)/,
    /我能(否|不)/,
    /我有(权|资格|权利)/,
    /我是否有权/,
    /我能.*吗/,
    /我(必须|应该|需要)(怎么|如何)/,
    /如果.*会怎样/,
    /有什么(法律)?后果/,
    /什么时候(过期|失效|诉讼时效)/,
    /如何(起诉|维权|执行)/,
    /怎么(打官司|维权)/,
    /这是否(合法|违法|犯罪)/,
    /法律(怎么说|如何规定)/,
    /法律情况如何/,
    /我会被起诉吗/,
  ],
});

/**
 * Schwache Signale — erhöhen Confidence, sind aber allein nicht ausreichend.
 * Diese Muster können in normalen Informationsfragen vorkommen.
 */
const WEAK_LEGAL_SIGNALS = Object.freeze({
  de: [
    /\brechtlich\b/i,
    /\bjuristisch\b/i,
    /\bgesetzlich\b/i,
    /\bgesetz\b/i,
    /\brecht\b/i,
    /\banspruch\b/i,
    /\bklage\b/i,
    /\bgericht\b/i,
  ],
  en: [
    /\blegal\b/i,
    /\bjuridical\b/i,
    /\bstatutory\b/i,
    /\blaw\b/i,
    /\bright\b/i,
    /\bclaim\b/i,
    /\blawsuit\b/i,
    /\bcourt\b/i,
  ],
  fr: [
    /\bjuridique\b/i,
    /\blégal\b/i,
    /\blégislatif\b/i,
    /\bloi\b/i,
    /\bdroit\b/i,
    /\bréclamation\b/i,
    /\bprocès\b/i,
    /\btribunal\b/i,
  ],
  zh: [/法律/, /合法/, /违法/, /权利/, /诉讼/, /法院/, /索赔/],
});

// ---------------------------------------------------------------------------
// VERBOTENE AUSGABE-PHRASEN
// Zweite Sicherheitslinie: Selbst wenn der Intent falsch klassifiziert wurde,
// werden diese Phrasen in der finalen Antwort blockiert.
// ---------------------------------------------------------------------------
const PROHIBITED_OUTPUT_PHRASES = Object.freeze({
  de: [
    "Sie sollten",
    "Sie könnten",
    "Sie müssen",
    "Ich rate Ihnen",
    "Meine Empfehlung ist",
    "rechtlich gesehen",
    "aus rechtlicher Sicht",
    "rechtliche Konsequenzen sind",
    "Sie haben Anspruch auf",
    "ein Gericht würde",
    "Sie haben Recht",
    "Sie haben Unrecht",
    "das ist illegal",
    "das ist legal",
    "das ist strafbar",
    "Ihre Erfolgsaussichten",
  ],
  en: [
    "you should",
    "you could",
    "you must",
    "I advise you",
    "my recommendation is",
    "legally speaking",
    "from a legal perspective",
    "the legal consequences are",
    "you are entitled to",
    "a court would",
    "you are right",
    "you are wrong",
    "that is illegal",
    "that is legal",
    "that is criminal",
    "your chances of success",
  ],
  fr: [
    "vous devriez",
    "vous pourriez",
    "vous devez",
    "je vous conseille",
    "ma recommandation est",
    "juridiquement parlant",
    "d'un point de vue juridique",
    "les conséquences juridiques sont",
    "vous avez droit à",
    "un tribunal déciderait",
    "vous avez raison",
    "vous avez tort",
    "c'est illégal",
    "c'est légal",
    "vos chances de succès",
  ],
  zh: [
    "您应该",
    "您可以",
    "您必须",
    "我建议您",
    "我的建议是",
    "从法律角度",
    "法律后果是",
    "您有权获得",
    "法院会判",
    "您是对的",
    "您是错的",
    "这是违法的",
    "这是合法的",
    "您的胜诉概率",
  ],
});

// ---------------------------------------------------------------------------
// CONFIDENCE-SCHWELLENWERTE
// ---------------------------------------------------------------------------
const CONFIDENCE = Object.freeze({
  // Ab diesem Score: Antwort wird als Rechtsberatung klassifiziert → Ablehnung
  LEGAL_ADVICE_THRESHOLD: 0.6,
  // Starkes Signal zählt als
  STRONG_SIGNAL_WEIGHT: 0.8,
  // Schwaches Signal zählt als
  WEAK_SIGNAL_WEIGHT: 0.2,
  // Max-Wert, den schwache Signale kumuliert erreichen können
  WEAK_SIGNAL_MAX: 0.4,
});

// ---------------------------------------------------------------------------
// ESKALATIONSREGELN
// ---------------------------------------------------------------------------
const ESCALATION_RULES = Object.freeze({
  // Bei Rechtsberatungs-Intent: immer Disclaimer + Redirect, nie direkte Antwort
  legal_advice: {
    show_disclaimer: true,
    redirect_to_contact: true,
    provide_general_info_only: true,
    allow_service_link: true,
    allow_team_link: true,
    allow_blog_link: true,
  },
  // Bei Grenzfällen (0.4–0.6 Confidence): konservativ → wie legal_advice behandeln
  borderline: {
    show_disclaimer: true,
    redirect_to_contact: true,
    provide_general_info_only: true,
    allow_service_link: true,
    allow_team_link: true,
    allow_blog_link: true,
  },
  // Reine Informationsanfrage: keine Einschränkungen
  information: {
    show_disclaimer: false,
    redirect_to_contact: false,
    provide_general_info_only: false,
    allow_service_link: true,
    allow_team_link: true,
    allow_blog_link: true,
  },
});

module.exports = {
  PROHIBITED_RESPONSE_TYPES,
  LEGAL_ADVICE_SIGNALS,
  WEAK_LEGAL_SIGNALS,
  PROHIBITED_OUTPUT_PHRASES,
  CONFIDENCE,
  ESCALATION_RULES,
};
