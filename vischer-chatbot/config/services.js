/**
 * config/services.js
 *
 * Kanonisches Service-Register.
 *
 * DESIGN-ENTSCHEIDUNG (Behobenes Problem aus der alten Config):
 *
 * Alt: 4x duplizierte Service-Keys (einer pro Sprache), 4x duplizierte numeric IDs.
 *      Keys waren inkonsistent: "anwaltsrecht" / "legal_profession_law" / "droit_profession_avocat".
 *      Keine gemeinsame Referenz — Cross-Sprach-Lookups unmöglich.
 *
 * Neu: Jeder Service hat einen einzigen kanonischen Key (sprachunabhängig, englisch).
 *      Numeric ID steht einmal. Pfade pro Sprache stehen in einem Objekt.
 *      Aliase (für Keyword-Routing) werden getrennt in routing.js gepflegt.
 *
 * STRUKTUR eines Service-Eintrags:
 * {
 *   id: <kanonischer Key>,
 *   numericId: <Typo3-Filter-ID aus dem Team-Finder-System>,
 *   label: { de, en, fr, zh },     // Anzeigename für Templates
 *   paths: { de, en, fr, zh },     // Pfad relativ zur Sprach-Basis-URL
 * }
 *
 * SITEMAP-UPDATE: Wenn sich Pfade ändern, nur hier anpassen.
 * Die numeric IDs sind stabil (kommen aus dem CMS-Backend) und ändern sich nicht bei URL-Änderungen.
 */

"use strict";

