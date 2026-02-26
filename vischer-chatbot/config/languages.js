/**
 * config/languages.js
 *
 * Sprachkonfiguration: Disclaimers, UI-Templates, Erkennungsmuster.
 * Keine URLs (diese kommen aus env.js + services.js + search.js).
 */

"use strict";

const SUPPORTED_LANGUAGES = ["de", "en", "fr", "zh"];
const DEFAULT_LANGUAGE = "de";

// ---------------------------------------------------------------------------
// DISCLAIMERS
// Müssen bei jeder Antwort auf rechtliche Anfragen erscheinen.
// ---------------------------------------------------------------------------
const DISCLAIMERS = Object.freeze({
  de: "Bitte beachten Sie: Ich bin ein Informationsassistent und kann keine Rechtsberatung leisten. Die bereitgestellten Informationen dienen ausschliesslich zu Informationszwecken und ersetzen nicht die Beratung durch einen qualifizierten Rechtsanwalt. Für rechtlichen Rat wenden Sie sich bitte direkt an einen VISCHER-Anwalt.",
  en: "Please note: I am an information assistant and cannot provide legal advice. The information provided is for informational purposes only and does not substitute consultation with a qualified attorney. For legal advice, please contact a VISCHER lawyer directly.",
  fr: "Veuillez noter: Je suis un assistant d'information et ne peux pas fournir de conseils juridiques. Les informations fournies sont uniquement à titre informatif et ne remplacent pas la consultation d'un avocat qualifié. Pour des conseils juridiques, veuillez contacter directement un avocat VISCHER.",
  zh: "请注意：我是一个信息助手，不能提供法律建议。所提供的信息仅供参考，不能替代合格律师的咨询。如需法律建议，请直接联系VISCHER律师。",
});

