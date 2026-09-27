/* =========================================================
   UAE Trip Journal — app.js
   Book-style 3D page flip (click / keys / drag-to-scrub),
   desk-calendar flip, flip cards, View Transitions.
   ========================================================= */

/* ---------- DATA ---------- */
const places = [
  {name:"Burj Khalifa",city:"Dubai",area:"Downtown Dubai",time:"1.5–3h",best:"Morning or sunset slot",tip:"Book observation-deck tickets ahead; pair with Dubai Mall and the Fountain.",img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80"},
  {name:"Al Fahidi Historical Neighbourhood",city:"Dubai",area:"Bur Dubai · Dubai Creek",time:"2–4h",best:"Early morning / late afternoon",tip:"Walk the lanes, then take an abra across the Creek to the souks.",img:"https://images.unsplash.com/photo-1518684079-3c830dcef6f2?auto=format&fit=crop&w=900&q=80"},
  {name:"Palm Jumeirah",city:"Dubai",area:"Palm Jumeirah",time:"Half day",best:"Late afternoon into evening",tip:"The Palm Monorail is a fun, low-effort way for kids to see the island.",img:"https://assets.msccruises.com/is/image/msccruises/msc24033061%20%281%29?dpr=on%2C2.625&qlt=85&ts=1773331813271"},
  {name:"Sheikh Zayed Grand Mosque",city:"Abu Dhabi",area:"Al Rawdah",time:"2–3h",best:"Late afternoon to sunset",tip:"Modest dress required (women: headscarf). Check prayer-time visiting hours.",img:"https://szgmc.gov.ae/Files/uploads/images/news/2_20251003081332301.JPG"},
  {name:"Qasr Al Watan",city:"Abu Dhabi",area:"Al Ras Al Akhdar",time:"2–3h",best:"Afternoon, stay for the evening show",tip:"Combine with the Grand Mosque the same day — they're on the same side of the city.",img:"https://tripventura.com/cdn/shop/articles/o.eo3TifJA2um.webp?v=1765881803"},
  {name:"Yas Island",city:"Abu Dhabi",area:"Yas Island",time:"Half / full day",best:"Full day, indoor parks at midday",tip:"Pick one theme park per day; Yas Mall is next door for lunch and cool-down.",img:"https://www.deccanchronicle.com/h-upload/2024/10/13/1851670-yasislandcover3.jpg"},
  {name:"Dubai Creek",city:"Dubai",area:"Old Dubai",time:"1–2h",best:"Golden hour",tip:"An abra ride is short and cheap — kids usually love it.",img:"https://images.unsplash.com/photo-1518684079-3c830dcef6f2?auto=format&fit=crop&w=900&q=80"},
  {name:"Heart of Sharjah",city:"Sharjah",area:"Heritage Area",time:"2–4h",best:"Morning or evening",tip:"Heritage houses, museums and souks within walking distance.",img:"https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80"}
];

const foods = [
  {name:"Emirati breakfast",type:"Breakfast",city:"Dubai",dish:"Traditional Emirati breakfast",restaurant:"Arabian Tea House · Al Fahidi",img:"https://www.timeoutdubai.com/cloud/timeoutdubai/2022/08/30/Arabian-Tea-House-Cafe.jpg",desc:"A heritage-style breakfast stop in Al Fahidi."},
  {name:"Local Emirati meal",type:"Emirati",city:"Dubai",dish:"Chebab · dango · balaleet",restaurant:"Al Khayma Heritage Restaurant · Al Fahidi",img:"https://www.timeoutdubai.com/cloud/timeoutdubai/2022/08/30/Arabian-Tea-House-Cafe.jpg",desc:"Traditional local dishes in the Old Dubai heritage area."},
  {name:"Luqaimat",type:"Emirati",city:"Dubai",dish:"Sweet Emirati dumplings",restaurant:"Look for a nearby traditional Emirati café",img:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=80",desc:"A classic sweet, commonly finished with date syrup."},
  {name:"Karak chai",type:"Family",city:"UAE",dish:"Spiced milk tea",restaurant:"Cafés throughout Dubai and Abu Dhabi",img:"https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",desc:"An easy drink stop between sightseeing blocks."}
];

const days = [
  {n:"01",title:"Dubai Downtown",emirate:"Dubai",stops:["Burj Khalifa","Dubai Mall","Dubai Fountain"],pace:"Easy",emoji:"🏙️"},
  {n:"02",title:"Old Dubai",emirate:"Dubai",stops:["Al Fahidi","Dubai Creek","Abra ride","Emirati food"],pace:"Walking",emoji:"⛵"},
  {n:"03",title:"Palm & Marina",emirate:"Dubai",stops:["Palm Jumeirah","Dubai Marina","Bluewaters"],pace:"Relaxed",emoji:"🌴"},
  {n:"04",title:"Abu Dhabi Culture",emirate:"Abu Dhabi",stops:["Sheikh Zayed Grand Mosque","Qasr Al Watan","Corniche"],pace:"Long drive",emoji:"🕌"},
  {n:"05",title:"Yas Island",emirate:"Abu Dhabi",stops:["Yas Island","Yas Mall","Family attraction"],pace:"Full day",emoji:"🎢"},
  {n:"06",title:"Sharjah",emirate:"Sharjah",stops:["Heart of Sharjah","Waterfront","Food"],pace:"Easy",emoji:"🏛️"},
  {n:"07",title:"Flexible",emirate:"Your pick",stops:["Beach","Shopping","Repeat a favourite"],pace:"Free",emoji:"🏖️"}
];

/* ---------- HELPERS ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const mapUrl = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
};
const withVT = fn => (document.startViewTransition && !reduced) ? document.startViewTransition(fn) : fn();
const imgFallback = `onerror="this.closest('[data-img]').classList.add('img-fail');this.remove()"`;

/* ---------- RENDER ---------- */
function placeCard(p, i){
  return `<article class="pcard" style="view-transition-name:p-${slug(p.name)};--i:${i}">
    <div class="pcard-inner">
      <div class="pcard-face pcard-front" data-img>
        <img src="${p.img}" alt="${p.name}" loading="lazy" ${imgFallback}>
        <span class="city-chip">${p.city}</span>
        <span class="flip-hint" aria-hidden="true">↻</span>
        <div class="pcard-cap"><h3>${p.name}</h3><p>${p.area}</p>
          <div class="meta"><span>📍 ${p.city}</span><span>⏱ ${p.time}</span></div></div>
      </div>
      <div class="pcard-face pcard-back">
        <span class="eyebrow eyebrow-accent">${p.city} · ${p.area}</span>
        <h3>${p.name}</h3>
        <dl class="kv"><div><dt>Time needed</dt><dd>${p.time}</dd></div><div><dt>Best time</dt><dd>${p.best}</dd></div></dl>
        <p class="tip">💡 ${p.tip}</p>
        <a class="btn btn-primary btn-block" target="_blank" rel="noopener" href="${mapUrl(p.name + " " + p.city + " UAE")}">Open in Maps <span>↗</span></a>
      </div>
    </div>
  </article>`;
}

function foodCard(f, i){
  return `<article class="fcard" style="view-transition-name:f-${slug(f.name)};--i:${i}">
    <div class="fcard-img" data-img><img src="${f.img}" alt="${f.dish}" loading="lazy" ${imgFallback}><span class="type-chip">${f.type}</span></div>
    <div class="fcard-body">
      <small class="eyebrow">${f.name} · ${f.city}</small>
      <h3>${f.dish}</h3>
      <p class="muted">${f.desc}</p>
      <div class="restaurant"><span>📍</span><div><b>${f.restaurant}</b><small>${f.city}</small></div>
        <a class="mini-link" target="_blank" rel="noopener" href="${mapUrl(f.restaurant.split("·")[0] + " " + f.city)}" aria-label="Find on maps">↗</a></div>
    </div>
  </article>`;
}

function renderPlaces(city = "all"){
  $("#placeGrid").innerHTML = places.filter(p => city === "all" || p.city === city).map(placeCard).join("");
}
function renderFood(type = "all"){
  $("#foodGrid").innerHTML = foods.filter(f => type === "all" || f.type === type).map(foodCard).join("");
}
function renderDayList(){
  $("#days").innerHTML = days.map((d, i) => `<li><button class="day" data-day="${i}">
      <span class="day-num">${d.n}</span>
      <span class="day-main"><b>${d.title}</b><small>${d.stops.join(" · ")}</small></span>
      <span class="day-emirate">${d.emirate}</span></button></li>`).join("");
}

/* ---------- SEGMENTED FILTERS (sliding pill + view transition) ---------- */
function moveGlider(container, btn, gliderSel){
  const g = $(gliderSel, container); if (!g || !btn) return;
  g.style.width = btn.offsetWidth + "px";
  g.style.transform = `translateX(${btn.offsetLeft}px)`;
}
function setupSegmented(id, key, render){
  const box = $("#" + id);
  box.addEventListener("click", e => {
    const b = e.target.closest(".seg"); if (!b || b.classList.contains("active")) return;
    $$(".seg", box).forEach(x => x.classList.toggle("active", x === b));
    moveGlider(box, b, ".seg-glider");
    withVT(() => render(b.dataset[key]));
  });
}

/* =========================================================
   BOOK PAGE-FLIP ENGINE
   A "leaf" (clone of a page) rotates around the spine (left edge).
   Progress t: 0 = lying flat on the right, 1 = turned over to the left.
   ========================================================= */
const book = $("#book");
const order = ["today", "places", "food", "plan", "routes"];
let current = "today";
let flip = null;          // active flip state
let raf = 0;
let booted = false;

const ease = k => k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
const easeOut = k => 1 - Math.pow(1 - k, 3);

function activate(id){
  $$(".view", book).forEach(v => v.classList.toggle("active", v.id === id));
}

function makeLeaf(src, height){
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.setAttribute("aria-hidden", "true");
  leaf.inert = true;
  leaf.style.height = height + "px";

  const front = document.createElement("div");
  front.className = "leaf-face leaf-front";
  const clone = src.cloneNode(true);
  clone.removeAttribute("id");
  clone.classList.add("active");
  $$("[id]", clone).forEach(e => e.removeAttribute("id"));
  $$("[style*='view-transition-name']", clone).forEach(e => e.style.viewTransitionName = "none");
  front.append(clone);
  front.insertAdjacentHTML("beforeend", `<div class="leaf-shade"></div><div class="leaf-gloss"></div>`);

  const back = document.createElement("div");
  back.className = "leaf-face leaf-back";
  back.innerHTML = `<div class="leaf-back-art"><span>✦</span><b>UAE Trip</b><small>travel journal</small></div><div class="leaf-shade"></div>`;

  leaf.append(front, back);
  return leaf;
}

function renderLeaf(t){
  if (!flip) return;
  const bend = Math.sin(t * Math.PI);               // 0 → 1 → 0
  const ang = -180 * t;
  const L = flip.leaf;
  L.style.transform =
    `rotateY(${ang}deg) skewY(${-bend * 2.2}deg) scale(${1 - bend * .015})`;
  L.style.opacity = t > .88 ? String(Math.max(0, (1 - t) / .12)) : "1";
  L.style.setProperty("--t", t.toFixed(3));
  L.style.setProperty("--b", bend.toFixed(3));
  book.style.setProperty("--edge", (t < .5 ? Math.cos(t * Math.PI) * 100 : 0).toFixed(2) + "%");
  book.style.setProperty("--fb", bend.toFixed(3));
}

function startFlip(toId){
  const dir = order.indexOf(toId) > order.indexOf(current) ? 1 : -1;
  const oldV = $("#" + current), newV = $("#" + toId);

  // bring book top into view so the turning page is visible
  const headerH = $(".topbar").offsetHeight + 12;
  const top = book.getBoundingClientRect().top;
  if (top < headerH) window.scrollTo({ top: window.scrollY + top - headerH, behavior: "instant" });

  const bTop = Math.max(book.getBoundingClientRect().top, 0);
  const visible = window.innerHeight - bTop;
  const h = Math.max(360, Math.min(oldV.offsetHeight, visible + 20));

  const leaf = makeLeaf(dir > 0 ? oldV : newV, h);
  book.style.perspective = Math.round(book.offsetWidth * 2.8) + "px";
  book.style.minHeight = h + "px";
  book.classList.add("is-flipping");
  book.append(leaf);

  if (dir > 0) activate(toId);   // new page revealed underneath

  flip = { leaf, dir, toId, fromId: current, t: dir > 0 ? 0 : 1 };
  renderLeaf(flip.t);
  return flip;
}

function animateFlip(target, dur, easing, done){
  cancelAnimationFrame(raf);
  const from = flip.t, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur);
    flip.t = from + (target - from) * easing(k);
    renderLeaf(flip.t);
    if (k < 1) raf = requestAnimationFrame(step); else done();
  };
  raf = requestAnimationFrame(step);
}

