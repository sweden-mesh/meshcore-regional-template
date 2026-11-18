// "På sidan" (UX-SV-4): open beside the text from 80em, closed under the lead below it; the link to
// the section in view is marked with aria-current (scroll-target-group where the browser has it,
// IntersectionObserver otherwise).
const nav = document.querySelector(".toc");
if (nav) {
  const details = nav.querySelector("details");
  const wide = matchMedia("(min-width: 80em)");
  const summary = details.querySelector("summary");
  // Beside the text it is a heading, not a control: always open and out of the tab order.
  const fit = () => { details.open = wide.matches; summary.tabIndex = wide.matches ? -1 : 0; };
  fit(); wide.addEventListener("change", fit);
  details.addEventListener("toggle", () => { if (wide.matches && !details.open) details.open = true; });
  const links = [...nav.querySelectorAll("a")];
  // aria-current tells screen readers; the look comes from :target-current, or the class below.
  const mark = (a, cls) => links.forEach((l) => {
    if (l === a) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
    if (cls) l.classList.toggle("target-current", l === a);
  });
  if (CSS.supports("scroll-target-group: auto")) {
    const sync = () => mark(nav.querySelector("a:target-current"));
    sync(); addEventListener("scrollend", sync);
  } else {
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) mark(links[heads.indexOf(e.target)], true);
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach((h) => io.observe(h));
  }
}
