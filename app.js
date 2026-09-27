const places=[
{name:"Burj Khalifa",city:"Dubai",area:"Downtown Dubai",time:"1.5–3h",img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80"},
{name:"Al Fahidi Historical Neighbourhood",city:"Dubai",area:"Bur Dubai · Dubai Creek",time:"2–4h",img:"https://images.unsplash.com/photo-1518684079-3c830dcef6f2?auto=format&fit=crop&w=900&q=80"},
{name:"Palm Jumeirah",city:"Dubai",area:"Palm Jumeirah",time:"Half day",img:"https://assets.msccruises.com/is/image/msccruises/msc24033061%20%281%29?dpr=on%2C2.625&qlt=85&ts=1773331813271"},
{name:"Sheikh Zayed Grand Mosque",city:"Abu Dhabi",area:"Al Rawdah",time:"2–3h",img:"https://szgmc.gov.ae/Files/uploads/images/news/2_20251003081332301.JPG"},
{name:"Qasr Al Watan",city:"Abu Dhabi",area:"Al Ras Al Akhdar",time:"2–3h",img:"https://tripventura.com/cdn/shop/articles/o.eo3TifJA2um.webp?v=1765881803"},
{name:"Yas Island",city:"Abu Dhabi",area:"Yas Island",time:"Half/full day",img:"https://www.deccanchronicle.com/h-upload/2024/10/13/1851670-yasislandcover3.jpg"},
{name:"Dubai Creek",city:"Dubai",area:"Old Dubai",time:"1–2h",img:"https://images.unsplash.com/photo-1518684079-3c830dcef6f2?auto=format&fit=crop&w=900&q=80"},
{name:"Heart of Sharjah",city:"Sharjah",area:"Heritage Area",time:"2–4h",img:"https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80"}];

const foods=[
{name:"Emirati breakfast",type:"Breakfast",city:"Dubai",dish:"Traditional Emirati breakfast",restaurant:"Arabian Tea House · Al Fahidi",img:"https://www.timeoutdubai.com/cloud/timeoutdubai/2022/08/30/Arabian-Tea-House-Cafe.jpg",desc:"A heritage-style breakfast stop in Al Fahidi."},
{name:"Local Emirati meal",type:"Emirati",city:"Dubai",dish:"Chebab · dango · balaleet",restaurant:"Al Khayma Heritage Restaurant · Al Fahidi",img:"https://www.timeoutdubai.com/cloud/timeoutdubai/2022/08/30/Arabian-Tea-House-Cafe.jpg",desc:"Traditional local dishes in the Old Dubai heritage area."},
{name:"Luqaimat",type:"Emirati",city:"Dubai",dish:"Sweet Emirati dumplings",restaurant:"Look for a nearby traditional Emirati café",img:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=80",desc:"A classic sweet, commonly finished with date syrup."},
{name:"Karak chai",type:"Family",city:"UAE",dish:"Spiced milk tea",restaurant:"Cafés throughout Dubai and Abu Dhabi",img:"https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",desc:"An easy drink stop between sightseeing blocks."}];

const days=[
["01","Dubai Downtown","Burj Khalifa · Dubai Mall · Fountain"],
["02","Old Dubai","Al Fahidi · Creek · Abra · Emirati food"],
["03","Palm & Marina","Palm Jumeirah · Marina · Bluewaters"],
["04","Abu Dhabi Culture","Sheikh Zayed Grand Mosque · Qasr Al Watan · Corniche"],
["05","Yas Island","Yas Island · Yas Mall · family attraction"],
["06","Sharjah","Heart of Sharjah · waterfront · food"],
["07","Flexible","Beach · shopping · repeat your favourite place"]];

function placeCard(p){return `<article class="place-card"><div class="place-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"><span class="city">${p.city.toUpperCase()}</span></div><div class="place-body"><h3>${p.name}</h3><p>${p.area}</p><div class="meta"><span>📍 ${p.city}</span><span>⏱ ${p.time}</span></div><a class="map-btn" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city+' UAE')}">Open location in Maps ↗</a></div></article>`}
function foodCard(f){return `<article class="food-card"><img src="${f.img}" alt="${f.dish}" loading="lazy"><div class="food-body"><small>${f.type.toUpperCase()} · ${f.city.toUpperCase()}</small><h3>${f.dish}</h3><p>${f.desc}</p><div class="restaurant"><b>📍 ${f.restaurant}</b><span>${f.city}</span></div></div></article>`}
function renderPlaces(city="all"){document.getElementById("placeGrid").innerHTML=places.filter(p=>city==="all"||p.city===city).map(placeCard).join("")}
function renderFood(type="all"){document.getElementById("foodGrid").innerHTML=foods.filter(f=>type==="all"||f.type===type).map(foodCard).join("")}
function renderDays(){document.getElementById("days").innerHTML=days.map(d=>`<div class="day"><div class="day-num">${d[0]}</div><div class="day-main"><b>${d[1]}</b><small>${d[2]}</small></div><div class="day-arrow">→</div></div>`).join("")}
function setView(id){document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.view===id));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>setView(t.dataset.view));
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderPlaces(b.dataset.city)});
document.querySelectorAll(".food-filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".food-filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderFood(b.dataset.type)});
document.getElementById("theme").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("theme")==="light")document.body.classList.add("light");
renderPlaces();renderFood();renderDays();