// ---------------------------------------------------------------------------
// RESPONSE-TEMPLATES
// Variablen: {{service_name}}, {{service_url}}, {{team_url}},
//            {{contact_url}}, {{expertise_area}}, {{blog_url}}, {{keyword}}, {{search_url}}
// ---------------------------------------------------------------------------
const TEMPLATES = Object.freeze({
  de: {
    greeting:
      "Willkommen beim VISCHER Informationsassistenten. Wie kann ich Ihnen heute helfen?",
    service_information:
      "Für Informationen zu {{service_name}} empfehle ich Ihnen diese Seite: {{service_url}}",
    team_information:
      "Das VISCHER-Team für {{service_name}} finden Sie hier: {{team_url}}",
    contact_recommendation:
      "Für Ihre Anfrage können Sie einen VISCHER-Anwalt im Bereich {{expertise_area}} kontaktieren. Fachleute finden Sie hier: {{team_url}}",
    no_results:
      "Leider konnte ich keine spezifischen Informationen zu Ihrer Anfrage finden. Bitte kontaktieren Sie uns direkt unter: {{contact_url}}",
    fallback_search:
      "Leider konnte ich keine spezifische Seite zum Thema '{{keyword}}' finden. Sie können jedoch die Suchfunktion der VISCHER-Website nutzen: {{search_url}}{{keyword}}",
    blog_suggestion:
      "Tipp: Zu diesem Thema gibt es einen passenden Blogartikel auf vischer.com. Sie finden ihn hier: {{blog_url}}",
    legal_advice_redirect:
      "Ich kann zu Ihrer spezifischen Situation keine Rechtsberatung anbieten.\n\n{{disclaimer}}\n\nFür allgemeine Informationen zum Thema {{expertise_area}} besuchen Sie bitte: {{service_url}}\n\nFür eine persönliche Beratung wenden Sie sich an unser Team: {{team_url}}",
  },
  en: {
    greeting:
      "Welcome to the VISCHER Information Assistant. How can I help you today?",
    service_information:
      "For information on {{service_name}}, I recommend visiting this page: {{service_url}}",
    team_information:
      "You can find the VISCHER team for {{service_name}} here: {{team_url}}",
    contact_recommendation:
      "For your inquiry, you may want to contact a VISCHER lawyer specialising in {{expertise_area}}. You can find specialists here: {{team_url}}",
    no_results:
      "Unfortunately, I couldn't find specific information about your query. Please contact us directly at: {{contact_url}}",
    fallback_search:
      "Unfortunately, I couldn't find a specific page about '{{keyword}}'. However, you can use the search function on the VISCHER website: {{search_url}}{{keyword}}",
    blog_suggestion:
      "Tip: There is a relevant blog post on vischer.com about this topic. You can find it here: {{blog_url}}",
    legal_advice_redirect:
      "I cannot provide legal advice regarding your specific situation.\n\n{{disclaimer}}\n\nFor general information about {{expertise_area}}, please visit: {{service_url}}\n\nFor personal consultation, please contact our team: {{team_url}}",
  },
  fr: {
    greeting:
      "Bienvenue chez l'assistant d'information VISCHER. Comment puis-je vous aider aujourd'hui?",
    service_information:
      "Pour des informations sur {{service_name}}, je vous recommande de visiter cette page: {{service_url}}",
    team_information:
      "Vous pouvez trouver l'équipe VISCHER pour {{service_name}} ici: {{team_url}}",
    contact_recommendation:
      "Pour votre demande, vous pouvez contacter un avocat VISCHER spécialisé en {{expertise_area}}. Vous trouverez des spécialistes ici: {{team_url}}",
    no_results:
      "Malheureusement, je n'ai pas trouvé d'informations spécifiques sur votre demande. Veuillez nous contacter directement à: {{contact_url}}",
    fallback_search:
      "Malheureusement, je n'ai pas pu trouver de page spécifique sur '{{keyword}}'. Vous pouvez utiliser la fonction de recherche sur le site de VISCHER: {{search_url}}{{keyword}}",
    blog_suggestion:
      "Astuce : Il existe un article de blog pertinent sur ce sujet sur vischer.com. Vous pouvez le trouver ici : {{blog_url}}",
    legal_advice_redirect:
      "Je ne peux pas fournir de conseils juridiques concernant votre situation spécifique.\n\n{{disclaimer}}\n\nPour des informations générales sur {{expertise_area}}, veuillez visiter: {{service_url}}\n\nPour une consultation personnelle, contactez notre équipe: {{team_url}}",
  },
  zh: {
    greeting: "欢迎使用VISCHER信息助手。今天我能为您提供什么帮助？",
    service_information:
      "关于{{service_name}}的信息，我建议您访问此页面：{{service_url}}",
    team_information:
      "您可以在这里找到VISCHER的{{service_name}}团队：{{team_url}}",
    contact_recommendation:
      "针对您的咨询，您可以联系VISCHER专精于{{expertise_area}}的律师。您可以在此处找到专家：{{team_url}}",
    no_results:
      "很抱歉，我找不到关于您咨询的具体信息。请直接联系我们：{{contact_url}}",
    fallback_search:
      "很遗憾，我没有找到关于'{{keyword}}'的特定页面。您可以使用VISCHER网站上的搜索功能：{{search_url}}{{keyword}}",
    blog_suggestion:
      "提示：vischer.com上有关于此主题的相关文章，您可以在这里找到：{{blog_url}}",
    legal_advice_redirect:
      "我无法就您的具体情况提供法律建议。\n\n{{disclaimer}}\n\n有关{{expertise_area}}的一般信息，请访问：{{service_url}}\n\n如需个人咨询，请联系我们的团队：{{team_url}}",
  },
});

