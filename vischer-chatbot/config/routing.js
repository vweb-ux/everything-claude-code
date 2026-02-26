/**
 * config/routing.js
 *
 * Intent-Erkennung und Topic-zu-Service-Mapping.
 *
 * DESIGN-ENTSCHEIDUNG (Behobenes Problem aus der alten Config):
 * Alt: service_name_mapping und topic_keyword_mapping waren zwei separate,
 *      unverbundene Systeme mit unterschiedlicher Granularität und potenzieller Drift.
 *      Keys waren inkonsistent zwischen Sprachen (keine Normalisierung).
 *
 * Neu: Ein einziges normalisiertes Routing-System.
 *      Jeder Eintrag mappt auf einen kanonischen Service-Key aus services.js.
 *      Keywords sind Regex-Patterns für robustere Erkennung.
 *      RAG-Strategie ist pro Service konfigurierbar.
 *
 * WARTUNG:
 *   - Neue Keyword-Aliase hier eintragen (im richtigen Sprach-Block)
 *   - Den kanonischen Service-Key aus services.js verwenden
 *   - Keine neuen Service-IDs hier erfinden
 */

"use strict";

// ---------------------------------------------------------------------------
// KEYWORD-TO-SERVICE MAPPING
// Struktur: Array von { pattern: RegExp, serviceId: string, lang?: string }
// lang ist optional — ohne lang gilt das Pattern für alle Sprachen
// ---------------------------------------------------------------------------

/**
 * Topic-Keyword-Mapping pro Sprache.
 * Jeder Eintrag: { patterns: RegExp[], serviceId: string }
 * Reihenfolge: spezifischere Patterns zuerst (erste Übereinstimmung gewinnt).
 */
