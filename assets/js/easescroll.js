// Eased in-page scroll for links marked data-ease: quick (350 ms) but visible.
// Keeps the #anchor in the URL, moves focus to the target, and jumps
// instantly when the visitor asks for reduced motion.
export const DURATION = 350;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function scrollTo(target) {
  const start = window.scrollY;
  const end = start + target.getBoundingClientRect().top - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
  const t0 = performance.now();
  return new Promise((done) => {
    const step = (now) => {
      const t = Math.min(1, (now - t0) / DURATION);
      window.scrollTo(0, start + (end - start) * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', async (e) => {
    const a = e.target.closest?.('a[data-ease][href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    history.pushState(null, '', a.hash);
    await scrollTo(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
