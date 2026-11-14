// Settings → the ordered list of stock MeshCore CLI commands for a repeater,
// validated. Pure; shared by the guided and the quick wizard. Every command is
// in the firmware's docs/cli_commands.md (set radio, set tx, set name,
// set lat/lon, region def/allowf/save, set dutycycle, password, advert, reboot).
// Limits from the firmware: name 31 bytes (22 leaves room for a position in
// the advert), admin password 15 characters (char password[16]).

export const LIMITS = { nameBytes: 31, nameBytesWithPosition: 22, password: 15 };

const bytes = (s) => new TextEncoder().encode(s).length;
const num = (x) => (typeof x === "number" ? x : Number(String(x).replace(",", ".")));

export function validateRepeater(s) {
  const errors = [], warnings = [];
  const name = (s.name || "").trim();
  if (!name) errors.push({ field: "name", code: "required" });
  else if (bytes(name) > LIMITS.nameBytes) errors.push({ field: "name", code: "too-long" });
  else if (s.lat != null && bytes(name) > LIMITS.nameBytesWithPosition) warnings.push({ field: "name", code: "no-room-for-position" });
  if (/[\r\n]/.test(name)) errors.push({ field: "name", code: "newline" });
  const hasPos = s.lat != null || s.lon != null;
  if (hasPos) {
    const lat = num(s.lat), lon = num(s.lon);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push({ field: "lat", code: "range" });
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) errors.push({ field: "lon", code: "range" });
  }
  // Required (the wizard rules): a new repeater's admin password is "password", which anyone
  // in radio range can log in with.
  if (!s.password) errors.push({ field: "password", code: "required" });
  else {
    if (s.password.length > LIMITS.password) errors.push({ field: "password", code: "too-long" });
    if (/\s/.test(s.password)) errors.push({ field: "password", code: "whitespace" });
  }
  // Optional guest password (guided wizard, operator 2026-11-14): char guest_password[16].
  if (s.guest && (s.guest.length > LIMITS.password || /\s/.test(s.guest))) errors.push({ field: "guest", code: "invalid" });
  if (s.tx != null && s.tx !== "") {
    const tx = num(s.tx);
    if (!Number.isInteger(tx) || tx < 1 || tx > 30) errors.push({ field: "tx", code: "range" });
  }
  const r = s.radio || {};
  if (![r.freq, r.bw, r.sf, r.cr].every((v) => Number.isFinite(num(v)))) errors.push({ field: "radio", code: "incomplete" });
  if (s.scope && !/^[a-z0-9][a-z0-9-]{0,29}$/.test(s.scope)) errors.push({ field: "scope", code: "invalid" });
  for (const x of s.extraScopes || []) if (!/^[a-z0-9][a-z0-9-]{0,29}$/.test(x)) errors.push({ field: "extraScopes", code: "invalid" });
  return { errors, warnings };
}

// region def builds a chain: each name goes under the previous one, and
// "name|parent" jumps back to parent after creating it (CommonCLI.cpp). The
// wizard rules (planning/mesh/wizard-rules.md, shared with meshat.se): eu and
// europe side by side, se under eu, and the region's own scope and any
// neighbouring ones (an edge repeater) all under se.
// offgrid (backup power) sits under the county; each neighbour goes back to se first.
export function regionDef(scope, extras = [], offgrid = false) {
  const tokens = [scope && scope !== "se" ? scope : null, offgrid ? "offgrid" : null].filter(Boolean);
  for (const x of extras.filter((x) => x && x !== "se")) {
    if (tokens.length) tokens.push(`${tokens.pop()}|se`);
    tokens.push(x);
  }
  return ["region def eu|* europe|eu se", ...tokens].join(" ");
}

// An Observer build can also report to the region's own MQTT broker, through one of its
// "custom" slots (operator 2026-11-13; planning: mqtt-regional-brokers-20261112.md).
// Commands from the Observer firmware (CommonCLI_Observer.cpp): preset custom, server
// (a URI up to 63 characters; a scheme keeps it as given), port, audience (JWT login
// signed by the node's own key; empty = username/password). `preset custom` keeps the
// audience of an earlier preset, so it is always sent, empty or not.
export const MQTT_LIMITS = { slots: 6, server: 63, audience: 63 };

