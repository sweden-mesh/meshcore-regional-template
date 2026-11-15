// One floating panel for the map: pill toggles (aria-pressed buttons) and a
// small legend, styled after the design direction (swe.meshmapper.net-like
// pills). Replaces MapLibre's stock checkbox boxes.
// A toggle with showWhen: "<key>" is shown only while that toggle is on; a legend
// item with when: ["<key>", …] only while all those toggles are on. The legend
// hides itself when nothing in it is shown.
import { t } from "./texts.js";

export class MapPanel {
  constructor({ toggles, legend, onToggle }) {
    this.toggles = toggles; // [{ key, label, on, showWhen? }]
    this.legend = legend;   // [{ labelCvd?, text?, swatch: "pill-active"|"pill-stale"|"pill-observer"|"link"|"link-strong"|"flow"|"cov-0".."cov-3"|"cov-old"|"cov-dead", label, when? }]
    this.onToggle = onToggle;
  }

  onAdd() {
    const box = document.createElement("div");
    box.className = "maplibregl-ctrl map-panel";
    const row = document.createElement("div");
    row.className = "map-pills";
    this.buttons = new Map();
    for (const t of this.toggles) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "map-pill";
      b.textContent = t.label;
      b.setAttribute("aria-pressed", String(!!t.on));
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on));
        this.onToggle(t.key, on);
        this.refresh();
      });
      this.buttons.set(t.key, b);
      row.append(b);
    }
    box.append(row);
    this.items = [];
    if (this.legend?.length) {
      const d = document.createElement("details");
      d.className = "map-legend";
      // Open on desktop; closed on phones so it doesn't cover the map.
      d.open = !(typeof matchMedia === "function" && matchMedia("(max-width: 639px)").matches);
      const s = document.createElement("summary");
      s.textContent = t("legend");
      d.append(s);
      const ul = document.createElement("ul");
      for (const item of this.legend) {
        const li = document.createElement("li");
        const sw = document.createElement("span");
        sw.className = `swatch-${item.swatch}`;
        sw.setAttribute("aria-hidden", "true");
        if (item.text) sw.textContent = item.text; // the pills' sample id
        // labelCvd: the words for colour-blind mode; CSS shows one of the two (html[data-cvd]).
        if (item.labelCvd) {
          const off = Object.assign(document.createElement("span"), { className: "cvd-off", textContent: item.label });
          const on = Object.assign(document.createElement("span"), { className: "cvd-on", textContent: item.labelCvd });
          li.append(sw, " ", off, on);
        } else li.append(sw, " ", item.label);
        ul.append(li);
        this.items.push([li, item.when || []]);
      }
      d.append(ul);
      box.append(d);
      this.details = d;
    }
    this.el = box;
    this.refresh();
    return box;
  }

  isOn(key) { return this.buttons.get(key)?.getAttribute("aria-pressed") === "true"; }

  refresh() {
    for (const t of this.toggles) if (t.showWhen) this.buttons.get(t.key).hidden = !this.isOn(t.showWhen);
    for (const [li, when] of this.items) li.hidden = !when.every((k) => this.isOn(k));
    if (this.details) this.details.hidden = this.items.every(([li]) => li.hidden);
  }

  onRemove() { this.el.remove(); }
}
