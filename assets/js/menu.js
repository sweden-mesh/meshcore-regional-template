// The narrow menu (<details class="nav-narrow">) closes on a tap outside it or on Escape,
// so a visitor does not have to reach back up to the ☰ button (visitor feedback 2026-11-14).
const menu = document.querySelector("details.nav-narrow");
if (menu) {
  document.addEventListener("click", (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary")?.focus(); }
  });
}
