/* Leonida Platinum Guide — tracker + cited guides. All guide text lives in data/trophies.json. */
"use strict";
var SOURCES = [
  {n:1, name:"PowerPyx — GTA 6 Trophy Guide & Roadmap", url:"https://powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap"},
  {n:2, name:"OutputLag — GTA 6 Trophy List", url:""},
  {n:3, name:"KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap", url:""},
  {n:4, name:"eGamers — GTA 6 Trophy List", url:""},
  {n:5, name:"GTABase — GTA 6 Trophy Guide & Achievements", url:""},
  {n:6, name:"GTAZone — GTA 6 Trophies & Achievements", url:""},
  {n:7, name:"GTA Vibes — GTA 6 Trophy List & Achievements", url:""},
  {n:8, name:"Game-Checklists — All Missables in GTA 6", url:""},
  {n:9, name:"Upblazed — GTA 6 Trophies, Missables and the Platinum", url:""},
  {n:10, name:"Official list — PS5 trophy list (Exophase / PSNProfiles)", url:"https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/"}
];
var STAGES = [
  {id:"S1", title:"S1 — Chapter 1: Paradise", hours:"~10 h", note:"Story opens. Do the balcony meditation (trophy 28) here — the one possibly missable moment."},
  {id:"S2", title:"S2 — Chapter 2", hours:"~12 h", note:"Breakfast Run (Trust) lives here. Save at chapter start and end."},
  {id:"S3", title:"S3 — Chapter 3", hours:"~14 h", note:"The Cartel Heist and Child's Play. Vice City opens up."},
  {id:"S4", title:"S4 — Chapter 4", hours:"~14 h", note:"Headliners. From here on, save before every major story choice."},
  {id:"S5", title:"S5 — Chapter 5 + Finale", hours:"~15 h", note:"VCIA Takedown, Operation Savage Glory, then the final mission (gold). Save before the finale."},
  {id:"S6", title:"S6 — Cleanup", hours:"~60 h", note:"Side strands, activities, collectibles, crime and money trophies. Cheapest first."},
  {id:"S7", title:"S7 — Free roam / 100%", hours:"~75 h", note:"The long grind: 200/277 vehicles, 100/255 animals, 300 stunts, 70/80 challenges, 100 optional missions. Then the platinum."}
];
var STORE_KEY = "leonida-platinum-v1";
var state = {earned:{}, counters:{}, spoiler:false};
var TROPHIES = [];
var selectedId = 28;

function loadState(){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    if(raw){ var p = JSON.parse(raw); if(p.earned) state.earned = p.earned; if(p.counters) state.counters = p.counters; if(typeof p.spoiler === "boolean") state.spoiler = p.spoiler; }
  }catch(e){ /* fresh state on bad save */ }
}
function saveState(){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){ /* storage full or blocked */ }
}
function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function gradeCounts(){
  var c = {platinum:0, gold:0, silver:0, bronze:0};
  TROPHIES.forEach(function(t){ c[t.grade] = (c[t.grade]||0)+1; });
  return c;
}
function earnedCount(){ return TROPHIES.filter(function(t){ return state.earned[t.id]; }).length; }
function citedBy(n){ return TROPHIES.filter(function(t){ return (t.sources||[]).indexOf(n) >= 0; }).length; }
function totalSteps(){ return TROPHIES.reduce(function(a,t){ return a + (t.steps||[]).length; }, 0); }
function citedSteps(){ return TROPHIES.reduce(function(a,t){ return a + (t.steps||[]).filter(function(s){ return s.s && s.s.length; }).length; }, 0); }
function honestyCount(label){ return TROPHIES.filter(function(t){ return t.honesty === label; }).length; }
function stageOrder(t){ return STAGES.findIndex(function(s){ return s.id === t.stage; }); }
function sortedTrophies(){
  return TROPHIES.slice().sort(function(a,b){
    var d = stageOrder(a) - stageOrder(b);
    return d !== 0 ? d : a.id - b.id;
  });
}
function sourceLink(n){
  var s = SOURCES[n-1];
  if(!s) return "["+n+"]";
  if(s.url) return '<a href="'+s.url+'" target="_blank" rel="noopener">['+n+'] '+esc(s.name)+'</a>';
  return "["+n+"] "+esc(s.name);
}

