// A copy button on every code box (operator 2026-11-14, backlog B-267). Added by script, so a
// browser without JavaScript or the clipboard API simply has no button. The button copies the
// code only (not the title bar) and says so for a moment; it is reachable by keyboard and its
// state is announced to screen readers.
const boxes = document.querySelectorAll(".codeblock");
const t = document.documentElement.dataset;
if (boxes.length && navigator.clipboard?.writeText) {
  for (const box of boxes) {
    const pre = box.querySelector("pre");
    if (!pre) continue;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "code-copy";
    b.textContent = t.copyLabel || "Kopiera";
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
        b.textContent = t.copiedLabel || "Kopierat";
      } catch {
        b.textContent = t.copyFailed || "Gick inte att kopiera";
      }
      setTimeout(() => { b.textContent = t.copyLabel || "Kopiera"; }, 1800);
    });
    b.setAttribute("aria-live", "polite");
    box.append(b);
  }
}
