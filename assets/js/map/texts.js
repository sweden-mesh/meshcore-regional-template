// The map's own texts. Swedish defaults here (so the unit tests run without a page);
// map.html passes the site's language as JSON in #map's data-texts and main.js calls
// setTexts() before anything renders. "{n}" in a text is replaced by t(key, { n }).
const SV = {
  legend: "Teckenförklaring",
  lg_active: "repeater, hörd nyligen (prick = exakt plats)",
  lg_stale: "repeater, inte hörd på länge",
  lg_observer: "◉ observatör (rapporterar till kartan)",
  lg_link: "grannlänk",
  lg_link_strong: "vald nods länkar: röd sällan, grön ofta",
  lg_flow: "paket i rörelse",
  type_1: "Companion", type_2: "Repeater", type_3: "Rumsserver", type_4: "Sensor", type_node: "Nod",
  observer: "observatör", stale: "inaktuell", foreign: "troligen utanför regionen",
  heard: "Senast hörd", radio: "Radio", neighbours: "Kända grannar", unnamed: "Namnlös nod",
  loading: "Hämtar…", load_failed: "Kunde inte hämta detaljer.",
  seeded: "Känd från en annan Beacon; regionens egen har inte hört den än.",
  unknown: "okänt", just_now: "nyss", min_ago: "{n} min sedan", h_ago: "{n} h sedan", d_ago: "{n} d sedan",
  decimal: ",",
  pk_ADVERT: "Annons", pk_GRP_TXT: "Kanalmeddelande", pk_TXT_MSG: "Direktmeddelande", pk_ACK: "Kvittens",
  pk_PATH: "Väg", pk_REQ: "Förfrågan", pk_RESPONSE: "Svar", pk_TRACE: "Trace",
  heard_times: "hörd {n}×", hops: "{n} hopp", route_unknown: "vägen okänd",
  lg_cov: "täckning: {q}",
  lg_cov_old: "blekare: senast uppmätt för över 90 dagar sedan",
  lg_cov_dead: "död zon: uppmätt, inget kom fram",
  cov_heading: "Täckning", cov_credit: "Täckning: MeshMapper",
  cov_dead_heading: "Död zon",
  cov_quality: "Kvalitet",
  cov_q_0: "svag",
  cov_q_1: "ojämn",
  cov_q_2: "god",
  cov_q_3: "stabil",
  cov_best: "Bästa kontakt",
  cov_pings: "Pingar",
  cov_last: "Senast uppmätt",
  cov_BIDIR: "tvåvägs",
  cov_DISC: "svar på förfrågan",
  cov_TX: "sändning nådde nätet",
  cov_RX: "hörde nätet",
  cov_DEAD: "repeater utan vidare",
  cov_DROP: "ingen kontakt",
  lg_wanted: "önskad plats för en ny repeater (cirka 1 km)",
  want_popup: "Här vill regionen gärna ha en ny repeater.",
};
let texts = { ...SV };

export function setTexts(obj) { texts = { ...SV, ...(obj || {}) }; }
export function t(key, vars = {}) {
  let s = texts[key] ?? SV[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
