const KEY="pet-review-v4";
let navList=[];
function setNav(list){navList=(list&&list.length)?list.slice():ITEMS.slice();}
function nextId(id){const i=navList.findIndex(x=>x.id===id);if(i<0||i>=navList.length-1)return null;return navList[i+1].id;}
const LEARNED_STREAK=3;
function isLearned(it){return ((state.srs[it.id]||{}).streak||0)>=LEARNED_STREAK;}
function inRedo(it){return !!(state.wrong&&state.wrong[it.id]);}
function displayTitle(it){
  let t=it.title||"";
  const ans=String(it.fill||it.answer||"").trim();
  if(ans){t=t.replace(new RegExp("\\s+"+ans.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*$","i"),"");}
  return t;
}
const old3=JSON.parse(localStorage.getItem("pet-review-v3")||"null");
const state=JSON.parse(localStorage.getItem(KEY)||"null")||old3||{tries:[],need:{},srs:{},wrong:{}};
if(!state.srs)state.srs={};
if(!state.wrong)state.wrong={};
(function seedWrong(){
  const last={};
  (state.tries||[]).forEach(t=>{last[t.id]=t;});
  Object.keys(last).forEach(id=>{if(last[id].ok===false)state.wrong[id]=true;});
})();
ITEMS.forEach(it=>{if(state.need[it.id]===undefined)state.need[it.id]=true;srsInit(it.id,state)});
function save(opts){
  localStorage.setItem(KEY,JSON.stringify(state));
  renderList();renderByQ();renderByTag();renderRedo();renderLater();renderLearned();renderHistory();
  if(!opts||!opts.skipPush)schedulePush();
}
function photoSrc(path){return (window.PHOTO&&PHOTO[path])||path}
document.querySelectorAll("#mainTabs button").forEach(btn=>btn.addEventListener("click",()=>{
document.querySelectorAll("#mainTabs button").forEach(b=>b.classList.remove("active"));
document.querySelectorAll("main > .panel").forEach(p=>p.classList.remove("active"));
btn.classList.add("active");document.getElementById(btn.dataset.tab).classList.add("active")}));
function renderList(){const box=document.getElementById("list");
const redoN=ITEMS.filter(inRedo).length;
const dueNew=ITEMS.filter(it=>srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it));
const syncLine='<p class="sub" id="homeSync">'+(typeof syncStatus==="string"?syncStatus:"")+'</p>';
if(!dueNew.length){box.innerHTML='<div class="card"><p>今天的题练完了。</p><p class="sub">做错的在「二次错题」里改。'+(redoN?('二次错题还有 <b>'+redoN+'</b> 道。'):'')+'</p>'+syncLine+'</div>';return;}
const intro=`<div class="card"><p>现在可以练 <b>${dueNew.length}</b> 题。</p>${redoN?`<p class="sub">另有 <b>${redoN}</b> 道在「二次错题」，做对才拿出来。</p>`:""}${syncLine}</div>`;
box.innerHTML=intro+dueNew.map(it=>itemRow(it,true)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(dueNew);openDetail(el.dataset.id,"quiz")}))}
function itemRow(it,forceDue){const rec=state.srs[it.id]||{streak:0};const due=forceDue||(srsDue(rec)&&!isLearned(it));
const badge=inRedo(it)?"二次错题":isLearned(it)?"已学会":due?"今日到期":srsWhen(rec);
return `<div class="card item ${due||inRedo(it)?"due":""}" data-id="${it.id}"><div><span class="badge ${due||inRedo(it)?"":"ok"}">${badge}</span><h3>${displayTitle(it)}</h3><p class="sub">${it.passage||it.tag||""}</p></div><button class="ghost">开始</button></div>`}
function renderByQ(){const box=document.getElementById("byQ");const map=itemsByPassage();
box.innerHTML="<div class=\"card\"><p>按<b>原题</b>归堆。</p></div>"+Object.keys(map).map(name=>{const list=map[name];return `<div class="card"><h3 style="margin:0 0 8px">${name}</h3><p class="sub">${list.length} 道</p></div>`+list.map(itemRow).join("")}).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS.find(x=>x.id===el.dataset.id);setNav((itemsByPassage()[it.passage])||[it]);openDetail(el.dataset.id,"quiz")}))}
function renderByTag(){const box=document.getElementById("byTag");const map=itemsByTag();
box.innerHTML="<div class=\"card\"><p>按<b>知识点</b>归堆。</p></div>"+TAG_ORDER.map(tag=>{const list=map[tag]||[];if(!list.length)return"";return `<div class="card"><h3 style="margin:0 0 6px">${tag}</h3><p class="sub">${list.length} 题</p></div>`+list.map(itemRow).join("")}).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS.find(x=>x.id===el.dataset.id);setNav((itemsByTag()[it.tag])||[it]);openDetail(el.dataset.id,"quiz")}))}
function openDetail(id,tab){const it=ITEMS.find(x=>x.id===id);const el=document.getElementById("detail");
el.innerHTML=`<div class="row"><button class="ghost" id="backList">← 返回</button></div>
<div class="tabs" id="subTabs">
<button data-sub="quiz" class="${tab==="quiz"?"active":""}">再做一次</button>
<button data-sub="note" class="${tab==="note"?"active":""}">错因笔记</button>
<button data-sub="photo" class="${tab==="photo"?"active":""}">看原题照片</button></div>
<div id="sub-quiz" class="panel ${tab==="quiz"?"active":""}"><div class="card"><span class="badge">${it.tag}</span><p class="sub">${it.passage||""} · ${it.tag||""}</p><div class="q-en">${it.prompt}</div><div class="choices" id="choices"></div><div id="result" class="explain" hidden></div><div class="row"><button class="ghost" id="retry">再练一遍</button><button class="primary" id="markAgain">这题还要复习</button><button class="primary" id="nextQ">下一题</button></div></div></div>
<div id="sub-note" class="panel ${tab==="note"?"active":""}"><div class="card"><span class="badge">${it.tag}</span><h3>${displayTitle(it)}</h3><div class="note-body">${it.note}</div></div></div>
<div id="sub-photo" class="panel ${tab==="photo"?"active":""}"><div class="card"><p>${it.passage}</p><img class="page" src="${photoSrc(it.photo)}" alt="${displayTitle(it)}"></div></div>`;
document.querySelectorAll("#mainTabs button").forEach(b=>b.classList.remove("active"));
document.querySelectorAll("main > .panel").forEach(p=>p.classList.remove("active"));el.classList.add("active");
document.getElementById("backList").onclick=()=>document.querySelector('#mainTabs button[data-tab="list"]').click();
el.querySelectorAll("#subTabs button").forEach(b=>b.onclick=()=>{el.querySelectorAll("#subTabs button").forEach(x=>x.classList.remove("active"));el.querySelectorAll("#sub-quiz,#sub-note,#sub-photo").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("sub-"+b.dataset.sub).classList.add("active")});
const choices=document.getElementById("choices");
it.options.forEach(op=>{const b=document.createElement("button");b.dataset.key=op.key;b.textContent=op.text;
b.onclick=()=>{if(choices.dataset.locked==="1")return;choices.dataset.locked="1";const ok=op.key===it.answer;
b.classList.add(ok?"correct":"wrong");choices.querySelector('[data-key="'+it.answer+'"]').classList.add("correct");
const blank=el.querySelector(".blank");if(blank)blank.textContent=it.fill;
const rec=srsMark(srsInit(it.id,state),ok);state.need[it.id]=!ok;if(ok)delete state.wrong[it.id];else state.wrong[it.id]=true;
const result=document.getElementById("result");result.hidden=false;
result.innerHTML=(ok?"<strong>对了。</strong> ":"<strong>进二次错题本。</strong> ")+(ok?it.ok:it.bad)+"<p>下次：<b>"+(ok?SRS_STEPS[rec.step].label:"留在二次错题里改")+"</b></p>";
state.tries.push({at:new Date().toISOString(),id:it.id,ok});save()};choices.appendChild(b)});
document.getElementById("retry").onclick=()=>openDetail(id,"quiz");
document.getElementById("markAgain").onclick=()=>{srsMark(srsInit(it.id,state),false);state.need[it.id]=true;state.wrong[it.id]=true;save()};
const nid=nextId(id);const nextBtn=document.getElementById("nextQ");
if(!nid){nextBtn.disabled=true;nextBtn.textContent="已经是最后一题";}else nextBtn.onclick=()=>openDetail(nid,"quiz");}
function renderCards(){const box=document.getElementById("cards");box.innerHTML=CARDS.map(c=>`<div class="card flip" data-front="${c[0]}" data-back="${c[1]}" data-hint="${c[2]}"></div>`).join("");
box.querySelectorAll(".flip").forEach(card=>{card.innerHTML=`<div class="front"><div class="cn">${card.dataset.front}</div><div class="hint">点击看英文</div></div><div class="back" hidden><div class="en">${card.dataset.back}</div><div class="hint">${card.dataset.hint}</div></div>`;
card.onclick=()=>{const f=card.querySelector(".front"),b=card.querySelector(".back"),show=b.hidden;f.hidden=show;b.hidden=!show}})}
function renderRedo(){const box=document.getElementById("redo");
const list=ITEMS.filter(inRedo);
if(!list.length){box.innerHTML='<div class="card"><p>二次错题本是空的。</p><p class="sub">答错或点「这题还要复习」会进这里，做对才拿出去。</p></div>';return;}
box.innerHTML='<div class="card"><p>这 <b>'+list.length+'</b> 道还沠做对，先改这些。</p></div>'+list.map(it=>`<div class="card item due" data-id="${it.id}"><div><span class="badge">二次错题</span><h3>${displayTitle(it)}</h3><p class="sub">${it.passage||it.tag||""}</p></div><button class="ghost">改错</button></div>`).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(list);openDetail(el.dataset.id,"quiz")}))}
function renderLater(){const box=document.getElementById("later");
const list=ITEMS.filter(it=>!srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it));
list.sort((a,b)=>state.srs[a.id].next-state.srs[b.id].next);
if(!list.length){box.innerHTML='<div class="card"><p>沠有在等的题。</p><p class="sub">做对之后还沠到点的会进这里。</p></div>';return;}
box.innerHTML='<div class="card"><p>这些题还沠到点。</p></div>'+list.map(it=>itemRow(it,false)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(list);openDetail(el.dataset.id,"quiz")}))}
function renderLearned(){const box=document.getElementById("learned");
const list=ITEMS.filter(isLearned);
if(!list.length){box.innerHTML='<div class="card"><p>还沠有已学会的题。连对 '+LEARNED_STREAK+' 次会进这里。</p></div>';return;}
box.innerHTML='<div class="card"><p>连对 <b>'+LEARNED_STREAK+'</b> 次以上的题。答错会回到二次错题本。</p></div>'+list.map(it=>{const rec=state.srs[it.id]||{};return `<div class="card item" data-id="${it.id}"><div><span class="badge ok">已学会 · ${rec.streak||0}次</span><h3>${displayTitle(it)}</h3><p class="sub">${it.passage||it.tag||""}</p></div><button class="ghost">再练</button></div>`}).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(list);openDetail(el.dataset.id,"quiz")}))}
function renderHistory(){document.getElementById("statTried").textContent=state.tries.length;document.getElementById("statRight").textContent=state.tries.filter(t=>t.ok).length;document.getElementById("statNeed").textContent=ITEMS.filter(it=>srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it)).length;
const box=document.getElementById("historyList");if(!state.tries.length){box.innerHTML='<p class="sub">还沠有记录。</p>';return;}
const names=Object.fromEntries(ITEMS.map(it=>[it.id,displayTitle(it)]));
box.innerHTML=state.tries.slice().reverse().slice(0,40).map(t=>{const time=new Date(t.at).toLocaleString("zh-CN",{hour12:false});return `<div class="history-item"><span>${time}</span><span>${t.note||((t.ok?"做对 ":"二次错题 ")+(names[t.id]||""))}</span></div>`}).join("")}
function bindSettings(){
  const input=document.getElementById("tokenInput");
  input.value=getToken();
  document.getElementById("saveToken").onclick=()=>{setToken(input.value);setSyncStatus(getToken()?"token 已存本机，正在写一次":"已清掉 token");if(getToken())pushRemote();};
  document.getElementById("clearToken").onclick=()=>{setToken("");input.value="";setSyncStatus("已清掉 token，只用本机进度");};
  document.getElementById("pullNow").onclick=()=>pullRemote();
  document.getElementById("pushNow").onclick=()=>pushRemote();
  const n=(state.tries||[]).length;
  const el=document.getElementById("localMem");
  if(el) el.textContent="这台设备练习记录 "+n+" 次。";
  setSyncStatus(getToken()?"已有 token。做完题会写到仓库，另一台打开就能看到。":"沠贴 token：这台记得住，另一台看不到。");
}
renderList();renderByQ();renderByTag();renderCards();renderRedo();renderLater();renderLearned();renderHistory();bindSettings();
pullRemote();
