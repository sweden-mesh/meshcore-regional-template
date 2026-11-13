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
  if (s.password != null && s.password !== "") {
    if (s.password.length > LIMITS.password) errors.push({ field: "password", code: "too-long" });
    if (/\s/.test(s.password)) errors.push({ field: "password", code: "whitespace" });
  }
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
// region's own scope and any neighbouring ones (an edge repeater) all go under se.
export function regionDef(scope, extras = []) {
  const under = [scope, ...extras].filter((x) => x && x !== "se");
  return ["region def se", ...under.map((x, i) => (i < under.length - 1 ? `${x}|se` : x))].join(" ");
}

// The commands, in the order to send them; reboot last (it drops the port).
export function repeaterCommands(s) {
  const { errors, warnings } = validateRepeater(s);
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
  c.push(regionDef(s.scope, s.extraScopes));
  c.push("region allowf *");
  c.push("region save");
  c.push(`set dutycycle ${s.dutycycle ?? 10}`);
  if (s.password) c.push(`password ${s.password}`);
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
    { key: "regions", value: ["se", ...[s.scope, ...(s.extraScopes || [])].filter((x) => x && x !== "se")].join(", ") },
    { key: "dutycycle", value: `${s.dutycycle ?? 10} %` },
    { key: "password", value: s.password ? "•".repeat(s.password.length) : "" },
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
