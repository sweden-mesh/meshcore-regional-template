// The "remote control" option (wizard-control.html): returns a function that gives the
// command broker and the owner's key when ticked, else undefined. Without the Observer box
// ticked (wizard-observer.html, same form) the node is mesh only: no broker, no slot.
export function initControl(root, onChange) {
  if (!root) return () => undefined;
  const cfg = JSON.parse(root.dataset.control || "{}");
  const box = root.querySelector("[data-ctl-on]");
  const key = root.querySelector("[data-ctl-key]");
  const fields = root.querySelector("[data-ctl-fields]");
  const obs = root.closest("form")?.querySelector("[data-obs-on]");
  const help = () => {
    root.querySelector("[data-ctl-help]").hidden = !obs?.checked;
    root.querySelector("[data-ctl-help-mesh]").hidden = !!obs?.checked;
  };
  obs?.addEventListener("change", help);
  help();
  box.addEventListener("change", () => { fields.hidden = !box.checked; onChange(); });
  key.addEventListener("input", onChange);
  return () => (box.checked ? { ...cfg, key: key.value.trim(), meshOnly: !obs?.checked } : undefined);
}