function endFlip(committed){
  const { leaf, dir, toId, fromId } = flip;
  if (committed){
    if (dir < 0) activate(toId);
    current = toId;
  } else {
    activate(fromId);
  }
  leaf.remove();
  book.classList.remove("is-flipping");
  book.style.minHeight = "";
  book.style.setProperty("--fb", 0);
  flip = null;
  syncChrome();
}

function goTo(id, opts = {}){
  if (!order.includes(id) || id === current || flip) return;
  if (reduced || opts.instant){
    activate(id); current = id; syncChrome();
    if (!opts.instant){ const v = $("#" + id); v.classList.add("fade-in"); setTimeout(() => v.classList.remove("fade-in"), 400); }
    return;
  }
  startFlip(id);
  animateFlip(flip.dir > 0 ? 1 : 0, 950, ease, () => endFlip(true));
}
const step = d => goTo(order[order.indexOf(current) + d]);

/* ---------- drag / swipe to scrub the page ---------- */
let drag = null;
book.addEventListener("pointerdown", e => {
  if (flip || e.button > 0 || reduced) return;
  if (e.target.closest(".no-flip, a, input, textarea, select")) return;
  drag = { x: e.clientX, y: e.clientY, id: e.pointerId, active: false, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
});
book.addEventListener("pointermove", e => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (!drag.active){
    if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.3) {
      if (Math.abs(dy) > 14) drag = null;   // vertical scroll wins
      return;
    }
    const target = order[order.indexOf(current) + (dx < 0 ? 1 : -1)];
    if (!target){ drag = null; return; }
    drag.active = true; drag.moved = true;
    book.setPointerCapture(e.pointerId);
    startFlip(target);
  }
  const w = book.offsetWidth * .85;
  const now = performance.now();
  drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
  drag.lastX = e.clientX; drag.lastT = now;
  const p = Math.min(1, Math.max(0, Math.abs(dx) / w));
  flip.t = flip.dir > 0 ? (dx < 0 ? p : 0) : (dx > 0 ? 1 - p : 1);
  renderLeaf(flip.t);
});
const release = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const d = drag; drag = null;
  if (!d.active || !flip) return;
  const progress = flip.dir > 0 ? flip.t : 1 - flip.t;
  const fling = flip.dir > 0 ? d.v < -.5 : d.v > .5;
  const commit = progress > .33 || fling;
  const target = commit ? (flip.dir > 0 ? 1 : 0) : (flip.dir > 0 ? 0 : 1);
  const remaining = Math.abs(target - flip.t);
  animateFlip(target, 250 + remaining * 550, easeOut, () => endFlip(commit));
  suppressClick = true; setTimeout(() => suppressClick = false, 50);
};
let suppressClick = false;
book.addEventListener("pointerup", release);
book.addEventListener("pointercancel", release);
book.addEventListener("click", e => { if (suppressClick){ e.stopPropagation(); e.preventDefault(); } }, true);