// ---------------------------------------------------------------------------
// SPRACHERKENNUNGS-MUSTER
// Erweitert um stärkere Primärsprach-Indikatoren (Begrüssungen, Artikel, häufige Wörter)
// ---------------------------------------------------------------------------
const LANGUAGE_DETECTION_PATTERNS = Object.freeze({
  de: [
    // Explizite Sprachnennung
    /\bdeutsch\b/i,
    /\bauf deutsch\b/i,
    // Rechtsbegriffe DE
    /\banwalt\b/i,
    /\brechtsanwalt\b/i,
    /\bgesetz\b/i,
    /\brecht\b/i,
    /\bsteuer\b/i,
    /\bkündigung\b/i,
    /\bvertrag\b/i,
    /\bgmbh\b/i,
    /\baktiengesellschaft\b/i,
    // Schweizer Spezifika
    /\bschweizer\b/i,
    /\bösterreich\b/i,
    // Häufige DE-Wörter (helfen bei kurzen Anfragen)
    /\bich\b/i,
    /\bwir\b/i,
    /\bwas\b/i,
    /\bwie\b/i,
    /\bwer\b/i,
    /\bwann\b/i,
  ],
  en: [
    /\benglish\b/i,
    /\bin english\b/i,
    /\blawyer\b/i,
    /\battorney\b/i,
    /\blegal\b/i,
    /\blaw\b/i,
    /\bswiss\b/i,
    /\btax\b/i,
    /\bcontract\b/i,
    /\bcorporation\b/i,
    /\bemployment\b/i,
    /\bcompany\b/i,
    // Häufige EN-Wörter
    /\bwhat\b/i,
    /\bhow\b/i,
    /\bwho\b/i,
    /\bwhen\b/i,
    /\bdoes\b/i,
    /\bcan\b/i,
  ],
  fr: [
    /\bfrançais\b/i,
    /\ben français\b/i,
    /\bavocat\b/i,
    /\bjuridique\b/i,
    /\bdroit\b/i,
    /\bsuisse\b/i,
    /\bimpôt\b/i,
    /\bcontrat\b/i,
    /\bsociété\b/i,
    /\bemploi\b/i,
    /\bentreprise\b/i,
    // Häufige FR-Wörter / Artikel
    /\bje\b/i,
    /\bnous\b/i,
    /\bque\b/i,
    /\bcomment\b/i,
    /\bqui\b/i,
    /\bquand\b/i,
    /\bles\b/i,
    /\bdes\b/i,
  ],
  zh: [
    /中文/,
    /律师/,
    /法律/,
    /瑞士/,
    /税务/,
    /合同/,
    /公司/,
    /雇佣/,
    /企业/,
    // Häufige ZH-Zeichen
    /[\u4e00-\u9fff]{2,}/,
  ],
});

