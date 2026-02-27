/**
 * config/services.js
 *
 * Kanonisches Service-Register — migriert auf Strapi CMS (Headless Frontend).
 *
 * MIGRATION-HINWEIS (TYPO3 → Strapi):
 * numericId = ehemals TYPO3 ll_catalog Filter-ID, jetzt Strapi-Entity-ID.
 * slug      = Strapi-Slug, wird für Team-Filter-URLs und Expertise-Seiten verwendet.
 *
 * STRUKTUR eines Service-Eintrags:
 * {
 *   id:        <kanonischer Key (sprachunabhängig, englisch)>,
 *   numericId: <Strapi Entity ID>,
 *   slug:      <Strapi URL-Slug (EN, für URL-Building)>,
 *   label:     { de, en, fr, zh },   // Anzeigename für Templates
 *   paths:     { de, en, fr, zh },   // Pfad relativ zur Sprach-Basis-URL (/expertise/<slug>)
 * }
 *
 * GEÄNDERTE SERVICES (TYPO3 → Strapi / Rebranding):
 *   data_privacy          → data_ai              (Label: "Data Privacy" → "Data & AI")
 *   information_technology_law → ict_emerging_tech (Label: "ICT & Emerging Tech")
 *   sports_law            → sports_business       (Label: "Sports Business")
 *   transport_aviation    → gleiche ID, neues Label "Transport/Aviation/Space"
 *
 * NEUE SERVICES:
 *   insurance             (Strapi ID: 1462)
 *   regulatory_compliance (Strapi ID: 1415)
 *
 * SITEMAP-UPDATE: Wenn sich Slugs ändern, nur hier anpassen.
 */

"use strict";

