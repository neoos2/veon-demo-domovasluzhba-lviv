// Small progressive enhancements. Without script: details open natively, every service panel shows in order.

// 1. Popovers on <details data-pop>: one open at a time, Esc and a click outside close them.
const pops = Array.from(document.querySelectorAll<HTMLDetailsElement>("details[data-pop]"));
const closeAll = (except?: HTMLDetailsElement) => pops.forEach((p) => { if (p !== except) p.open = false; });
pops.forEach((p) => {
  p.addEventListener("toggle", () => { if (p.open) closeAll(p); });
  p.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((a) => a.addEventListener("click", () => { p.open = false; }));
});
document.addEventListener("click", (e) => {
  const t = e.target as Node;
  pops.forEach((p) => { if (p.open && !p.contains(t)) p.open = false; });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = pops.find((p) => p.open);
  if (open) { open.open = false; open.querySelector<HTMLElement>("summary")?.focus(); }
});

// 2. Today's hours from the header schedule (C-006, decisions.md). 0 = Sunday.
const hours = ["08:00–18:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "08:00–20:00"];
const today = new Date().getDay();
document.querySelectorAll<HTMLElement>("[data-today-label]").forEach((el) => { el.textContent = "Сьогодні"; });
document.querySelectorAll<HTMLElement>("[data-today-hours]").forEach((el) => { el.textContent = hours[today] ?? ""; });
document.querySelectorAll<HTMLElement>(`[data-day~="${today}"]`).forEach((el) => el.classList.add("is-today"));

// 3. Service tabs (#posluhy): rooms of the house; hash #posluhy-<room> opens the room.
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[role='tab'][data-room]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[role='tabpanel'][data-room]"));
const tablist = document.querySelector<HTMLElement>("[role='tablist']");
const marker = document.querySelector<HTMLElement>(".plan__marker");

function moveMarker(tab: HTMLElement) {
  if (!marker || !tablist) return;
  const vertical = getComputedStyle(tablist).flexDirection === "column";
  marker.style.transform = vertical ? `translateY(${tab.offsetTop}px)` : `translateX(${tab.offsetLeft}px)`;
  marker.style.setProperty("--w", `${tab.offsetWidth}px`);
  marker.style.setProperty("--h", `${tab.offsetHeight}px`);
}

function select(id: string, focus = false) {
  const tab = tabs.find((t) => t.dataset.room === id);
  if (!tab) return false;
  tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
  panels.forEach((p) => {
    const on = p.dataset.room === id;
    if (on && p.hidden) { p.classList.remove("is-entering"); void p.offsetWidth; p.classList.add("is-entering"); }
    p.hidden = !on;
  });
  moveMarker(tab);
  if (focus) tab.focus();
  if (!tablist) return true;
  if (getComputedStyle(tablist).flexDirection !== "column") tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  return true;
}

if (tabs.length && panels.length) {
  document.documentElement.classList.add("tabs-ready");
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.room ?? ""));
    t.addEventListener("keydown", (e) => {
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); const n = tabs[(i + keys[e.key] + tabs.length) % tabs.length]; select(n.dataset.room ?? "", true); }
      if (e.key === "Home") { e.preventDefault(); select(tabs[0].dataset.room ?? "", true); }
      if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1].dataset.room ?? "", true); }
    });
  });
  const fromHash = () => {
    const m = location.hash.match(/^#posluhy-([\w-]+)$/);
    if (m && select(m[1])) document.getElementById("posluhy")?.scrollIntoView({ block: "start" });
  };
  document.querySelectorAll<HTMLAnchorElement>("a[data-tab-link]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    select(a.dataset.tabLink ?? "");
    history.replaceState(null, "", `#posluhy-${a.dataset.tabLink}`);
    document.getElementById("posluhy")?.scrollIntoView({ block: "start" });
  }));
  if (!/^#posluhy-/.test(location.hash) || !select(location.hash.slice(9))) select(tabs[0].dataset.room ?? "");
  else fromHash();
  window.addEventListener("hashchange", fromHash);
  window.addEventListener("resize", () => { const t = tabs.find((x) => x.getAttribute("aria-selected") === "true"); if (t) moveMarker(t); });
}

// 4. Hero entrance runs once after first paint (CSS decides what moves; reduced motion: nothing).
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("hero-in")));

// 5. Long reviews: «Читати повністю» (the text is always complete in the DOM, only clamped).
document.querySelectorAll<HTMLButtonElement>("button[data-more]").forEach((btn) => {
  const text = document.getElementById(btn.getAttribute("aria-controls") ?? "");
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    text?.classList.toggle("is-open", open);
    btn.textContent = open ? "Згорнути" : "Читати повністю";
  });
});

// 6. Scrollspy: the nav link of the section under the reading line gets aria-current; sections without a link clear it.
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-nav a[href^='#']"));
const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
let spyQueued = false;
function spy() {
  spyQueued = false;
  const line = window.innerHeight * 0.35;
  let current: HTMLElement | undefined;
  for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
  if (current && current.getBoundingClientRect().bottom < line) current = undefined;
  const id = current?.id ?? "";
  navLinks.forEach((a) => {
    if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}
if (navLinks.length) {
  window.addEventListener("scroll", () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener("resize", spy);
  spy();
}
