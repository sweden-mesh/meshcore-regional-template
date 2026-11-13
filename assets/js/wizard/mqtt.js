// The "also report to the region's MQTT broker" option (wizard-mqtt.html). Returns a
// function that gives the broker settings when ticked, else undefined.
export function initMqtt(root, onChange) {
  if (!root) return () => undefined;
  const cfg = JSON.parse(root.dataset.mqtt || "{}");
  const box = root.querySelector("[data-mqtt-on]");
  box.addEventListener("change", onChange);
  return () => (box.checked ? cfg : undefined);
}
