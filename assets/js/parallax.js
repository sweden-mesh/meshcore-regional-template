// The background blobs move with the scroll at 20 % of its speed (operator 2026-11-13).
// The layer is made taller by 20 % of the scroll range so it still covers the bottom.
export const RATE = 0.2;
export const extraHeight = (scrollHeight, viewport) => Math.max(0, scrollHeight - viewport) * RATE;

if (typeof document !== "undefined") {
  const layer = document.querySelector(".bg-blobs");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (layer && !reduce.matches) {
    const root = document.documentElement;
    let queued = false;
    const update = () => {
      queued = false;
      layer.style.setProperty("--sy", String(window.scrollY));
      layer.style.setProperty("--extra", `${extraHeight(root.scrollHeight, innerHeight)}px`);
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    new ResizeObserver(queue).observe(document.body);
    update();
  }
}
