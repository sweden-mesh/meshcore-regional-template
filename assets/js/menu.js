// The header's menu (loaded once, from header.html).
//
// The narrow menu is a native popover (header.html), which closes on a tap outside it or on Escape
// by itself. A browser without the Popover API (iOS before 17) gets the polyfill, served from
// /lib/ like MapLibre and loaded only there.
const toggle = document.querySelector(".nav-toggle");
if (toggle && !Object.hasOwn(HTMLElement.prototype, "popover")) import(toggle.dataset.polyfill);

// Opened, focus moves to the first link (B-341); Escape closes it and the browser hands focus back to
// ☰. Where CSS anchor positioning is missing (main.css), the menu is placed under ☰ here instead:
// right edges together, or left edges if that would leave the screen. The menu is absolutely
// positioned in the top layer, so its offsets are taken against the document, not the viewport.
const menu = toggle && document.getElementById(toggle.getAttribute("popovertarget"));
if (menu) menu.addEventListener("toggle", (e) => {
  if (e.newState !== "open") return;
  if (!CSS.supports("position-area", "block-end")) {
    const b = toggle.getBoundingClientRect(), w = menu.offsetWidth, vw = document.documentElement.clientWidth;
    const left = b.right - w >= 0 ? b.right - w : Math.min(b.left, vw - w);
    Object.assign(menu.style, { inset: "auto", top: `${b.bottom + scrollY + 4}px`, left: `${Math.max(0, left) + scrollX}px` });
  }
  menu.querySelector("a")?.focus();
});

// The wide menu folds into ☰ when the logo, the links and the theme button do not fit on one row,
// measured rather than at a fixed width, so a region with more or longer menu items never wraps.
// Without script the CSS media query does the same at a fixed width.
const header = document.querySelector(".site-header");
const wide = header?.querySelector(".nav-wide");
if (header && wide && "ResizeObserver" in window) {
  header.classList.add("js-nav");
  let last = 0;
  const fit = () => {
    const w = header.clientWidth;
    // Folded: unfold to measure only when the header got wider, so shrinking never flickers.
    if (header.classList.contains("nav-collapsed") && w <= last) { last = w; return; }
    last = w;
    header.classList.remove("nav-collapsed");
    header.classList.toggle("nav-collapsed", overflows());
  };
  // Something in the row reaches past the header's content edge (into its padding or beyond).
  const overflows = () => {
    const cs = getComputedStyle(header);
    const edge = header.getBoundingClientRect().right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth) + 0.5;
    return [...header.children].some((c) => c.getClientRects().length && !c.matches(".lan-tip") && c.getBoundingClientRect().right > edge); // not the region pointer (lan/modal.js)
  };
  const ro = new ResizeObserver(fit);
  ro.observe(header);
  ro.observe(wide);
}