/* ---------- chrome: tabs, glider, pager ---------- */
function syncChrome(){
  const idx = order.indexOf(current);
  $$(".tab").forEach(t => {
    const on = t.dataset.view === current;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  moveTabGlider();
  $("#pageLabel").textContent = $("#" + current).dataset.label;
  $("#pageNo").textContent = `p. ${String(idx + 1).padStart(2, "0")} / ${String(order.length).padStart(2, "0")}`;
  $("#pagePrev").disabled = idx === 0;
  $("#pageNext").disabled = idx === order.length - 1;
  book.dataset.first = idx === 0; book.dataset.last = idx === order.length - 1;
  if (booted) history.replaceState(null, "", "#" + current);   // (not on load: would trigger scroll-to-fragment)
  requestAnimationFrame(() => $$(".segmented").forEach(s => moveGlider(s, $(".seg.active", s), ".seg-glider")));
}
function moveTabGlider(){
  const nav = $(".tabs"), a = $(".tab.active", nav), g = $(".glider", nav);
  if (!a) return;
  g.style.width = a.offsetWidth + "px";
  g.style.transform = `translateX(${a.offsetLeft}px)`;
}

$$(".tab").forEach(t => t.addEventListener("click", () => goTo(t.dataset.view)));
$$("[data-go]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); goTo(b.dataset.go); }));
$("#pagePrev").onclick = () => step(-1);
$("#pageNext").onclick = () => step(1);
$(".corner-next").onclick = () => step(1);
$(".corner-prev").onclick = () => step(-1);
document.addEventListener("keydown", e => {
  if (e.target.closest("input, textarea, select")) return;
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
addEventListener("resize", () => { moveTabGlider(); $$(".segmented").forEach(s => moveGlider(s, $(".seg.active", s), ".seg-glider")); });

/* ---------- place cards: 3D flip + tilt ---------- */
$("#placeGrid").addEventListener("click", e => {
  if (e.target.closest("a")) return;
  const c = e.target.closest(".pcard"); if (c) c.classList.toggle("flipped");
});
if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduced){
  document.addEventListener("pointermove", e => {
    const el = e.target.closest?.(".pcard, .tilt");
    $$(".is-tilting").forEach(x => { if (x !== el){ x.classList.remove("is-tilting"); x.style.removeProperty("--rx"); x.style.removeProperty("--ry"); } });
    if (!el || flip) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    el.classList.add("is-tilting");
    el.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg");
    el.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
    el.style.setProperty("--mx", ((px + .5) * 100).toFixed(1) + "%");
    el.style.setProperty("--my", ((py + .5) * 100).toFixed(1) + "%");
  });
}

/* =========================================================
   DESK CALENDAR (sheet flips over the top ring)
   ========================================================= */
let calIdx = 0, calBusy = false;
function sheetHTML(d, i){
  return `<div class="sheet-top"><span>Day</span><span>${d.emirate}</span></div>
    <div class="sheet-num">${d.n}</div>
    <div class="sheet-title"><span class="sheet-emoji">${d.emoji}</span>${d.title}</div>
    <ul class="sheet-stops">${d.stops.map(s => `<li>${s}</li>`).join("")}</ul>
    <div class="sheet-foot"><span>Pace · ${d.pace}</span><span>${i + 1} / ${days.length}</span></div>`;
}
function makeSheet(i){
  const s = document.createElement("div");
  s.className = "sheet"; s.innerHTML = sheetHTML(days[i], i);
  return s;
}
function syncCal(){
  $$("#calDots i").forEach((d, i) => d.classList.toggle("on", i === calIdx));
  $$(".day").forEach(b => b.classList.toggle("active", +b.dataset.day === calIdx));
  $("#calPrev").disabled = calIdx === 0;
  $("#calNext").disabled = calIdx === days.length - 1;
}
function calGo(i){
  if (i === calIdx || i < 0 || i >= days.length || calBusy) return;
  const stack = $("#calStack"), old = $(".sheet", stack);
  const fresh = makeSheet(i);
  const forward = i > calIdx;
  calIdx = i; syncCal();
  if (reduced){ old.replaceWith(fresh); return; }
  calBusy = true;
  if (forward){
    stack.prepend(fresh);                  // new sheet waits underneath
    old.classList.add("tear");            // old sheet flips up & over the rings
    old.addEventListener("animationend", () => { old.remove(); calBusy = false; }, { once: true });
  } else {
    fresh.classList.add("drop");          // previous sheet flips back down on top
    stack.append(fresh);
    fresh.addEventListener("animationend", () => { fresh.classList.remove("drop"); old.remove(); calBusy = false; }, { once: true });
  }
}
function initCalendar(){
  $("#calStack").append(makeSheet(0));
  $("#calDots").innerHTML = days.map(() => "<i></i>").join("");
  $("#calPrev").onclick = () => calGo(calIdx - 1);
  $("#calNext").onclick = () => calGo(calIdx + 1);
  $("#days").addEventListener("click", e => { const b = e.target.closest(".day"); if (b) calGo(+b.dataset.day); });
  // swipe on the calendar itself
  let sy = null, sx = null;
  const cal = $(".calendar");
  cal.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
  cal.addEventListener("pointerup", e => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = sy = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    calGo(calIdx + (d < 0 ? 1 : -1));
  });
  syncCal();
}

/* ---------- theme toggle with circular reveal ---------- */
$("#themeBtn").addEventListener("click", e => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  const apply = () => { document.documentElement.dataset.theme = next; store.set("theme", next); };
  if (!document.startViewTransition || reduced) return apply();
  const x = e.clientX || innerWidth - 40, y = e.clientY || 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.documentElement.classList.add("theme-vt");
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
  ));
  vt.finished.finally(() => document.documentElement.classList.remove("theme-vt"));
});

/* ---------- live UAE clock ---------- */
function tick(){
  const t = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }).format(new Date());
  $("#uaeClock").textContent = "UAE " + t;
}

/* ---------- first-visit swipe hint ---------- */
function hint(){
  if (store.get("seenHint")) return;
  const t = $("#toast");
  setTimeout(() => t.classList.add("show"), 1400);
  setTimeout(() => t.classList.remove("show"), 5200);
  store.set("seenHint", "1");
}

/* ---------- INIT ---------- */
renderPlaces(); renderFood(); renderDayList(); initCalendar();
setupSegmented("cityFilter", "city", renderPlaces);
setupSegmented("foodFilter", "type", renderFood);
$("#statPlaces").textContent = places.length;
$("#statFood").textContent = foods.length;
$("#statDays").textContent = days.length;
const start = location.hash.slice(1);
current = order.includes(start) ? start : "today";
activate(current); syncChrome();
tick(); setInterval(tick, 30000);
document.fonts?.ready.then(() => { moveTabGlider(); $$(".segmented").forEach(s => moveGlider(s, $(".seg.active", s), ".seg-glider")); });
hint();
addEventListener("load", () => { booted = true; });