const SERVICES = Object.freeze([
  {
    id: "legal_profession_law",
    numericId: "1366",
    slug: "legal-profession-law",
    label: { de: "Anwaltsrecht", en: "Legal Profession Law", fr: "Droit de la profession d'avocat", zh: "法律职业法" },
    paths: {
      de: "/expertise/legal-profession-law",
      en: "/expertise/legal-profession-law",
      fr: "/expertise/legal-profession-law",
      zh: "/expertise/legal-profession-law",
    },
  },
  {
    id: "employment_law",
    numericId: "1522",
    slug: "employment-law",
    label: { de: "Arbeitsrecht", en: "Employment Law", fr: "Droit du travail", zh: "劳动及就业" },
    paths: {
      de: "/expertise/employment-law",
      en: "/expertise/employment-law",
      fr: "/expertise/employment-law",
      zh: "/expertise/employment-law",
    },
  },
  {
    id: "banking_finance",
    numericId: "1529",
    slug: "banking-and-finance",
    label: { de: "Banken und Finanzmarktrecht", en: "Banking & Finance", fr: "Droit bancaire et financier", zh: "银行及金融" },
    paths: {
      de: "/expertise/banking-and-finance",
      en: "/expertise/banking-and-finance",
      fr: "/expertise/banking-and-finance",
      zh: "/expertise/banking-and-finance",
    },
  },
  {
    id: "pension_funds",
    numericId: "1427",
    slug: "pension-funds",
    label: { de: "Berufliche Vorsorge / Sozialversicherungsrecht", en: "Pension Funds", fr: "Prévoyance professionnelle / Droit des assurances sociales", zh: "养老基金" },
    paths: {
      de: "/expertise/pension-funds",
      en: "/expertise/pension-funds",
      fr: "/expertise/pension-funds",
      zh: "/expertise/pension-funds",
    },
  },
  {
    id: "china_desk",
    numericId: "1438",
    slug: "china-desk",
    label: { de: "China Desk", en: "China Desk", fr: "China Desk", zh: "中国业务" },
    paths: {
      de: "/expertise/china-desk",
      en: "/expertise/china-desk",
      fr: "/expertise/china-desk",
      zh: "/expertise/china-desk",
    },
  },
  {
    id: "data_ai",
    numericId: "1448",
    slug: "data-and-ai",
    label: { de: "Data & AI", en: "Data & AI", fr: "Data & AI", zh: "数据与人工智能" },
    paths: {
      de: "/expertise/data-and-privacy",
      en: "/expertise/data-and-ai",
      fr: "/expertise/data-and-privacy",
      zh: "/expertise/data-and-privacy",
    },
  },
  {
    id: "energy",
    numericId: "1450",
    slug: "energy",
    label: { de: "Energie", en: "Energy", fr: "Énergie", zh: "能源" },
    paths: {
      de: "/expertise/energy",
      en: "/expertise/energy",
      fr: "/expertise/energy",
      zh: "/expertise/energy",
    },
  },
  {
    id: "corporate_commercial",
    numericId: "1593",
    slug: "corporate-and-commercial",
    label: { de: "Gesellschafts- und Handelsrecht", en: "Corporate and Commercial", fr: "Droit des sociétés et droit commercial", zh: "公司法和商法" },
    paths: {
      de: "/expertise/corporate-and-commercial",
      en: "/expertise/corporate-and-commercial",
      fr: "/expertise/corporate-and-commercial",
      zh: "/expertise/corporate-and-commercial",
    },
  },
  {
    id: "health_care",
    numericId: "1400",
    slug: "health-care",
    label: { de: "Gesundheitswesen", en: "Health Care", fr: "Santé", zh: "医疗保健" },
    paths: {
      de: "/expertise/health-care",
      en: "/expertise/health-care",
      fr: "/expertise/health-care",
      zh: "/expertise/health-care",
    },
  },
  {
    id: "intellectual_property",
    numericId: "1442",
    slug: "intellectual-property",
    label: { de: "Immaterialgüterrecht", en: "Intellectual Property", fr: "Propriété intellectuelle", zh: "知识产权" },
    paths: {
      de: "/expertise/intellectual-property",
      en: "/expertise/intellectual-property",
      fr: "/expertise/intellectual-property",
      zh: "/expertise/intellectual-property",
    },
  },
  {
    id: "immigration",
    numericId: "1449",
    slug: "immigration",
    label: { de: "Immigration / Migration", en: "Immigration", fr: "Droit de la migration", zh: "移民" },
    paths: {
      de: "/expertise/immigration",
      en: "/expertise/immigration",
      fr: "/expertise/immigration",
      zh: "/expertise/immigration",
    },
  },
  {
    id: "insurance",
    numericId: "1462",
    slug: "insurance",
    label: { de: "Versicherungsrecht", en: "Insurance", fr: "Droit des assurances", zh: "保险法" },
    paths: {
      de: "/expertise/insurance",
      en: "/expertise/insurance",
      fr: "/expertise/insurance",
      zh: "/expertise/insurance",
    },
  },
  {
    id: "real_estate",
    numericId: "1367",
    slug: "real-estate",
    label: { de: "Immobilien", en: "Real Estate", fr: "Droit de l'immobilier", zh: "房地产" },
    paths: {
      de: "/expertise/real-estate",
      en: "/expertise/real-estate",
      fr: "/expertise/real-estate",
      zh: "/expertise/real-estate",
    },
  },
  {
    id: "ict_emerging_tech",
    numericId: "1413",
    slug: "ict-and-emerging-tech",
    label: { de: "ICT & Emerging Tech", en: "ICT & Emerging Tech", fr: "ICT & Emerging Tech", zh: "ICT与新兴技术" },
    paths: {
      de: "/expertise/information-and-communication-technology",
      en: "/expertise/ict-and-emerging-tech",
      fr: "/expertise/information-and-communication-technology",
      zh: "/expertise/information-and-communication-technology",
    },
  },
  {
    id: "judicial_assistance",
    numericId: "1422",
    slug: "international-judicial-assistance",
    label: { de: "Internationale Rechtshilfe", en: "International Judicial Assistance", fr: "Entraide judiciaire internationale", zh: "国际司法协助" },
    paths: {
      de: "/expertise/international-judicial-assistance",
      en: "/expertise/international-judicial-assistance",
      fr: "/expertise/international-judicial-assistance",
      zh: "/expertise/international-judicial-assistance",
    },
  },
  {
    id: "investigations_ediscovery",
    numericId: "1423",
    slug: "internal-investigations-and-e-discovery",
    label: { de: "Investigations & E-Discovery", en: "Internal Investigations & eDiscovery", fr: "Investigations & E-Discovery", zh: "内部调查及电子取证" },
    paths: {
      de: "/expertise/investigations-and-e-discovery",
      en: "/expertise/internal-investigations-and-e-discovery",
      fr: "/expertise/investigations-and-e-discovery",
      zh: "/expertise/investigations-and-e-discovery",
    },
  },
  {
    id: "antitrust",
    numericId: "1369",
    slug: "antitrust-and-competition",
    label: { de: "Kartell- und Wettbewerbsrecht", en: "Antitrust and Competition", fr: "Droit des cartels et de la concurrence", zh: "反垄断法和竞争法" },
    paths: {
      de: "/expertise/antitrust-and-competition",
      en: "/expertise/antitrust-and-competition",
      fr: "/expertise/antitrust-and-competition",
      zh: "/expertise/antitrust-and-competition",
    },
  },
  {
    id: "life_sciences",
    numericId: "1437",
    slug: "life-sciences-pharma-biotech",
    label: { de: "Life Sciences / Pharma / Biotechnologie", en: "Life Sciences, Pharma, Biotech", fr: "Life Sciences / Pharma / Biotechnologie", zh: "生命科学医药生物技术" },
    paths: {
      de: "/expertise/life-sciences-pharma-biotech",
      en: "/expertise/life-sciences-pharma-biotech",
      fr: "/expertise/life-sciences-pharma-biotech",
      zh: "/expertise/life-sciences-pharma-biotech",
    },
  },
  {
    id: "media_entertainment",
    numericId: "1424",
    slug: "media-and-entertainment",
    label: { de: "Medien und Unterhaltung", en: "Media and Entertainment", fr: "Médias et divertissement", zh: "传媒和娱乐" },
    paths: {
      de: "/expertise/media-and-entertainment",
      en: "/expertise/media-and-entertainment",
      fr: "/expertise/media-and-entertainment",
      zh: "/expertise/media-and-entertainment",
    },
  },
  {
    id: "mergers_acquisitions",
    numericId: "1590",
    slug: "mergers-and-acquisitions",
    label: { de: "Mergers & Acquisitions", en: "Mergers & Acquisitions", fr: "Fusions & Acquisitions", zh: "并购" },
    paths: {
      de: "/expertise/mergers-and-acquisitions",
      en: "/expertise/mergers-and-acquisitions",
      fr: "/expertise/mergers-and-acquisitions",
      zh: "/expertise/mergers-and-acquisitions",
    },
  },
  {
    id: "notaries",
    numericId: "1370",
    slug: "civil-law-notaries",
    label: { de: "Notariat", en: "Civil Law Notaries", fr: "Notariat", zh: "公证" },
    paths: {
      de: "/expertise/civil-law-notaries",
      en: "/expertise/civil-law-notaries",
      fr: "/expertise/civil-law-notaries",
      zh: "/expertise/civil-law-notaries",
    },
  },
  {
    id: "private_equity",
    numericId: "1372",
    slug: "private-equity-and-venture-capital",
    label: { de: "Private Equity / Venture Capital", en: "Private Equity & Venture Capital", fr: "Private Equity / Capital-risque", zh: "私募股权风险投资企业融资" },
    paths: {
      de: "/expertise/private-equity-and-venture-capital",
      en: "/expertise/private-equity-and-venture-capital",
      fr: "/expertise/private-equity-and-venture-capital",
      zh: "/expertise/private-equity-and-venture-capital",
    },
  },
  {
    id: "private_clients",
    numericId: "1331",
    slug: "private-clients",
    label: { de: "Privatkunden", en: "Private Clients", fr: "Clientèle privée", zh: "私人客户" },
    paths: {
      de: "/expertise/private-clients",
      en: "/expertise/private-clients",
      fr: "/expertise/private-clients",
      zh: "/expertise/private-clients",
    },
  },
  {
    id: "litigation",
    numericId: "1518",
    slug: "litigation-and-arbitration",
    label: { de: "Prozessführung und Schiedsgerichtsbarkeit", en: "Litigation and Arbitration", fr: "Contentieux et arbitrage", zh: "诉讼和仲裁" },
    paths: {
      de: "/expertise/litigation-and-arbitration",
      en: "/expertise/litigation-and-arbitration",
      fr: "/expertise/litigation-and-arbitration",
      zh: "/expertise/litigation-and-arbitration",
    },
  },
  {
    id: "public_sector",
    numericId: "1339",
    slug: "public-sector-and-regulatory",
    label: { de: "Public Sector und Regulatory", en: "Public Sector and Regulatory", fr: "Secteur public et marchés réglementés", zh: "公共部门和市场监管" },
    paths: {
      de: "/expertise/public-sector-and-regulatory",
      en: "/expertise/public-sector-and-regulatory",
      fr: "/expertise/public-sector-and-regulatory",
      zh: "/expertise/public-sector-and-regulatory",
    },
  },
  {
    id: "regulatory_compliance",
    numericId: "1415",
    slug: "regulatory-administrative-procedures-and-compliance",
    label: {
      de: "Regulierung, Verwaltungsverfahren & Compliance",
      en: "Regulatory, Administrative Procedures & Compliance",
      fr: "Réglementation, Procédures Administratives & Compliance",
      zh: "监管、行政程序与合规",
    },
    paths: {
      de: "/expertise/regulatory-administrative-procedures-and-compliance",
      en: "/expertise/regulatory-administrative-procedures-and-compliance",
      fr: "/expertise/regulatory-administrative-procedures-and-compliance",
      zh: "/expertise/regulatory-administrative-procedures-and-compliance",
    },
  },
  {
    id: "restructuring",
    numericId: "1390",
    slug: "restructuring-and-insolvency",
    label: { de: "Restrukturierung und Insolvenz", en: "Restructuring & Insolvency", fr: "Restructuration et insolvabilité", zh: "企业重组与破产" },
    paths: {
      de: "/expertise/restructuring-and-insolvency",
      en: "/expertise/restructuring-and-insolvency",
      fr: "/expertise/restructuring-and-insolvency",
      zh: "/expertise/restructuring-and-insolvency",
    },
  },
  {
    id: "sports_business",
    numericId: "1299",
    slug: "sports-law",
    label: { de: "Sports Business", en: "Sports Business", fr: "Sports Business", zh: "体育商业" },
    paths: {
      de: "/expertise/sports-law",
      en: "/expertise/sports-law",
      fr: "/expertise/sports-law",
      zh: "/expertise/sports-law",
    },
  },
  {
    id: "startup_desk",
    numericId: "1343",
    slug: "startup-desk",
    label: { de: "Startup Desk", en: "Startup Desk", fr: "Startup Desk", zh: "初创公司业务" },
    paths: {
      de: "/expertise/startup-desk",
      en: "/expertise/startup-desk",
      fr: "/expertise/startup-desk",
      zh: "/expertise/startup-desk",
    },
  },
  {
    id: "tax",
    numericId: "1319",
    slug: "tax",
    label: { de: "Steuern", en: "Tax", fr: "Droit fiscal", zh: "税务" },
    paths: {
      de: "/expertise/tax",
      en: "/expertise/tax",
      fr: "/expertise/tax",
      zh: "/expertise/tax",
    },
  },
  {
    id: "esg",
    numericId: "1395",
    slug: "environmental-social-and-governance-esg",
    label: { de: "ESG (Environmental, Social & Governance)", en: "Environmental, Social and Governance (ESG)", fr: "ESG (Environnemental, Social et Gouvernance)", zh: "环境社会和公司治理 (ESG)" },
    paths: {
      de: "/expertise/environmental-social-and-governance-esg",
      en: "/expertise/environmental-social-and-governance-esg",
      fr: "/expertise/environmental-social-and-governance-esg",
      zh: "/expertise/environmental-social-and-governance-esg",
    },
  },
  {
    id: "transport_aviation",
    numericId: "1398",
    slug: "transport-aviation",
    label: { de: "Transport/Aviation/Space", en: "Transport/Aviation/Space", fr: "Transport/Aviation/Space", zh: "交通/航空/航天" },
    paths: {
      de: "/expertise/transport-aviation",
      en: "/expertise/transport-aviation",
      fr: "/expertise/transport-aviation",
      zh: "/expertise/transport-aviation",
    },
  },
  {
    id: "white_collar_crime",
    numericId: "1223",
    slug: "white-collar-crime",
    label: { de: "Wirtschaftsstrafrecht", en: "White-collar crime", fr: "Droit pénal économique", zh: "经济犯罪" },
    paths: {
      de: "/expertise/white-collar-crime",
      en: "/expertise/white-collar-crime",
      fr: "/expertise/white-collar-crime",
      zh: "/expertise/white-collar-crime",
    },
  },
]);

