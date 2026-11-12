// Name-length checker: counts UTF-8 bytes the way the firmware stores the
// name. 22 bytes leaves room for a position in the same advert; 31 is the max.
export function utf8Bytes(s) {
  return new TextEncoder().encode(s).length;
}

export function verdict(bytes) {
  if (bytes === 0) return "empty";
  if (bytes <= 22) return "ok";
  if (bytes <= 31) return "no-position";
  return "too-long";
}

for (const box of (typeof document === "undefined" ? [] : document.querySelectorAll("[data-namecheck]"))) {
  const input = box.querySelector("input");
  const out = box.querySelector("output");
  const texts = JSON.parse(box.dataset.namecheck);
  const update = () => {
    const b = utf8Bytes(input.value);
    const v = verdict(b);
    out.textContent = v === "empty" ? "" : `${b} byte: ${texts[v]}`;
    out.dataset.verdict = v;
  };
  input.addEventListener("input", update);
  update();
}
