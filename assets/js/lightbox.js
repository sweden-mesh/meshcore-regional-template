// The hardware tables' pictures (B-333): a click on a thumbnail opens the larger picture in a modal
// <dialog>; Esc, the × button or a click outside close it, and the browser returns focus to the
// thumbnail.
const closeText = document.querySelector("script[data-close]")?.dataset.close || "Stäng";
let dialog, img;
function open(btn) {
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("closedby", "any");
    const close = document.createElement("button");
    close.type = "button"; close.className = "lightbox-close"; close.textContent = "×";
    close.setAttribute("aria-label", closeText);
    close.addEventListener("click", () => dialog.close());
    img = document.createElement("img");
    dialog.append(close, img);
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    document.body.append(dialog);
  }
  const small = btn.querySelector("img");
  img.src = btn.dataset.full; img.width = +btn.dataset.w; img.height = +btn.dataset.h; img.alt = small?.alt || "";
  dialog.setAttribute("aria-label", small?.alt || "");
  dialog.showModal();
}
for (const b of document.querySelectorAll(".hw-thumb")) b.addEventListener("click", () => open(b));