// ---------------------------------------------------------------------------
// ABSCHNITTS-PFADE (Expertise-Übersicht, Team, Insights, Karriere, Kontakt)
// Pfade sind relativ zur Sprach-Basis-URL (LANG_PREFIX aus env.js wird vorangestellt).
// Neue Struktur: TYPO3 → Strapi/Headless mit vereinheitlichten EN-Slugs.
// ---------------------------------------------------------------------------
const SECTION_PATHS = Object.freeze({
  de: {
    expertises_base: "/expertise/",
    team: "/team",
    insights: "/insights/",
    news: "/insights/news/",
    events: "/insights/events/",
    publications: "/insights/publications/",
    deals_cases: "/insights/deals-cases/",
    blog: "/insights/blog/",
    about: "/about-us/",
    careers: "/careers/",
    vacancies: "/careers/vacancies/",
    contact: "/contact/",
  },
  en: {
    expertises_base: "/expertise/",
    team: "/team",
    insights: "/insights/",
    news: "/insights/news/",
    events: "/insights/events/",
    publications: "/insights/publications/",
    deals_cases: "/insights/deals-cases/",
    blog: "/insights/blog/",
    about: "/about-us/",
    careers: "/careers/",
    vacancies: "/careers/vacancies/",
    contact: "/contact/",
  },
  fr: {
    expertises_base: "/expertise/",
    team: "/team",
    insights: "/insights/",
    news: "/insights/news/",
    events: "/insights/events/",
    publications: "/insights/publications/",
    deals_cases: "/insights/deals-cases/",
    blog: "/insights/blog/",
    about: "/about-us/",
    careers: "/careers/",
    vacancies: "/careers/vacancies/",
    contact: "/contact/",
  },
  zh: {
    expertises_base: "/expertise/",
    team: "/team",
    insights: "/insights/",
    news: "/insights/news/",
    events: "/insights/events/",
    publications: "/insights/publications/",
    deals_cases: "/insights/deals-cases/",
    blog: "/insights/blog/",
    about: "/about-us/",
    careers: "/careers/",
    vacancies: "/careers/vacancies/",
    contact: "/contact/",
  },
});

// ---------------------------------------------------------------------------
// LOOKUP-HILFSFUNKTIONEN
// ---------------------------------------------------------------------------

/** Sucht einen Service per kanonischem ID. */
function getServiceById(id) {
  return SERVICES.find((s) => s.id === id) ?? null;
}

/** Sucht einen Service per Strapi-ID (ehemals TYPO3 numericId). */
function getServiceByNumericId(numericId) {
  return SERVICES.find((s) => s.numericId === String(numericId)) ?? null;
}

/** Sucht einen Service per URL-Slug. */
function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

/** Gibt den Pfad eines Services für eine Sprache zurück. */
function getServicePath(serviceId, lang) {
  const service = getServiceById(serviceId);
  if (!service) return null;
  return service.paths[lang] ?? null;
}

/** Gibt alle Services als Array zurück. */
function getAllServices() {
  return [...SERVICES];
}

module.exports = {
  SERVICES,
  SECTION_PATHS,
  getServiceById,
  getServiceByNumericId,
  getServiceBySlug,
  getServicePath,
  getAllServices,
};
