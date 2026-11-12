// One floating panel for the map: pill toggles (aria-pressed buttons) and a
// small legend, styled after the design direction (swe.meshmapper.net-like
// pills). Replaces MapLibre's stock checkbox boxes.

export class MapPanel {
  constructor({ toggles, legend, onToggle }) {
    this.toggles = toggles; // [{ key, label, on }]
    this.legend = legend;   // [{ swatch: "pill-active"|"pill-stale"|"pill-observer"|"link"|"link-strong"|"flow", label }]
    this.onToggle = onToggle;
  }

  onAdd() {
    const box = document.createElement("div");
    box.className = "maplibregl-ctrl map-panel";
    const row = document.createElement("div");
    row.className = "map-pills";
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
      });
      row.append(b);
    }
    box.append(row);
    if (this.legend?.length) {
      const d = document.createElement("details");
      d.className = "map-legend";
      const s = document.createElement("summary");
      s.textContent = "Teckenförklaring";
      d.append(s);
      const ul = document.createElement("ul");
      for (const item of this.legend) {
        const li = document.createElement("li");
        const sw = document.createElement("span");
        sw.className = `swatch-${item.swatch}`;
        sw.setAttribute("aria-hidden", "true");
        li.append(sw, " ", item.label);
        ul.append(li);
      }
      d.append(ul);
      box.append(d);
    }
    this.el = box;
    return box;
  }

  onRemove() { this.el.remove(); }
}
