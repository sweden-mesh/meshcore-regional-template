import { createClient } from "../beacon/rest.js";
import { fillStats } from "./stats.js";

const el = document.getElementById("stats");
if (el && el.dataset.beacon) {
  const iatas = JSON.parse(el.dataset.iatas || "[]");
  if (iatas.length) fillStats(el, createClient(el.dataset.beacon), iatas).catch((err) => console.warn("stats unavailable", err));
}
