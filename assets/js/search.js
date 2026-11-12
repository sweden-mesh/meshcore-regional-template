// Loads Pagefind's UI from the index the build wrote to /pagefind/.
const box = document.getElementById("search");
if (box) {
  const s = document.createElement("script");
  s.src = box.dataset.bundle + "pagefind-ui.js";
  s.onload = () => {
    // eslint-disable-next-line no-undef
    new PagefindUI({ element: "#search", showSubResults: true, showImages: false, bundlePath: box.dataset.bundle, autofocus: true });
  };
  s.onerror = () => { box.textContent = box.dataset.missing || "Sökindex saknas."; };
  document.head.append(s);
}