export function validateMqtt(m) {
  const errors = [];
  if (!m) return errors;
  const slot = Number(m.slot);
  if (!Number.isInteger(slot) || slot < 1 || slot > MQTT_LIMITS.slots) errors.push({ field: "mqtt", code: "slot" });
  if (!m.server || m.server.length > MQTT_LIMITS.server || /\s/.test(m.server)) errors.push({ field: "mqtt", code: "server" });
  const port = Number(m.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push({ field: "mqtt", code: "port" });
  if ((m.audience || "").length > MQTT_LIMITS.audience) errors.push({ field: "mqtt", code: "audience" });
  if (!m.audience && !(m.username && m.password)) errors.push({ field: "mqtt", code: "auth" });
  if (!/^[A-Z0-9]{2,8}$/.test(m.iata || "")) errors.push({ field: "mqtt", code: "iata" });
  return errors;
}

export function mqttCommands(m) {
  const n = Number(m.slot);
  const c = [`set mqtt${n}.preset custom`, `set mqtt${n}.server ${m.server}`, `set mqtt${n}.port ${Number(m.port)}`];
  c.push(m.audience ? `set mqtt${n}.audience ${m.audience}` : `set mqtt${n}.audience`);
  if (!m.audience) c.push(`set mqtt${n}.username ${m.username}`, `set mqtt${n}.password ${m.password}`);
  c.push(`set mqtt.iata ${m.iata}`);
  return c;
}

// An Observer build reports what it hears to the map over wifi (operator 2026-11-14).
// Commands from the Observer firmware (CommonCLI_Observer.cpp): wifi.ssid (up to 31
// bytes) and wifi.pwd (up to 63) take the rest of the line, so spaces are fine; mqtt.iata
// up to 7 characters; mqtt1.preset the server the region's map reads. An empty wifi
// password (an open network) is not sent.
export const OBSERVER_LIMITS = { ssid: 31, pwd: 63, iata: 7 };

export function validateObserver(o) {
  const errors = [];
  if (!o) return errors;
  const ssid = o.ssid || "";
  if (!ssid.trim() || bytes(ssid) > OBSERVER_LIMITS.ssid || /[\r\n]/.test(ssid)) errors.push({ field: "wifi", code: "ssid" });
  if (bytes(o.pwd || "") > OBSERVER_LIMITS.pwd || /[\r\n]/.test(o.pwd || "")) errors.push({ field: "wifiPwd", code: "pwd" });
  if (!/^[A-Z0-9]{2,7}$/.test(o.iata || "")) errors.push({ field: "iata", code: "iata" });
  if (!o.preset) errors.push({ field: "iata", code: "preset" });
  return errors;
}

export function observerCommands(o) {
  const c = [`set wifi.ssid ${o.ssid}`];
  if (o.pwd) c.push(`set wifi.pwd ${o.pwd}`);
  c.push(`set mqtt.iata ${o.iata}`, `set mqtt1.preset ${o.preset}`);
  return c;
}

// The commands, in the order to send them; reboot last (it drops the port).
export function repeaterCommands(s) {
  const { errors, warnings } = validateRepeater(s);
  errors.push(...validateObserver(s.observer));
  errors.push(...validateMqtt(s.mqtt));
  if (errors.length) return { commands: [], errors, warnings };
  const r = s.radio;
  const c = [];
  c.push(`set radio ${num(r.freq)},${num(r.bw)},${num(r.sf)},${num(r.cr)}`);
  if (s.tx != null && s.tx !== "") c.push(`set tx ${num(s.tx)}`);
  c.push(`set name ${s.name.trim()}`);
  if (s.lat != null && s.lon != null) {
    c.push(`set lat ${num(s.lat).toFixed(4)}`);
    c.push(`set lon ${num(s.lon).toFixed(4)}`);
  }
  c.push("set flood.max.unscoped 16");
  c.push("region allowf *");
  c.push(regionDef(s.scope, s.extraScopes, s.offgrid));
  // The county is the home region (auto-reply's test channel); the repeater's own
  // adverts go out under se, so the whole country hears them.
  if (s.scope && s.scope !== "se") c.push(`region home ${s.scope}`);
  c.push("region default se");
  c.push("region save");
  // Flood adverts every 47 h, the firmware's default: the odd number spreads them over the day.
  c.push("set flood.advert.interval 47");
  // Off-grid repeaters save power; otherwise the repeater's own setting is left alone.
  if (s.offgrid) c.push("powersaving on");
  c.push(`set dutycycle ${s.dutycycle ?? 10}`);
  c.push(`password ${s.password}`);
  if (s.guest) c.push(`set guest.password ${s.guest}`);
  if (s.observer) c.push(...observerCommands(s.observer));
  // The regional slot repeats mqtt.iata; the Observer section has already set it.
  if (s.mqtt) c.push(...mqttCommands(s.mqtt).filter((x) => !(s.observer && x.startsWith("set mqtt.iata "))));
  c.push("advert");
  c.push("reboot");
  return { commands: c, errors, warnings };
}

// A readable summary of what repeaterCommands will set, for review before sending
// (operator 2026-11-12). Same inputs, so it can never disagree with the commands.
// Missing values are "" so the page can show a dash; the password is masked.
export function repeaterReview(s) {
  const r = s.radio || {};
  const sv = (x) => String(x).replace(".", ",");
  const hasPos = s.lat != null && s.lon != null;
  return [
    { key: "name", value: (s.name || "").trim() },
    { key: "position", value: hasPos ? `${num(s.lat).toFixed(4)}, ${num(s.lon).toFixed(4)}` : "" },
    { key: "radio", value: r.freq ? `${sv(r.freq)} MHz · BW ${sv(r.bw)} kHz · SF${r.sf} · CR${r.cr}` : "" },
    { key: "regions", value: ["eu", "europe", "se", ...[s.scope, ...(s.offgrid ? ["offgrid"] : []), ...(s.extraScopes || [])].filter((x) => x && x !== "se")].join(", ") },
    { key: "dutycycle", value: `${s.dutycycle ?? 10} %` },
    { key: "password", value: s.password ? "•".repeat(s.password.length) : "" },
    ...(s.observer ? [{ key: "observer", value: `${s.observer.iata} · wifi ${s.observer.ssid}` }] : []),
    ...(s.mqtt ? [{ key: "mqtt", value: `${s.mqtt.server} (${s.mqtt.slot})` }] : []),
  ];
}

// Companions are set up in the MeshCore app (their USB link speaks the app's
// binary protocol, not this CLI), so the companion wizard gets values to enter.
export function companionSettings(s) {
  const r = s.radio || {};
  const sv = (x) => String(x).replace(".", ",");
  return [
    { key: "preset", value: r.preset || "" },
    { key: "radio", value: `${sv(r.freq)} MHz · BW ${sv(r.bw)} kHz · SF${r.sf} · CR${r.cr}` },
    { key: "name", value: (s.name || "").trim() },
    { key: "scope", value: s.scope || "" },
  ];
}