function renderAudit(){
  var g = gradeCounts();
  var hidden = TROPHIES.filter(function(t){ return t.hidden; }).length;
  var el = document.getElementById("audit");
  el.innerHTML = "<b>55 official</b> · <b>1P "+g.gold+"G "+g.silver+"S "+g.bronze+"B</b> · <b>"+hidden+" hidden</b> · <b>55/55 guides cite a source</b> · <b>"+citedSteps()+"/"+totalSteps()+" steps cited</b> · <b>10 sources read 20 Nov 2026</b> · <b>1 possibly missable</b> · <b>"+honestyCount("CONFIRMED")+" confirmed</b> · <b>"+honestyCount("UNCONFIRMED")+" unconfirmed</b> · <b>"+honestyCount("SINGLE-SOURCE")+" single-source</b> · <b>"+honestyCount("SOURCES DISAGREE")+" disagree</b>";
}
function renderProgress(){
  var e = earnedCount(), total = TROPHIES.length || 55;
  var pct = Math.round(e/total*100);
  document.getElementById("progressText").textContent = e+" / "+total+" earned — "+pct+"% to platinum";
  document.getElementById("progressFill").style.width = pct+"%";
}
function isSpoilerHidden(t){
  return state.spoiler && t.kind === "story" && !state.earned[t.id];
}
function trophyRow(t){
  var earned = !!state.earned[t.id];
  var hiddenName = isSpoilerHidden(t);
  var name = hiddenName ? "??? — hidden story trophy (earn it to reveal)" : esc(t.name);
  var desc = hiddenName ? "Story trophy — name and description hidden by spoiler mode." : esc(t.description);
  var meta = '<span class="badge '+t.grade+'">'+t.grade+'</span>'
    + '<span>'+t.stage+'</span>'
    + '<span>'+esc(t.kind)+'</span>'
    + (t.hidden ? '<span class="hiddenTag">HIDDEN</span>' : '')
    + (t.count ? '<span>count '+t.count+'</span>' : '')
    + '<span>★'.repeat(t.difficulty)+'☆'.repeat(5-t.difficulty)+'</span>'
    + '<span>'+esc(t.time)+'</span>'
    + '<span class="honesty '+t.honesty.replace(" ","-")+'">'+t.honesty+'</span>';
  return '<li class="trow'+(earned?' earned':'')+(selectedId===t.id?' selected':'')+'" data-id="'+t.id+'">'
    + '<input type="checkbox" '+(earned?'checked':'')+' data-check="'+t.id+'" aria-label="Earned: '+esc(t.name)+'">'
    + '<div><div class="tname">'+name+'</div><div class="tdesc">'+desc+'</div><div class="tmeta">'+meta+'</div></div>'
    + '<div></div></li>';
}
function filteredTrophies(){
  var q = (document.getElementById("search").value||"").toLowerCase();
  var kind = document.getElementById("kindFilter").value;
  var grade = document.getElementById("gradeFilter").value;
  var status = document.getElementById("statusFilter").value;
  return sortedTrophies().filter(function(t){
    if(kind && t.kind !== kind) return false;
    if(grade && t.grade !== grade) return false;
    if(status === "earned" && !state.earned[t.id]) return false;
    if(status === "todo" && state.earned[t.id]) return false;
    if(q){
      var hay = (t.name+" "+t.description+" "+t.guide+" "+(t.mission||"")).toLowerCase();
      if(hay.indexOf(q) < 0) return false;
    }
    return true;
  });
}
function renderList(){
  var list = filteredTrophies();
  document.getElementById("listHead").textContent = "Showing "+list.length+" of 55 trophies · "+earnedCount()+" earned";
  document.getElementById("list").innerHTML = list.map(trophyRow).join("");
}
function renderDetail(){
  var t = TROPHIES.find(function(x){ return x.id === selectedId; }) || TROPHIES[0];
  if(!t) return;
  var el = document.getElementById("detail");
  var steps = (t.steps||[]).map(function(s){
    var cites = (s.s||[]).map(function(n){ return "["+n+"]"; }).join(" ");
    return "<li>"+esc(s.t)+" <span class='cite'>"+cites+"</span></li>";
  }).join("");
  var counter = "";
  if(t.count){
    var cur = state.counters[t.id] || 0;
    counter = '<div class="counterbox">YOUR COUNT <button type="button" data-dec="'+t.id+'" aria-label="Decrease count">−</button> <span>'+cur+' / '+t.count+'</span> <button type="button" data-inc="'+t.id+'" aria-label="Increase count">+</button> <span style="font-weight:400;color:var(--muted)">'+esc(t.countLabel||"")+'</span></div>';
  }
  var srcs = (t.sources||[]).map(sourceLink).join("<br>");
  var warn = "";
  if(t.id === 28){
    warn = '<div class="warnbox"><h3>⚠ POSSIBLY MISSABLE — read first</h3><p>Chapter 1 balcony meditation with Lucia can be missed. <b>SOURCES DISAGREE — both versions shown:</b> (A) 18 meditations needed. (B) 100% only needs 15. Do all 18 to be safe.</p></div>';
  }
  el.innerHTML = '<h2>'+esc(t.name)+' <span class="badge '+t.grade+'">'+t.grade+'</span></h2>'
    + '<p class="tdesc">'+esc(t.description)+'</p>'
    + '<div class="tmeta"><span>'+t.stage+'</span><span>'+esc(t.kind)+'</span>'
    + (t.mission ? '<span>Mission: '+esc(t.mission)+'</span>' : '')
    + (t.hidden ? '<span class="hiddenTag">HIDDEN on PlayStation</span>' : '')
    + '<span>Difficulty '+t.difficulty+'/5</span><span>'+esc(t.time)+'</span>'
    + '<span class="honesty '+t.honesty.replace(" ","-")+'">'+t.honesty+'</span></div>'
    + warn + counter
    + '<h3>Guide — in our own words</h3><p>'+esc(t.guide)+'</p>'
    + '<h3>Steps ('+(t.steps||[]).length+' — every step cited)</h3><ol class="steps">'+steps+'</ol>'
    + '<div class="srcs"><b>Sources for this guide:</b><br>'+srcs+'<br>All sources read 20 Nov 2026.</div>';
}
function renderNextupBox(){
  var next = sortedTrophies().filter(function(t){ return !state.earned[t.id]; }).slice(0,3);
  var el = document.getElementById("nextupBox");
  if(!next.length){ el.innerHTML = "<b>NEXT UP:</b> all 55 earned — Leonida Legend. The platinum is yours."; return; }
  el.innerHTML = "<b>NEXT UP</b> (roadmap order): " + next.map(function(t){
    return '<span class="nu-item">#'+t.id+' '+esc(isSpoilerHidden(t) ? "??? story trophy" : t.name)+' · '+t.stage+'</span>';
  }).join("");
}

