import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { boards, variants, pick, imageUrl, familyOf, meshOnly } from "../assets/js/flasher/main.js";

// A slice of the hosted index (fw/hosted.json, lou-18).
const index = {
  tag: "v1.18.0-lou-18", base: "fw/v1.18.0-lou-18/",
  images: [
    ...["bin", "merged"].flatMap((form) => ["ar", "rc", "arrc"].map((f) => ({ hw: "heltec_v4", base: "observer", features: f, mcu: "esp32s3", form, file: `heltec_v4_repeater_observer_mqtt-${f}${form === "merged" ? "-merged" : ""}.bin`, sha256: "x" }))),
    ...["bin", "merged"].map((form) => ({ hw: "heltec_v4", base: "core", features: "ar", mcu: "esp32s3", form, file: `heltec_v4_repeater-ar-${form}.bin`, sha256: "y" })),
    { hw: "RAK_4631", base: "core", features: "ar", mcu: "nrf52840", form: "zip", file: "RAK_4631_repeater-ar.zip", sha256: "z" },
    { hw: "Xiao_C3", base: "core", features: "ar", mcu: "esp32c3", form: "bin", file: "xiao.bin", sha256: "w" },
  ],
};

test("boards: ESP32 first, then nRF52, each once", () => {
  assert.deepEqual(boards(index).map((b) => [b.hw, b.family]), [["heltec_v4", "esp32"], ["Xiao_C3", "esp32"], ["RAK_4631", "nrf52"]]);
  assert.equal(boards(index)[0].label, "heltec v4");
  assert.equal(familyOf("rp2040"), null);
});

test("variants: auto-reply alone first, then the Observer builds", () => {
  assert.deepEqual(variants(index, "heltec_v4").map((v) => v.key), ["core-ar", "observer-ar", "observer-arrc", "observer-rc"]);
  assert.deepEqual(variants(index, "RAK_4631").map((v) => v.key), ["core-ar"]);
});

test("variants: remote control on stock MeshCore (lou-20) sits between auto-reply and the Observer builds", () => {
  const more = { ...index, images: [...index.images,
    ...["rc", "arrc"].map((f) => ({ hw: "RAK_4631", base: "core", features: f, mcu: "nrf52840", form: "zip", file: `RAK_4631_repeater-${f}.zip`, sha256: "z" })),
    ...["rc", "arrc"].map((f) => ({ hw: "heltec_v4", base: "core", features: f, mcu: "esp32s3", form: "bin", file: `heltec_v4_repeater-${f}.bin`, sha256: "y" }))] };
  assert.deepEqual(variants(more, "RAK_4631").map((v) => v.key), ["core-ar", "core-arrc", "core-rc"]);
  assert.deepEqual(variants(more, "heltec_v4").map((v) => v.key), ["core-ar", "core-arrc", "core-rc", "observer-ar", "observer-arrc", "observer-rc"]);
  assert.equal(pick(more, "RAK_4631", "core-arrc", false).file, "RAK_4631_repeater-arrc.zip");
  assert.deepEqual(["core-ar", "core-arrc", "core-rc", "observer-ar", "observer-arrc", "observer-rc"].filter(meshOnly), ["core-arrc", "core-rc"]);
});

test("every variant the page can offer has its label and description, in both languages", () => {
  const partial = readFileSync(new URL("../layouts/_partials/flasher.html", import.meta.url), "utf8");
  for (const lang of ["sv", "en"]) {
    const toml = readFileSync(new URL(`../i18n/${lang}.toml`, import.meta.url), "utf8");
    for (const k of ["core-arrc", "core-rc"]) for (const key of [`fl_v_${k}`, `fl_v_${k}_d`]) {
      assert.ok(toml.includes(`[${key}]\n`), `${lang}: ${key}`);
      assert.ok(partial.includes(`"${key}"`), `flasher.html passes ${key}`);
    }
  }
});

test("pick: update writes the app image, a new install the merged one, nRF52 the DFU package", () => {
  assert.equal(pick(index, "heltec_v4", "observer-rc", false).file, "heltec_v4_repeater_observer_mqtt-rc.bin");
  assert.equal(pick(index, "heltec_v4", "observer-rc", true).form, "merged");
  assert.equal(pick(index, "RAK_4631", "core-ar", false).form, "zip");
  assert.equal(pick(index, "RAK_4631", "core-ar", true).form, "zip");
  assert.equal(pick(index, "RAK_4631", "observer-ar", false), null);
  assert.equal(imageUrl("https://fw.example/", index, pick(index, "RAK_4631", "core-ar", false)), "https://fw.example/fw/v1.18.0-lou-18/RAK_4631_repeater-ar.zip");
});

// The ESP32 flasher is a copy of the firmware page's flasher.js (sweden-mesh/firmware 7e8ae7b),
// changed in one place: the esptool-js URL comes from the page. Pinned so the two cannot drift.
test("esp32.js is the firmware page's flasher.js but for the esptool URL", () => {
  const src = readFileSync(new URL("../assets/js/flasher/esp32.js", import.meta.url), "utf8");
  const back = src.replace(/\/\/ The vendored esptool-js bundle; the template passes its fingerprinted URL \(setEsptool\)\.\nlet ESPTOOL = "";\nexport function setEsptool\(url\)\{ ESPTOOL = url; \}/, "const ESPTOOL = './vendor/esptool-js-0.7.0/bundle.js';");
  assert.equal(createHash("sha256").update(back).digest("hex"), "85598e31151c7c57ca9cd3d39f683a9fc66e9712b796339ac632d95ecfe28ecd");
  const bundle = readFileSync(new URL("../assets/lib/esptool-js-0.7.0/bundle.js", import.meta.url));
  assert.equal(bundle.length, 313171);
});