// ---------------------------------------------------------------------------
// TEAM-ANFRAGE-MUSTER
// Erkennt, wenn Benutzer speziell nach Ansprechpartnern/Experten fragen
// ---------------------------------------------------------------------------
const TEAM_QUERY_PATTERNS = Object.freeze({
  de: [
    /\bwer (ist )?zuständig für\b/i,
    /\bwer (ist )?verantwortlich für\b/i,
    /\bwer (beschäftigt sich|arbeitet) (mit|an)\b/i,
    /\bexperten? für\b/i,
    /\bspezialisten? (für|in)\b/i,
    /\bteam für\b/i,
    /\banwalt für\b/i,
    /\brechtsanwalt für\b/i,
    /\bansprechpartner für\b/i,
    /\bkontakt für\b/i,
    /\bwer (bei vischer|kann mir) (hilft?|berät?)\b/i,
  ],
  en: [
    /\bwho (is responsible|handles|works on|deals with)\b/i,
    /\bexperts? (for|in)\b/i,
    /\bspecialists? (for|in)\b/i,
    /\bteam (for|handling)\b/i,
    /\bwho specialises? in\b/i,
    /\blawyer for\b/i,
    /\battorney for\b/i,
    /\bcontact (person )?for\b/i,
    /\bwho at vischer\b/i,
    /\bpoint of contact\b/i,
  ],
  fr: [
    /\bqui (est responsable|s'occupe|travaille|traite)\b/i,
    /\bexperts? (pour|en)\b/i,
    /\bspécialistes? (pour|en)\b/i,
    /\béquipe (pour|qui)\b/i,
    /\bqui est spécialisé en\b/i,
    /\bavocat (pour|en)\b/i,
    /\bpersonne de contact (pour|en)\b/i,
    /\bqui chez vischer\b/i,
  ],
  zh: [
    /谁负责/,
    /谁处理/,
    /谁从事/,
    /谁主管/,
    /哪些律师/,
    /哪些专家/,
    /专家团队/,
    /律师团队/,
    /专业团队/,
    /VISCHER谁/,
    /负责律师/,
    /联系人/,
    /谁擅长/,
  ],
});

// ---------------------------------------------------------------------------
// RECHTSABKÜRZUNGEN (häufig verwendete Schweizer Gesetze)
// ---------------------------------------------------------------------------
const LEGAL_ABBREVIATIONS = Object.freeze({
  OR: { de: "Obligationenrecht", en: "Swiss Code of Obligations", fr: "Code des obligations", zh: "债务法" },
  ZGB: { de: "Zivilgesetzbuch", en: "Swiss Civil Code", fr: "Code civil suisse", zh: "民法典" },
  StGB: { de: "Strafgesetzbuch", en: "Swiss Criminal Code", fr: "Code pénal suisse", zh: "刑法典" },
  DSG: { de: "Datenschutzgesetz", en: "Data Protection Act", fr: "Loi sur la protection des données", zh: "数据保护法" },
  DSGVO: { de: "Datenschutz-Grundverordnung (EU)", en: "GDPR", fr: "RGPD", zh: "欧盟通用数据保护条例" },
  MSchG: { de: "Markenschutzgesetz", en: "Trademark Protection Act", fr: "Loi sur la protection des marques", zh: "商标保护法" },
  PatG: { de: "Patentgesetz", en: "Patent Act", fr: "Loi sur les brevets", zh: "专利法" },
  URG: { de: "Urheberrechtsgesetz", en: "Copyright Act", fr: "Loi sur le droit d'auteur", zh: "版权法" },
  ArG: { de: "Arbeitsgesetz", en: "Employment Act", fr: "Loi sur le travail", zh: "劳动法" },
  MWSTG: { de: "Mehrwertsteuergesetz", en: "VAT Act", fr: "Loi sur la TVA", zh: "增值税法" },
  DBG: { de: "Direktes Bundessteuergesetz", en: "Federal Direct Tax Act", fr: "Loi fédérale sur l'impôt fédéral direct", zh: "联邦直接税法" },
  SchKG: { de: "Schuldbetreibungs- und Konkursgesetz", en: "Debt Enforcement and Bankruptcy Act", fr: "Loi fédérale sur la poursuite et la faillite", zh: "债务追缴和破产法" },
  GwG: { de: "Geldwäschereigesetz", en: "Anti-Money Laundering Act", fr: "Loi sur le blanchiment d'argent", zh: "反洗钱法" },
  FINMAG: { de: "Finanzmarktaufsichtsgesetz", en: "Financial Market Supervision Act", fr: "Loi sur la surveillance des marchés financiers", zh: "金融市场监管法" },
});

/**
 * Füllt ein Template mit Werten.
 * @param {string} template - Template mit {{variable}}-Platzhaltern
 * @param {Object} vars - Key-Value-Paare
 * @returns {string}
 */
function renderTemplate(template, vars = {}) {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value ?? ""),
    template
  );
}

module.exports = {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  DISCLAIMERS,
  TEMPLATES,
  LANGUAGE_DETECTION_PATTERNS,
  TEAM_QUERY_PATTERNS,
  LEGAL_ABBREVIATIONS,
  renderTemplate,
};
