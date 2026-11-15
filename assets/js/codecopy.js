// A copy button on every code box (operator 2026-11-14, backlog B-267). Added by script, so a
// browser without JavaScript or the clipboard API simply has no button. The button copies the
// code only (not the title bar) and says so for a moment; it is reachable by keyboard, and what
// it says is announced by a status element beside it (a live region inside a button is not
// reliably read).
const boxes = document.querySelectorAll(".codeblock");
const t = document.documentElement.dataset;
const label = t.copyLabel || "Kopiera";
let lastMessage = "";
if (boxes.length && navigator.clipboard?.writeText) {
  for (const box of boxes) {
    const pre = box.querySelector("pre");
    if (!pre) continue;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "code-copy";
    b.textContent = label;
    const status = document.createElement("span");
    status.className = "code-copy-status";
    status.setAttribute("role", "status");
    let timer = 0;
    b.addEventListener("click", async () => {
      let message;
      try {
        await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
        message = t.copiedLabel || "Kopierat";
      } catch {
        message = t.copyFailed || "Gick inte att kopiera";
      }
      b.textContent = message;
      // VoiceOver skips a message identical to the last one; a no-break space makes it differ.
      status.textContent = message === lastMessage ? message + " " : message;
      lastMessage = status.textContent;
      clearTimeout(timer);
      timer = setTimeout(() => { b.textContent = label; status.textContent = ""; }, 1800);
    });
    box.append(b, status);
  }
}