const SERVICES = Object.freeze([
  {
    id: "legal_profession_law",
    numericId: "1253",
    label: { de: "Anwaltsrecht", en: "Legal Profession Law", fr: "Droit de la profession d'avocat", zh: "法律职业法" },
    paths: {
      de: "/dienstleistungen/anwaltsrecht/",
      en: "/services/legal-profession-law/",
      fr: "/services/droit-de-la-profession-davocat/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E6%B3%95%E5%BE%8B%E8%81%8C%E4%B8%9A%E6%B3%95/",
    },
  },
  {
    id: "employment_law",
    numericId: "725",
    label: { de: "Arbeitsrecht", en: "Employment Law", fr: "Droit du travail", zh: "劳动及就业" },
    paths: {
      de: "/dienstleistungen/arbeitsrecht/",
      en: "/services/employment-law/",
      fr: "/services/droit-du-travail/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%8A%B3%E5%8A%A8%E5%8F%8A%E5%B0%B1%E4%B8%9A/",
    },
  },
  {
    id: "banking_finance",
    numericId: "726",
    label: { de: "Banken und Finanzmarktrecht", en: "Banking & Finance", fr: "Droit bancaire et financier", zh: "银行及金融" },
    paths: {
      de: "/dienstleistungen/banken-und-finanzmarktrecht/",
      en: "/services/banking-finance/",
      fr: "/services/droit-bancaire-et-financier/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E9%93%B6%E8%A1%8C%E5%8F%8A%E9%87%91%E8%9E%8D/",
    },
  },
  {
    id: "pension_funds",
    numericId: "727",
    label: { de: "Berufliche Vorsorge / Sozialversicherungsrecht", en: "Pension Funds", fr: "Prévoyance professionnelle / Droit des assurances sociales", zh: "养老基金" },
    paths: {
      de: "/dienstleistungen/berufliche-vorsorge-sozialversicherungsrecht/",
      en: "/services/pension-funds/",
      fr: "/services/prevoyance-professionnelle-droit-des-assurances-sociales/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%85%BB%E8%80%81%E5%9F%BA%E9%87%91/",
    },
  },
  {
    id: "china_desk",
    numericId: "728",
    label: { de: "China Desk", en: "China Desk", fr: "China Desk", zh: "中国业务" },
    paths: {
      de: "/dienstleistungen/china-desk/",
      en: "/services/china-desk/",
      fr: "/services/china-desk/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E4%B8%AD%E5%9B%BD%E4%B8%9A%E5%8A%A1/",
    },
  },
  {
    id: "data_privacy",
    numericId: "730",
    label: { de: "Data Privacy", en: "Data Privacy", fr: "Data Privacy", zh: "数据及隐私权保护" },
    paths: {
      de: "/dienstleistungen/data-privacy/",
      en: "/services/data-privacy/",
      fr: "/services/data-privacy/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E6%95%B0%E6%8D%AE%E5%8F%8A%E9%9A%90%E7%A7%81%E6%9D%83%E4%BF%9D%E6%8A%A4/",
    },
  },
  {
    id: "energy",
    numericId: "731",
    label: { de: "Energie", en: "Energy", fr: "Énergie", zh: "能源" },
    paths: {
      de: "/dienstleistungen/energie/",
      en: "/services/energy-1/",
      fr: "/services/energie/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E8%83%BD%E6%BA%90/",
    },
  },
  {
    id: "corporate_commercial",
    numericId: "732",
    label: { de: "Gesellschafts- und Handelsrecht", en: "Corporate & Commercial", fr: "Droit des sociétés et droit commercial", zh: "公司法和商法" },
    paths: {
      de: "/dienstleistungen/gesellschafts-und-handelsrecht/",
      en: "/services/corporate-and-commercial/",
      fr: "/services/droit-des-societes-et-droit-commercial/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%85%AC%E5%8F%B8%E6%B3%95%E5%92%8C%E5%95%86%E6%B3%95/",
    },
  },
  {
    id: "health_care",
    numericId: "733",
    label: { de: "Gesundheitswesen", en: "Health Care", fr: "Santé", zh: "医疗保健" },
    paths: {
      de: "/dienstleistungen/gesundheitswesen/",
      en: "/services/health-care/",
      fr: "/services/sante/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%8C%BB%E7%96%97%E4%BF%9D%E5%81%A5/",
    },
  },
  {
    id: "intellectual_property",
    numericId: "734",
    label: { de: "Immaterialgüterrecht", en: "Intellectual Property", fr: "Propriété intellectuelle", zh: "知识产权" },
    paths: {
      de: "/dienstleistungen/immaterialgueterrecht/",
      en: "/services/intellectual-property/",
      fr: "/services/propriete-intellectuelle/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83/",
    },
  },
  {
    id: "immigration",
    numericId: "735",
    label: { de: "Immigration / Migration", en: "Immigration", fr: "Droit de la migration", zh: "移民" },
    paths: {
      de: "/dienstleistungen/immigration/",
      en: "/services/immigration/",
      fr: "/services/droit-de-la-migration/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%A7%BB%E6%B0%91/",
    },
  },
  {
    id: "real_estate",
    numericId: "736",
    label: { de: "Immobilien", en: "Real Estate", fr: "Droit de l'immobilier", zh: "房地产" },
    paths: {
      de: "/dienstleistungen/immobilien/",
      en: "/services/real-estate/",
      fr: "/services/droit-de-limmobilier/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E6%88%BF%E5%9C%B0%E4%BA%A7/",
    },
  },
  {
    id: "information_technology_law",
    numericId: "737",
    label: { de: "Informations- und Kommunikationsrecht", en: "Information & Communication Technology Law", fr: "Droit de l'information et de la communication", zh: "信息与通讯" },
    paths: {
      de: "/dienstleistungen/informations-und-kommunikationsrecht/",
      en: "/services/information-and-communication-technology/",
      fr: "/services/droit-de-linformation-et-de-la-communication/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E4%BF%A1%E6%81%AF%E4%B8%8E%E9%80%9A%E8%AE%AF/",
    },
  },
  {
    id: "judicial_assistance",
    numericId: "953",
    label: { de: "Internationale Rechtshilfe", en: "International Judicial Assistance", fr: "Entraide judiciaire internationale", zh: "国际司法协助" },
    paths: {
      de: "/dienstleistungen/internationale-rechtshilfe/",
      en: "/services/international-judicial-assistance/",
      fr: "/services/entraide-judiciaire-internationale-en-matiere-civile-et-penale/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%9B%BD%E9%99%85%E5%8F%B8%E6%B3%95%E5%8D%8F%E5%8A%A9/",
    },
  },
  {
    id: "investigations_ediscovery",
    numericId: "1532",
    label: { de: "Investigations & E-Discovery", en: "Investigations & E-Discovery", fr: "Investigations & E-Discovery", zh: "调查及电子取证" },
    paths: {
      de: "/dienstleistungen/investigations-ediscovery/",
      en: "/services/investigations-ediscovery/",
      fr: "/services/investigations-ediscovery/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E8%B0%83%E6%9F%A5%E5%8F%8A%E7%94%B5%E5%AD%90%E5%8F%96%E8%AF%81/",
    },
  },
  {
    id: "antitrust",
    numericId: "738",
    label: { de: "Kartell- und Wettbewerbsrecht", en: "Antitrust & Competition", fr: "Droit des cartels et de la concurrence", zh: "反垄断法和竞争法" },
    paths: {
      de: "/dienstleistungen/kartell-und-wettbewerbsrecht/",
      en: "/services/antitrust-and-competition/",
      fr: "/services/droit-des-cartels-et-de-la-concurrence/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%8F%8D%E5%9E%84%E6%96%AD%E6%B3%95%E5%92%8C%E7%AB%9E%E4%BA%89%E6%B3%95/",
    },
  },
  {
    id: "life_sciences",
    numericId: "740",
    label: { de: "Life Sciences / Pharma / Biotechnologie", en: "Life Sciences / Pharma / Biotech", fr: "Life Sciences / Pharma / Biotechnologie", zh: "生命科学医药生物技术" },
    paths: {
      de: "/dienstleistungen/life-sciences-pharma-biotechnologie/",
      en: "/services/life-sciences-pharma-biotech/",
      fr: "/services/life-sciences-pharma-biotechnologie/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%94%9F%E5%91%BD%E7%A7%91%E5%AD%A6%E5%8C%BB%E8%8D%AF%E7%94%9F%E7%89%A9%E6%8A%80%E6%9C%AF/",
    },
  },
  {
    id: "media_entertainment",
    numericId: "742",
    label: { de: "Medien und Unterhaltung", en: "Media & Entertainment", fr: "Médias et divertissement", zh: "传媒和娱乐" },
    paths: {
      de: "/dienstleistungen/medien-und-unterhaltung/",
      en: "/services/media-and-entertainment/",
      fr: "/services/medias-et-divertissement/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E4%BC%A0%E5%AA%92%E5%92%8C%E5%A8%B1%E4%B9%90/",
    },
  },
  {
    id: "mergers_acquisitions",
    numericId: "743",
    label: { de: "Mergers & Acquisitions", en: "Mergers & Acquisitions", fr: "Fusions & Acquisitions", zh: "并购" },
    paths: {
      de: "/dienstleistungen/mergers-acquisitions/",
      en: "/services/mergers-acquisitions/",
      fr: "/services/fusions-acquisitions/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%B9%B6%E8%B4%AD/",
    },
  },
  {
    id: "notaries",
    numericId: "744",
    label: { de: "Notariat", en: "Civil Law Notaries", fr: "Notariat", zh: "公证" },
    paths: {
      de: "/dienstleistungen/notariat/",
      en: "/services/civil-law-notaries/",
      fr: "/services/notariat/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%85%AC%E8%AF%81/",
    },
  },
  {
    id: "private_equity",
    numericId: "950",
    label: { de: "Private Equity / Venture Capital", en: "Private Equity / Venture Capital", fr: "Private Equity / Capital-risque", zh: "私募股权风险投资企业融资" },
    paths: {
      de: "/dienstleistungen/private-equity-venture-capital/",
      en: "/services/private-equity-venture-capital/",
      fr: "/services/private-equity-venture-capital/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%A7%81%E5%8B%9F%E8%82%A1%E6%9D%83%E9%A3%8E%E9%99%A9%E6%8A%95%E8%B5%84%E4%BC%81%E4%B8%9A%E8%9E%8D%E8%B5%84/",
    },
  },
  {
    id: "private_clients",
    numericId: "746",
    label: { de: "Privatkunden", en: "Private Clients", fr: "Clientèle privée", zh: "私人客户" },
    paths: {
      de: "/dienstleistungen/privatkunden/",
      en: "/services/private-clients/",
      fr: "/services/clientele-privee/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%A7%81%E4%BA%BA%E5%AE%A2%E6%88%B7/",
    },
  },
  {
    id: "litigation",
    numericId: "949",
    label: { de: "Prozessführung und Schiedsgerichtsbarkeit", en: "Litigation & Arbitration", fr: "Contentieux et arbitrage", zh: "诉讼和仲裁" },
    paths: {
      de: "/dienstleistungen/prozessfuehrung-und-schiedsgerichtsbarkeit/",
      en: "/services/litigation-and-arbitration/",
      fr: "/services/contentieux-et-arbitrage/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E8%AF%89%E8%AE%BC%E5%92%8C%E4%BB%B2%E8%A3%81/",
    },
  },
  {
    id: "public_sector",
    numericId: "748",
    label: { de: "Public Sector und Regulatory", en: "Public Sector & Regulatory", fr: "Secteur public et marchés réglementés", zh: "公共部门和市场监管" },
    paths: {
      de: "/dienstleistungen/public-sector-und-regulatory/",
      en: "/services/public-sector-regulatory/",
      fr: "/services/secteur-public-et-marches-reglementes/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%85%AC%E5%85%B1%E9%83%A8%E9%97%A8%E5%92%8C%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1/",
    },
  },
  {
    id: "restructuring",
    numericId: "749",
    label: { de: "Restrukturierung und Insolvenz", en: "Restructuring & Insolvency", fr: "Restructuration et insolvabilité", zh: "企业重组与破产" },
    paths: {
      de: "/dienstleistungen/restrukturierung-und-insolvenz/",
      en: "/services/restructuring-insolvency/",
      fr: "/services/restructuration-et-insolvabilite/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E4%BC%81%E4%B8%9A%E9%87%8D%E7%BB%84%E4%B8%8E%E7%A0%B4%E4%BA%A7/",
    },
  },
  {
    id: "sports_law",
    numericId: "750",
    label: { de: "Sportrecht", en: "Sports Law", fr: "Droit du sport", zh: "体育法" },
    paths: {
      de: "/dienstleistungen/sportrecht/",
      en: "/services/sports-law/",
      fr: "/services/droit-du-sport/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E4%BD%93%E8%82%B2%E6%B3%95/",
    },
  },
  {
    id: "startup_desk",
    numericId: "751",
    label: { de: "Startup Desk", en: "Startup Desk", fr: "Startup Desk", zh: "初创公司业务" },
    paths: {
      de: "/dienstleistungen/startup-desk/",
      en: "/services/startup-desk/",
      fr: "/services/startup-desk/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E5%88%9D%E5%88%9B%E5%85%AC%E5%8F%B8%E4%B8%9A%E5%8A%A1/",
    },
  },
  {
    id: "tax",
    numericId: "752",
    label: { de: "Steuern", en: "Tax", fr: "Droit fiscal", zh: "税务" },
    paths: {
      de: "/dienstleistungen/steuern/",
      en: "/services/tax/",
      fr: "/services/droit-fiscal/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%A8%8E%E5%8A%A1/",
    },
  },
  {
    id: "esg",
    numericId: "2145",
    label: { de: "ESG (Environmental, Social & Governance)", en: "ESG", fr: "ESG (Environnemental, Social et Gouvernance)", zh: "环境社会和公司治理 (ESG)" },
    paths: {
      de: "/dienstleistungen/environmental-social-and-governance-esg/",
      en: "/services/environmental-social-and-governance-esg/",
      fr: "/services/environnemental-social-et-gouvernance-esg/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%8E%AF%E5%A2%83%E7%A4%BE%E4%BC%9A%E5%92%8C%E5%85%AC%E5%8F%B8%E6%B2%BB%E7%90%86-esg/",
    },
  },
  {
    id: "transport_aviation",
    numericId: "741",
    label: { de: "Transport und Luftfahrt", en: "Transport & Aviation", fr: "Transports & Aviation", zh: "运输-航空" },
    paths: {
      de: "/dienstleistungen/transport-luftfahrt/",
      en: "/services/transport-aviation/",
      fr: "/services/transports-aviations/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E8%BF%90%E8%BE%93-%E8%88%AA%E7%A9%BA/",
    },
  },
  {
    id: "white_collar_crime",
    numericId: "753",
    label: { de: "Wirtschaftsstrafrecht", en: "White-Collar Crime", fr: "Droit pénal économique", zh: "经济犯罪" },
    paths: {
      de: "/dienstleistungen/wirtschaftsstrafrecht/",
      en: "/services/white-collar-crime/",
      fr: "/services/droit-penal-economique/",
      zh: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/%E7%BB%8F%E6%B5%8E%E7%8A%AF%E7%BD%AA/",
    },
  },
]);

