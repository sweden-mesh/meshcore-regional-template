// The "remote control" option (wizard-control.html): returns a function that gives the
// command broker and the owner's key when ticked, else undefined.
export function initControl(root, onChange) {
  if (!root) return () => undefined;
  const cfg = JSON.parse(root.dataset.control || "{}");
  const box = root.querySelector("[data-ctl-on]");
  const key = root.querySelector("[data-ctl-key]");
  const fields = root.querySelector("[data-ctl-fields]");
  box.addEventListener("change", () => { fields.hidden = !box.checked; onChange(); });
  key.addEventListener("input", onChange);
  return () => (box.checked ? { ...cfg, key: key.value.trim() } : undefined);
}