const TOPIC_ROUTING = Object.freeze({
  de: [
    { serviceId: "china_desk", patterns: [/\bchina\b/i, /\bchinesisch\b/i, /\bhongkong\b/i, /\bhong kong\b/i, /\basien\b/i, /\bshanghai\b/i, /\bpeking\b/i, /\bjoint venture.*china\b/i] },
    { serviceId: "data_privacy", patterns: [/\bdatenschutz\b/i, /\bdsgvo\b/i, /\bdatenschutzgesetz\b/i, /\bdsg\b/i, /\bdatenverarbeitung\b/i, /\bdatenschutzverletzung\b/i, /\bdatensicherheit\b/i, /\bprivacy\b/i, /\bdatenschutzbeauftragter\b/i] },
    { serviceId: "mergers_acquisitions", patterns: [/\bm&a\b/i, /\bmergers?\b/i, /\bacquisitions?\b/i, /\bübernahme\b/i, /\bfusion\b/i, /\bunternehmenszusammenschluss\b/i, /\bunternehmenskauf\b/i, /\bdue diligence\b/i] },
    { serviceId: "startup_desk", patterns: [/\bstartup\b/i, /\bstart-up\b/i, /\bjunge unternehmen\b/i, /\bgründung\b/i, /\bneugründung\b/i] },
    { serviceId: "private_equity", patterns: [/\bprivate equity\b/i, /\bventure capital\b/i, /\bvc\b/i, /\bpe\b/i] },
    { serviceId: "esg", patterns: [/\besg\b/i, /\bumwelt.*recht\b/i, /\bnachhaltig\b/i, /\bgovernance\b/i, /\bcsr\b/i] },
    { serviceId: "life_sciences", patterns: [/\blife sciences?\b/i, /\bpharma\b/i, /\bbiotechnologie\b/i, /\bmedizinprodukt\b/i, /\barzneimittel\b/i] },
    { serviceId: "employment_law", patterns: [/\bkündigung\b/i, /\barbeitgeber\b/i, /\barbeitnehmer\b/i, /\barbeitsvertrag\b/i, /\blohn\b/i, /\bgehalt\b/i, /\bpersonal\b/i, /\bbefristung\b/i, /\barbeitsrecht\b/i, /\barbeitsverhältnis\b/i] },
    { serviceId: "tax", patterns: [/\bsteuer/i, /\bbesteuerung\b/i, /\bsteuerrecht\b/i, /\bsteuerberater\b/i, /\bsteuerpflicht\b/i, /\bquellensteuer\b/i, /\bmehrwertsteuer\b/i, /\bmwst\b/i, /\bveranlagung\b/i] },
    { serviceId: "real_estate", patterns: [/\bimmobilie\b/i, /\bgrundstück\b/i, /\bmiete\b/i, /\bmietvertrag\b/i, /\bliegenschaft\b/i, /\bbaurecht\b/i, /\bwohnungseigentum\b/i] },
    { serviceId: "corporate_commercial", patterns: [/\bgmbh\b/i, /\baktiengesellschaft\b/i, /\b\bag\b/i, /\baktionär\b/i, /\bgesellschaftsrecht\b/i, /\bhandelsrecht\b/i, /\bfirmenrecht\b/i, /\bverwaltungsrat\b/i] },
    { serviceId: "intellectual_property", patterns: [/\bimmaterialgüterrecht\b/i, /\burheberrecht\b/i, /\bpatentrecht\b/i, /\bpatent\b/i, /\bmarkenrecht\b/i, /\bmarke\b/i, /\b\bip\b\b/i, /\bdesignrecht\b/i] },
    { serviceId: "immigration", patterns: [/\bimmigration\b/i, /\bmigration\b/i, /\beinwanderung\b/i, /\baufenthaltsbewilligung\b/i, /\barbeitserlaubnis\b/i] },
    { serviceId: "banking_finance", patterns: [/\bbank\b/i, /\bfinanzmarkt\b/i, /\bfinanzrecht\b/i, /\bkredit\b/i, /\bfinanzierung\b/i, /\bkapitalmarkt\b/i] },
    { serviceId: "litigation", patterns: [/\bprozess\b/i, /\bschiedsgericht\b/i, /\bschiedsgerichtsbarkeit\b/i, /\bprozessführung\b/i, /\bklage\b/i, /\barbitrage\b/i] },
    { serviceId: "restructuring", patterns: [/\brestrukturierung\b/i, /\binsolvenz\b/i, /\bkonkurs\b/i, /\bbetreibung\b/i] },
    { serviceId: "white_collar_crime", patterns: [/\bwirtschaftsstrafrecht\b/i, /\bwirtschaftskriminalität\b/i, /\bbetrug\b/i, /\bkorruption\b/i, /\bgeldwäsche\b/i] },
    { serviceId: "sports_law", patterns: [/\bsportrecht\b/i, /\bsportvertrag\b/i, /\bsportveranstaltung\b/i, /\bsportler\b/i, /\btransferrecht\b/i] },
    { serviceId: "transport_aviation", patterns: [/\btransport\b/i, /\bluftfahrt\b/i, /\baviation\b/i, /\bfluggesellschaft\b/i] },
    { serviceId: "pension_funds", patterns: [/\bvorsorge\b/i, /\bsozialversicherung\b/i, /\bpensionskasse\b/i, /\buvg\b/i, /\bahv\b/i, /\biv\b/i] },
    { serviceId: "health_care", patterns: [/\bgesundheit\b/i, /\bkrankenhaus\b/i, /\bklinik\b/i, /\bmedizin\b/i, /\bgesundheitswesen\b/i] },
    { serviceId: "public_sector", patterns: [/\bpublic sector\b/i, /\bregulatory\b/i, /\böffentliche\b/i, /\bverwaltungsrecht\b/i, /\bregulierung\b/i] },
    { serviceId: "judicial_assistance", patterns: [/\brechtshilfe\b/i, /\binternationale rechtshilfe\b/i] },
    { serviceId: "investigations_ediscovery", patterns: [/\binvestigation\b/i, /\bediscovery\b/i, /\binterne untersuchung\b/i] },
    { serviceId: "media_entertainment", patterns: [/\bmedienrecht\b/i, /\bunterhaltungsrecht\b/i, /\bmedien\b/i] },
    { serviceId: "notaries", patterns: [/\bnotar\b/i, /\bnotariat\b/i, /\bbeglaubigung\b/i] },
    { serviceId: "energy", patterns: [/\benergie\b/i, /\bstrom\b/i, /\bgas\b/i, /\berneuerbr\b/i, /\benergieprojekt\b/i] },
    { serviceId: "private_clients", patterns: [/\bprivatkunden\b/i, /\bprivatpersonen\b/i, /\brevision\b/i, /\bnachlass\b/i, /\berbrecht\b/i] },
    { serviceId: "information_technology_law", patterns: [/\bit-recht\b/i, /\binformationsrecht\b/i, /\bkommunikationsrecht\b/i, /\btelekommunikation\b/i, /\btechnologierecht\b/i] },
    { serviceId: "antitrust", patterns: [/\bkartellrecht\b/i, /\bwettbewerbsrecht\b/i, /\bwettbewerbsbehörde\b/i] },
    { serviceId: "legal_profession_law", patterns: [/\banwaltsrecht\b/i, /\banwaltskammer\b/i] },
  ],

  en: [
    { serviceId: "china_desk", patterns: [/\bchina\b/i, /\bchinese\b/i, /\bhong kong\b/i, /\basia\b/i, /\bshanghai\b/i, /\bbeijing\b/i] },
    { serviceId: "data_privacy", patterns: [/\bdata (protection|privacy|security)\b/i, /\bgdpr\b/i, /\bdpo\b/i, /\bdata breach\b/i, /\bprivacy policy\b/i] },
    { serviceId: "mergers_acquisitions", patterns: [/\bm&a\b/i, /\bmergers?\b/i, /\bacquisitions?\b/i, /\btakeover\b/i, /\bbusiness combination\b/i, /\bdue diligence\b/i] },
    { serviceId: "startup_desk", patterns: [/\bstartup\b/i, /\bstart-up\b/i, /\bfounding\b/i, /\bnew company\b/i] },
    { serviceId: "private_equity", patterns: [/\bprivate equity\b/i, /\bventure capital\b/i, /\b\bpe\b\b/i, /\b\bvc\b\b/i] },
    { serviceId: "esg", patterns: [/\besg\b/i, /\benvironmental law\b/i, /\bsustainability\b/i, /\bgovernance\b/i, /\bcorporate responsibility\b/i] },
    { serviceId: "life_sciences", patterns: [/\blife sciences?\b/i, /\bpharma(ceutical)?\b/i, /\bbiotech\b/i, /\bmedical device\b/i] },
    // intellectual_property MUSS vor real_estate stehen — "intellectual property rights" enthält "property"
    { serviceId: "intellectual_property", patterns: [/\bintellectual property\b/i, /\b\bip\b\b/i, /\bcopyright\b/i, /\bpatent(s|right)?\b/i, /\btrademark\b/i, /\btrade mark\b/i] },
    { serviceId: "employment_law", patterns: [/\btermination\b/i, /\bemployer\b/i, /\bemployee\b/i, /\bemployment contract\b/i, /\bsalary\b/i, /\bwage\b/i, /\bHR\b/i, /\bemployment law\b/i] },
    { serviceId: "tax", patterns: [/\btax(ation)?\b/i, /\btax law\b/i, /\btax advisor\b/i, /\bVAT\b/i, /\bwithholding tax\b/i, /\bincome tax\b/i] },
    { serviceId: "real_estate", patterns: [/\breal estate\b/i, /\brent(al)?\b/i, /\blease(hold)?\b/i, /\bbuilding law\b/i] },
    { serviceId: "corporate_commercial", patterns: [/\bcorporate\b/i, /\bcompany law\b/i, /\bcommercial law\b/i, /\bshareholder\b/i, /\bboard of directors\b/i, /\bllc\b/i] },
    { serviceId: "immigration", patterns: [/\bimmigration\b/i, /\bmigration\b/i, /\bwork permit\b/i, /\bresidence permit\b/i, /\bvisa\b/i] },
    { serviceId: "banking_finance", patterns: [/\bbanking\b/i, /\bfinance\b/i, /\bfinancial law\b/i, /\bcredit\b/i, /\bfinancing\b/i, /\bcapital market\b/i] },
    { serviceId: "litigation", patterns: [/\blitigation\b/i, /\barbitration\b/i, /\bdispute resolution\b/i, /\bcourt\b/i, /\blawsuit\b/i] },
    { serviceId: "restructuring", patterns: [/\brestructuring\b/i, /\binsolvency\b/i, /\bbankruptcy\b/i] },
    { serviceId: "white_collar_crime", patterns: [/\bwhite.collar\b/i, /\beconomic crime\b/i, /\bfraud\b/i, /\bcorruption\b/i, /\bmoney laundering\b/i] },
    { serviceId: "sports_law", patterns: [/\bsports? law\b/i, /\bsports? contract\b/i, /\bathletes?\b/i, /\btransfer rights?\b/i] },
    { serviceId: "transport_aviation", patterns: [/\btransport\b/i, /\baviation\b/i, /\bairline\b/i, /\bshipping\b/i] },
    { serviceId: "pension_funds", patterns: [/\bpension\b/i, /\bsocial (security|insurance)\b/i, /\bretirement\b/i] },
    { serviceId: "health_care", patterns: [/\bhealth(care)?\b/i, /\bhospital\b/i, /\bmedical\b/i, /\bpharmacy\b/i] },
    { serviceId: "public_sector", patterns: [/\bpublic sector\b/i, /\bregulatory\b/i, /\bgovernment law\b/i, /\badministrative law\b/i] },
    { serviceId: "judicial_assistance", patterns: [/\bjudicial assistance\b/i, /\binternational legal assistance\b/i] },
    { serviceId: "investigations_ediscovery", patterns: [/\binvestigation\b/i, /\bediscovery\b/i, /\binternal investigation\b/i] },
    { serviceId: "media_entertainment", patterns: [/\bmedia law\b/i, /\bentertainment law\b/i] },
    { serviceId: "notaries", patterns: [/\bnotar(ies|y)\b/i, /\bcertification\b/i, /\bauthentication\b/i] },
    { serviceId: "energy", patterns: [/\benergy\b/i, /\brenewable\b/i, /\belectricity\b/i, /\bgas\b/i] },
    { serviceId: "private_clients", patterns: [/\bprivate clients?\b/i, /\bhigh net worth\b/i, /\bestate\b/i, /\binheritance\b/i] },
    { serviceId: "information_technology_law", patterns: [/\bit law\b/i, /\btechnology law\b/i, /\bcyber\b/i, /\btelecommunication\b/i] },
    { serviceId: "antitrust", patterns: [/\bantitrust\b/i, /\bcompetition law\b/i, /\bcartel\b/i] },
    { serviceId: "legal_profession_law", patterns: [/\blegal profession\b/i, /\blawyer law\b/i] },
  ],

  fr: [
    { serviceId: "china_desk", patterns: [/\bchine\b/i, /\bchinois\b/i, /\bhong kong\b/i, /\basie\b/i, /\bshanghai\b/i, /\bpékin\b/i] },
    { serviceId: "data_privacy", patterns: [/\bprotection des données\b/i, /\brgpd\b/i, /\bconfidentialité\b/i, /\bviolation de données\b/i] },
    { serviceId: "mergers_acquisitions", patterns: [/\bfusions?\b/i, /\bacquisitions?\b/i, /\bm&a\b/i, /\bf&a\b/i, /\bdue diligence\b/i] },
    { serviceId: "startup_desk", patterns: [/\bstartup\b/i, /\bstart-up\b/i, /\bcréation d'entreprise\b/i] },
    { serviceId: "private_equity", patterns: [/\bprivate equity\b/i, /\bcapital-risque\b/i, /\bcapital investissement\b/i] },
    { serviceId: "esg", patterns: [/\besg\b/i, /\benvironnemental\b/i, /\bdurabilité\b/i, /\bgouvernance\b/i] },
    { serviceId: "life_sciences", patterns: [/\blife sciences?\b/i, /\bpharma\b/i, /\bbiotechnologie\b/i, /\bmédicament\b/i] },
    { serviceId: "employment_law", patterns: [/\blicenciement\b/i, /\bemployeur\b/i, /\bemployé\b/i, /\bcontrat de travail\b/i, /\bsalaire\b/i, /\bdroit du travail\b/i] },
    { serviceId: "tax", patterns: [/\bimpôt\b/i, /\bfiscalité\b/i, /\bdroit fiscal\b/i, /\btva\b/i] },
    { serviceId: "real_estate", patterns: [/\bimmobilier\b/i, /\bloyer\b/i, /\bbail\b/i, /\bpropriété\b/i, /\bdroit de la construction\b/i] },
    { serviceId: "corporate_commercial", patterns: [/\bdroit des sociétés\b/i, /\bdroit commercial\b/i, /\bactionnaire\b/i, /\bconseil d'administration\b/i] },
    { serviceId: "intellectual_property", patterns: [/\bpropriété intellectuelle\b/i, /\bbrevet\b/i, /\bmarque\b/i, /\bdroit d'auteur\b/i] },
    { serviceId: "immigration", patterns: [/\bimmigration\b/i, /\bmigration\b/i, /\bpermis de travail\b/i, /\bpermis de séjour\b/i] },
    { serviceId: "banking_finance", patterns: [/\bdroit bancaire\b/i, /\bfinancier\b/i, /\bcrédit\b/i, /\bfinancement\b/i] },
    { serviceId: "litigation", patterns: [/\bcontentieux\b/i, /\barbitrage\b/i, /\brésolution des litiges\b/i, /\btribunal\b/i] },
    { serviceId: "restructuring", patterns: [/\brestructuration\b/i, /\binsolvabilité\b/i, /\bfaillite\b/i] },
    { serviceId: "white_collar_crime", patterns: [/\bpenal économique\b/i, /\bcriminalité économique\b/i, /\bfraud\b/i, /\bcorruption\b/i] },
    { serviceId: "sports_law", patterns: [/\bdroit du sport\b/i, /\bcontrat sportif\b/i, /\bathlètes?\b/i] },
    { serviceId: "transport_aviation", patterns: [/\btransport\b/i, /\baviation\b/i, /\bcompagnie aérienne\b/i] },
    { serviceId: "pension_funds", patterns: [/\bprévoyance\b/i, /\bassurances sociales\b/i, /\bretraite\b/i] },
    { serviceId: "health_care", patterns: [/\bsanté\b/i, /\bhôpital\b/i, /\bmédical\b/i] },
    { serviceId: "public_sector", patterns: [/\bsecteur public\b/i, /\bréglementaire\b/i, /\bdroit administratif\b/i] },
    { serviceId: "information_technology_law", patterns: [/\bdroit de l'information\b/i, /\bdroit informatique\b/i, /\bcyber\b/i] },
    { serviceId: "antitrust", patterns: [/\bcartels?\b/i, /\bconcurrence\b/i, /\bdroit de la concurrence\b/i] },
    { serviceId: "notaries", patterns: [/\bnotaire\b/i, /\bnotariat\b/i, /\bauthentification\b/i] },
    { serviceId: "energy", patterns: [/\bénergie\b/i, /\brenouvelable\b/i, /\bélectricité\b/i] },
    { serviceId: "private_clients", patterns: [/\bclientèle privée\b/i, /\bhéritage\b/i, /\bsuccession\b/i] },
    { serviceId: "legal_profession_law", patterns: [/\bprofession d'avocat\b/i, /\bbarreau\b/i] },
  ],

  zh: [
    { serviceId: "china_desk", patterns: [/中国/, /中国业务/, /香港/, /亚洲/, /上海/, /北京/, /合资企业.*中国/] },
    { serviceId: "data_privacy", patterns: [/数据保护/, /个人信息保护/, /数据安全/, /隐私/, /数据泄露/] },
    { serviceId: "mergers_acquisitions", patterns: [/并购/, /合并/, /收购/, /兼并/, /尽职调查/] },
    { serviceId: "startup_desk", patterns: [/初创/, /创业/, /新公司/, /成立公司/] },
    { serviceId: "private_equity", patterns: [/私募/, /风投/, /风险投资/, /股权投资/] },
    { serviceId: "esg", patterns: [/esg/i, /环境.*社会/, /可持续/, /公司治理/] },
    { serviceId: "life_sciences", patterns: [/生命科学/, /医药/, /生物技术/, /制药/, /药品/] },
    { serviceId: "employment_law", patterns: [/劳动/, /就业/, /解雇/, /雇主/, /雇员/, /劳动合同/, /工资/, /劳动法/] },
    { serviceId: "tax", patterns: [/税/, /税务/, /税法/, /增值税/, /所得税/] },
    { serviceId: "real_estate", patterns: [/房产/, /地产/, /租金/, /租约/, /不动产/, /建筑法/] },
    { serviceId: "corporate_commercial", patterns: [/有限公司/, /股份公司/, /股东/, /董事会/, /公司法/, /商法/] },
    { serviceId: "intellectual_property", patterns: [/知识产权/, /专利/, /商标/, /版权/, /著作权/] },
    { serviceId: "immigration", patterns: [/移民/, /居留许可/, /工作许可/, /签证/] },
    { serviceId: "banking_finance", patterns: [/银行/, /金融/, /融资/, /贷款/, /信贷/] },
    { serviceId: "litigation", patterns: [/诉讼/, /仲裁/, /争议解决/, /打官司/] },
    { serviceId: "restructuring", patterns: [/重组/, /破产/, /倒闭/] },
    { serviceId: "white_collar_crime", patterns: [/经济犯罪/, /白领犯罪/, /欺诈/, /腐败/, /洗钱/] },
    { serviceId: "sports_law", patterns: [/体育/, /体育法/, /运动员/, /体育合同/] },
    { serviceId: "transport_aviation", patterns: [/运输/, /航空/, /航空公司/] },
    { serviceId: "pension_funds", patterns: [/养老/, /社会保险/, /退休/] },
    { serviceId: "health_care", patterns: [/医疗/, /保健/, /医院/, /医药法/] },
    { serviceId: "public_sector", patterns: [/公共部门/, /监管/, /行政法/] },
    { serviceId: "information_technology_law", patterns: [/信息法/, /通讯法/, /网络安全/, /电信/] },
    { serviceId: "antitrust", patterns: [/反垄断/, /竞争法/, /卡特尔/] },
    { serviceId: "notaries", patterns: [/公证/, /认证/] },
    { serviceId: "energy", patterns: [/能源/, /电力/, /可再生能源/] },
    { serviceId: "private_clients", patterns: [/私人客户/, /遗产/, /继承/] },
    { serviceId: "investigations_ediscovery", patterns: [/调查/, /电子取证/, /内部调查/] },
    { serviceId: "legal_profession_law", patterns: [/法律职业/, /律师职业/] },
  ],
});

// ---------------------------------------------------------------------------
// RAG-STRATEGIE PRO SERVICE
// Bestimmt Suchtiefe und Relevanz-Schwellenwert für Knowledge-System-Abfragen
// ---------------------------------------------------------------------------
const RAG_STRATEGY = Object.freeze({
  default: {
    search_depth: 3,
    max_results: 5,
    relevance_threshold: 0.7,
    blog_relevance_threshold: 0.7,
  },
  // Services, die von tieferer Suche profitieren (komplexe, vielschichtige Themen)
  overrides: {
    tax:                  { search_depth: 5, max_results: 8, relevance_threshold: 0.6 },
    life_sciences:        { search_depth: 5, max_results: 8, relevance_threshold: 0.6 },
    data_privacy:         { search_depth: 4, max_results: 6, relevance_threshold: 0.65 },
    banking_finance:      { search_depth: 4, max_results: 6, relevance_threshold: 0.65 },
    mergers_acquisitions: { search_depth: 4, max_results: 6, relevance_threshold: 0.65 },
    white_collar_crime:   { search_depth: 4, max_results: 6, relevance_threshold: 0.65 },
  },
});

// ---------------------------------------------------------------------------
// ROUTING-LOGIK
// ---------------------------------------------------------------------------

/**
 * Findet den besten Service-Match für einen Query-Text in einer Sprache.
 * Gibt den ersten Match zurück (Reihenfolge = Priorität).
 *
 * @param {string} query - Benutzeranfrage (Originaltext)
 * @param {string} lang  - Sprachcode ('de' | 'en' | 'fr' | 'zh')
 * @returns {string|null} Kanonischer Service-Key oder null
 */
function detectServiceFromQuery(query, lang) {
  const routes = TOPIC_ROUTING[lang] ?? TOPIC_ROUTING.de;
  for (const { serviceId, patterns } of routes) {
    if (patterns.some((pattern) => pattern.test(query))) {
      return serviceId;
    }
  }
  return null;
}

/**
 * Gibt alle Service-Matches für einen Query zurück (nicht nur den ersten).
 * Nützlich, wenn mehrere Themen erkannt werden.
 *
 * @param {string} query
 * @param {string} lang
 * @returns {string[]} Array kanonischer Service-Keys
 */
function detectAllServicesFromQuery(query, lang) {
  const routes = TOPIC_ROUTING[lang] ?? TOPIC_ROUTING.de;
  const matches = [];
  for (const { serviceId, patterns } of routes) {
    if (patterns.some((pattern) => pattern.test(query))) {
      matches.push(serviceId);
    }
  }
  return matches;
}

/**
 * Gibt die RAG-Strategie für einen Service zurück.
 *
 * @param {string|null} serviceId
 * @returns {{ search_depth: number, max_results: number, relevance_threshold: number }}
 */
function getRagStrategy(serviceId) {
  if (serviceId && RAG_STRATEGY.overrides[serviceId]) {
    return { ...RAG_STRATEGY.default, ...RAG_STRATEGY.overrides[serviceId] };
  }
  return { ...RAG_STRATEGY.default };
}

module.exports = {
  TOPIC_ROUTING,
  RAG_STRATEGY,
  detectServiceFromQuery,
  detectAllServicesFromQuery,
  getRagStrategy,
};