// ---------------------------------------------------------------------------
// ABSCHNITTS-PFADE (Team, Know-How, Karriere, Kontakt)
// BUG-FIX: zh.vacancies zeigte auf EN-Pfad "/careers/vacancies/" — korrigiert.
// ---------------------------------------------------------------------------
const SECTION_PATHS = Object.freeze({
  de: {
    services_base: "/dienstleistungen/",
    team: "/team/",
    team_members: "/team/teammitglieder-finden/",
    know_how: "/know-how/",
    news: "/know-how/vischer-neuigkeiten/",
    events: "/know-how/events/",
    publications: "/know-how/publikationen-praesentationen/",
    deals_cases: "/know-how/deals-cases/",
    blog: "/know-how/blog/",
    careers: "/karriere/",
    vacancies: "/karriere/offene-stellen/",
    contact: "/kontakt/",
  },
  en: {
    services_base: "/services/",
    team: "/team/",
    team_members: "/team/find-team-members/",
    knowledge: "/knowledge/",
    news: "/knowledge/vischer-news/",
    events: "/knowledge/events/",
    publications: "/knowledge/publications-presentations/",
    deals_cases: "/knowledge/deals-cases/",
    blog: "/knowledge/blog/",
    careers: "/careers/",
    vacancies: "/careers/vacancies/",
    contact: "/contact/",
  },
  fr: {
    services_base: "/services/",
    team: "/equipe/",
    team_members: "/equipe/trouver-des-membres-de-lequipe/",
    know_how: "/savoir-faire/",
    news: "/savoir-faire/nouvelles-vischer/",
    events: "/savoir-faire/evenements/",
    publications: "/savoir-faire/publications-et-presentations/",
    deals_cases: "/savoir-faire/transactions-et-affaires/",
    blog: "/savoir-faire/blog/",
    careers: "/carrieres/",
    vacancies: "/carrieres/postes-a-pourvoir/",
    contact: "/contact/",
  },
  zh: {
    services_base: "/%E4%B8%9A%E5%8A%A1%E9%A2%86%E5%9F%9F/",
    team: "/%E4%B8%93%E4%B8%9A%E5%9B%A2%E9%98%9F/",
    team_members: "/%E4%B8%93%E4%B8%9A%E5%9B%A2%E9%98%9F/%E6%9F%A5%E8%AF%A2%E5%BE%8B%E5%B8%88/",
    know_how: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/",
    news: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/vischer%E6%96%B0%E9%97%BB/",
    events: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/%E6%B4%BB%E5%8A%A8/",
    publications: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/%E5%87%BA%E7%89%88%E7%89%A9%E6%BC%94%E8%AE%B2/",
    deals_cases: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/%E4%BA%A4%E6%98%93%E6%A1%88%E4%BB%B6/",
    blog: "/%E4%B8%93%E4%B8%9A%E7%9F%9A%E8%AF%86/%E5%8D%9A%E5%AE%A2/",
    careers: "/%E4%BA%BA%E6%89%8D%E6%8B%9B%E5%8B%9F/",
    // BUG-FIX: War /careers/vacancies/ (EN) — korrigiert auf ZH-Pfad
    vacancies: "/%E4%BA%BA%E6%89%8D%E6%8B%9B%E5%8B%9F/%E7%A9%BA%E7%BC%BA%E8%81%8C%E4%BD%8D/",
    contact: "/%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC/",
  },
});

// ---------------------------------------------------------------------------
// LOOKUP-HILFSFUNKTIONEN
// ---------------------------------------------------------------------------

/** Sucht einen Service per kanonischem ID. */
function getServiceById(id) {
  return SERVICES.find((s) => s.id === id) ?? null;
}

/** Sucht einen Service per numeric CMS-ID. */
function getServiceByNumericId(numericId) {
  return SERVICES.find((s) => s.numericId === String(numericId)) ?? null;
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
  getServicePath,
  getAllServices,
};
