// The filter box over a troubleshooting or FAQ list: hides entries whose text does not contain
// every typed word, then groups left empty. Without JavaScript the whole list shows.
import { matches } from "./entries-match.js";

for (const root of document.querySelectorAll("[data-entries]")) {
  const input = root.querySelector("[data-entries-filter]");
  const none = root.querySelector("[data-entries-none]");
  const items = [...root.querySelectorAll("[data-entries-item]")];
  input?.addEventListener("input", () => {
    let shown = 0;
    for (const li of items) { li.hidden = !matches(li.textContent, input.value); if (!li.hidden) shown++; }
    for (const g of root.querySelectorAll("[data-entries-group]")) {
      g.hidden = ![...g.querySelectorAll("[data-entries-item]")].some((li) => !li.hidden);
    }
    if (none) none.hidden = shown > 0;
  });
}