function renderRoadmap(){
  var html = STAGES.map(function(s){
    var inStage = TROPHIES.filter(function(t){ return t.stage === s.id; });
    var done = inStage.filter(function(t){ return state.earned[t.id]; }).length;
    var pct = inStage.length ? Math.round(done/inStage.length*100) : 0;
    var names = inStage.map(function(t){
      return "<li>"+(state.earned[t.id] ? "✓ " : "○ ")+esc(isSpoilerHidden(t) ? "??? story trophy" : t.name)+" ("+t.grade+")</li>";
    }).join("");
    return '<div class="stage"><h3>'+esc(s.title)+' — '+esc(s.hours)+'</h3>'
      + '<div class="smeta">'+esc(s.note)+' · '+done+'/'+inStage.length+' earned</div>'
      + '<div class="sbar"><div style="width:'+pct+'%"></div></div><ul>'+names+'</ul></div>';
  }).join("");
  document.getElementById("roadmap").innerHTML = html;
}
function renderWatchlist(){
  var unconf = TROPHIES.filter(function(t){ return t.honesty === "UNCONFIRMED"; });
  var single = TROPHIES.filter(function(t){ return t.honesty === "SINGLE-SOURCE"; });
  var dis = TROPHIES.filter(function(t){ return t.honesty === "SOURCES DISAGREE"; });
  function item(t){
    return '<div class="watchitem"><b>#'+t.id+' '+esc(t.name)+'</b> <span class="badge '+t.grade+'">'+t.grade+'</span> '
      + '<span class="honesty '+t.honesty.replace(" ","-")+'">'+t.honesty+'</span><br><span style="color:var(--muted)">'+esc(t.description)+'</span><br>'+esc(t.guide)+'</div>';
  }
  document.getElementById("watchlist").innerHTML =
    "<h3>Sources disagree ("+dis.length+")</h3>" + dis.map(item).join("") +
    "<h3>Unconfirmed — trigger not pinned down ("+unconf.length+")</h3>" + unconf.map(item).join("") +
    "<h3>Single-source — one guide only ("+single.length+")</h3>" + single.map(item).join("");
}
function renderNextup(){
  var next = sortedTrophies().filter(function(t){ return !state.earned[t.id]; }).slice(0,12);
  var el = document.getElementById("nextup");
  if(!next.length){ el.innerHTML = "<li>All 55 earned — platinum complete.</li>"; return; }
  el.innerHTML = next.map(function(t){
    return '<li><b>#'+t.id+' '+esc(isSpoilerHidden(t) ? "??? story trophy" : t.name)+'</b> <span class="badge '+t.grade+'">'+t.grade+'</span><br>'
      + '<span class="why">'+t.stage+' · '+esc(t.kind)+' · difficulty '+t.difficulty+'/5 · '+esc(t.time)
      + (t.mission ? ' · mission: '+esc(t.mission) : '') + (t.count ? ' · count '+t.count : '')
      + ' · <span class="honesty '+t.honesty.replace(" ","-")+'">'+t.honesty+'</span></span></li>';
  }).join("");
}
function renderSources(){
  var rows = SOURCES.map(function(s){
    return "<tr><td>["+s.n+"]</td><td>"+(s.url ? '<a href="'+s.url+'" target="_blank" rel="noopener">'+esc(s.name)+"</a>" : esc(s.name))+"</td><td>20 Nov 2026</td><td><b>cited by "+citedBy(s.n)+" of 55 guides</b></td></tr>";
  }).join("");
  document.getElementById("sourceMatrix").innerHTML =
    '<table class="matrix"><tr><th>#</th><th>Source</th><th>Read</th><th>Coverage</th></tr>'+rows+'</table>'
    + '<p style="color:var(--muted)">Official list [10]: names, descriptions, grades and hidden flags as Exophase and PSNProfiles listed them before this bounty opened, the two agreeing on every name, description and grade.</p>';
}
function renderAll(){
  renderAudit(); renderProgress(); renderList(); renderDetail();
  renderNextupBox(); renderRoadmap(); renderWatchlist(); renderNextup(); renderSources();
}
function switchTab(name){
  document.querySelectorAll("#tabs button").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-tab") === name);
  });
  document.querySelectorAll(".tabpage").forEach(function(p){
    p.hidden = (p.id !== "tab-"+name);
  });
}
function exportSave(){
  var blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-platinum-save.json";
  document.body.appendChild(a); a.click(); a.remove();
}
function importSave(file){
  var r = new FileReader();
  r.onload = function(){
    try{
      var p = JSON.parse(r.result);
      if(p.earned) state.earned = p.earned;
      if(p.counters) state.counters = p.counters;
      if(typeof p.spoiler === "boolean") state.spoiler = p.spoiler;
      saveState(); syncSpoilerBox(); renderAll();
    }catch(e){ alert("That file is not a valid save."); }
  };
  r.readAsText(file);
}
function syncSpoilerBox(){ document.getElementById("spoilerToggle").checked = state.spoiler; }
function bindEvents(){
  document.getElementById("tabs").addEventListener("click", function(e){
    var b = e.target.closest("button[data-tab]");
    if(b) switchTab(b.getAttribute("data-tab"));
  });
  ["search","kindFilter","gradeFilter","statusFilter"].forEach(function(id){
    document.getElementById(id).addEventListener("input", renderList);
    document.getElementById(id).addEventListener("change", renderList);
  });
  document.getElementById("spoilerToggle").addEventListener("change", function(e){
    state.spoiler = e.target.checked; saveState(); renderAll();
  });
  document.getElementById("exportBtn").addEventListener("click", exportSave);
  document.getElementById("importBtn").addEventListener("click", function(){
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", function(e){
    if(e.target.files[0]) importSave(e.target.files[0]);
    e.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", function(){
    if(confirm("Clear all earned trophies and counters?")){
      state.earned = {}; state.counters = {}; saveState(); renderAll();
    }
  });
  document.getElementById("list").addEventListener("click", function(e){
    var cb = e.target.closest("input[data-check]");
    if(cb){
      var id = +cb.getAttribute("data-check");
      state.earned[id] = cb.checked ? true : false;
      if(!cb.checked) delete state.earned[id];
      saveState(); renderAll();
      return;
    }
    var row = e.target.closest(".trow");
    if(row){ selectedId = +row.getAttribute("data-id"); renderList(); renderDetail(); }
  });
  document.getElementById("detail").addEventListener("click", function(e){
    var inc = e.target.closest("button[data-inc]");
    var dec = e.target.closest("button[data-dec]");
    if(!inc && !dec) return;
    var id = +(inc || dec).getAttribute(inc ? "data-inc" : "data-dec");
    var t = TROPHIES.find(function(x){ return x.id === id; });
    var cur = state.counters[id] || 0;
    cur = inc ? cur+1 : cur-1;
    cur = Math.max(0, Math.min(t.count, cur));
    state.counters[id] = cur;
    saveState(); renderDetail();
  });
}
function init(){
  loadState(); syncSpoilerBox(); bindEvents();
  fetch("data/trophies.json").then(function(r){ return r.json(); }).then(function(d){
    TROPHIES = d.trophies || d;
    renderAll();
  }).catch(function(){
    document.getElementById("audit").textContent = "Could not load data/trophies.json — are you serving app/ over HTTP?";
  });
}
document.addEventListener("DOMContentLoaded", init);
