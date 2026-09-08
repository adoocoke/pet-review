const KEY="pet-review-v4";
let navList=[];
function setNav(list){navList=(list&&list.length)?list.slice():ITEMS.slice();}
function isGapItem(it){return it&&(it.kind==="gap"||!(it.options&&it.options.length));}
function gapGroup(it){return ITEMS.filter(x=>isGapItem(x)&&x.passage===it.passage);}
function listUnits(items){
  const seen={};
  return items.filter(it=>{
    if(!isGapItem(it)) return true;
    if(seen[it.passage]) return false;
    seen[it.passage]=true;
    return true;
  });
}
function nextId(id){
  const cur=ITEMS.find(x=>x.id===id);
  const i=navList.findIndex(x=>x.id===id);
  if(i<0) return null;
  for(let k=i+1;k<navList.length;k++){
    const n=navList[k];
    if(isGapItem(cur)&&isGapItem(n)&&n.passage===cur.passage) continue;
    return n.id;
  }
  return null;
}
const LEARNED_STREAK=3;
function isLearned(it){return ((state.srs[it.id]||{}).streak||0)>=LEARNED_STREAK;}
function inRedo(it){return !!(state.wrong&&state.wrong[it.id]);}
function examOf(it){return it.exam||"KET"}
function examClass(it){return examOf(it)==="PET"?"pet":"ket"}
function displayTitle(it){
  let t=it.title||"";
  const ans=String(it.fill||it.answer||"").trim();
  if(ans){t=t.replace(new RegExp("\\s+"+ans.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*$","i"),"");}
  return t;
}
function gapLocked(id){return !!(state.gapLock&&state.gapLock[id]);}
function setGapLock(id,on){
  if(!state.gapLock)state.gapLock={};
  if(on)state.gapLock[id]=true;else delete state.gapLock[id];
}
function clearGapLocks(peers){peers.forEach(g=>setGapLock(g.id,false));}
const old3=JSON.parse(localStorage.getItem("pet-review-v3")||"null");
const state=JSON.parse(localStorage.getItem(KEY)||"null")||old3||{tries:[],need:{},srs:{},wrong:{}};
if(!state.srs)state.srs={};
if(!state.wrong)state.wrong={};
if(!state.gapLock)state.gapLock={};
(function seedWrong(){
  const last={};
  (state.tries||[]).forEach(t=>{last[t.id]=t;});
  Object.keys(last).forEach(id=>{if(last[id].ok===false)state.wrong[id]=true;});
})();
ITEMS.forEach(it=>{if(state.need[it.id]===undefined)state.need[it.id]=true;srsInit(it.id,state)});
function save(opts){
  localStorage.setItem(KEY,JSON.stringify(state));
  renderList();renderByQ();renderByTag();renderByExam();renderRedo();renderLater();renderLearned();renderHistory();
  if(!opts||!opts.skipPush)schedulePush();
}
function photoSrc(path){return (window.PHOTO&&PHOTO[path])||path}
document.querySelectorAll("#mainTabs button").forEach(btn=>btn.addEventListener("click",()=>{
document.querySelectorAll("#mainTabs button").forEach(b=>b.classList.remove("active"));
document.querySelectorAll("main > .panel").forEach(p=>p.classList.remove("active"));
btn.classList.add("active");document.getElementById(btn.dataset.tab).classList.add("active")}));
function renderList(){const box=document.getElementById("list");
const redoN=ITEMS.filter(inRedo).length;
const dueNew=listUnits(ITEMS.filter(it=>srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it)));
const syncLine='<p class="sub" id="homeSync">'+(typeof syncStatus==="string"?syncStatus:"")+'</p>';
if(!dueNew.length){box.innerHTML='<div class="card"><p>今天的题练完了。</p><p class="sub">做错的在「二次错题」里改。'+(redoN?('二次错题还有 <b>'+redoN+'</b> 道。'):'')+'</p>'+syncLine+'</div>';return;}
const intro=`<div class="card"><p>现在可以练 <b>${dueNew.length}</b> 题。</p>${redoN?`<p class="sub">另有 <b>${redoN}</b> 道在「二次错题」，做对才拿出来。</p>`:""}${syncLine}</div>`;
box.innerHTML=intro+dueNew.map(it=>itemRow(it,true)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(dueNew);openDetail(el.dataset.id,"quiz")}))}
function itemRow(it,forceDue){
  const rec=state.srs[it.id]||{streak:0};
  const due=forceDue||(srsDue(rec)&&!isLearned(it));
  const badge=inRedo(it)?"二次错题":isLearned(it)?"已学会":due?"今日到期":srsWhen(rec);
  if(isGapItem(it)){
    const peers=gapGroup(it);
    const locked=peers.filter(g=>gapLocked(g.id)).length;
    const left=peers.length-locked;
    const anyRedo=peers.some(inRedo);
    const allLearn=peers.every(isLearned);
    const gBadge=anyRedo?"二次错题":allLearn?"已学会":(left?"今日到期":"已对完");
    return `<div class="card item ${anyRedo||left?"due":""}" data-id="${it.id}"><div><span class="badge ${anyRedo||left?"":"ok"}">${gBadge}</span><span class="badge ${examClass(it)}">${examOf(it)}</span><h3>${it.passage||displayTitle(it)}</h3><p class="sub">${left?("还要填 "+left+" 空 · 已对 "+locked+" 空"):(peers.length+" 空都对了")}</p></div><button class="ghost">开始</button></div>`;
  }
  return `<div class="card item ${due||inRedo(it)?"due":""}" data-id="${it.id}"><div><span class="badge ${due||inRedo(it)?"":"ok"}">${badge}</span><span class="badge ${examClass(it)}">${examOf(it)}</span><h3>${displayTitle(it)}</h3><p class="sub">${it.passage||it.tag||""}</p></div><button class="ghost">开始</button></div>`;
}
function renderByQ(){const box=document.getElementById("byQ");const map=itemsByPassage();
box.innerHTML="<div class=\"card\"><p>按<b>原题</b>归堆。语法填空点进去一次填整篇。</p></div>"+Object.keys(map).map(name=>{const list=map[name];const head=list[0];
if(isGapItem(head)){
  return `<div class="card item" data-id="${head.id}"><div><span class="badge pet">PET</span><h3>${name}</h3><p class="sub">${list.length} 空 · 点进去整篇填</p></div><button class="ghost">开始</button></div>`;
}
return `<div class="card"><h3 style="margin:0 0 8px">${name}</h3><p class="sub">${list.length} 道</p></div>`+list.map(itemRow).join("");
}).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS.find(x=>x.id===el.dataset.id);setNav(isGapItem(it)?gapGroup(it):((itemsByPassage()[it.passage])||[it]));openDetail(el.dataset.id,"quiz")}))}
const TAG_OPEN_KEY="pet-review-tag-open";
function tagOpenMap(){try{return JSON.parse(localStorage.getItem(TAG_OPEN_KEY)||"{}")}catch(e){return {}}}
function setTagOpen(tag,open){const m=tagOpenMap();m[tag]=!!open;localStorage.setItem(TAG_OPEN_KEY,JSON.stringify(m))}
function renderByTag(){const box=document.getElementById("byTag");const map=itemsByTag();const opened=tagOpenMap();
box.innerHTML='<div class="card"><p>按<b>知识点</b>归堆。点一类展开，再点收起。</p></div>'+TAG_ORDER.map(tag=>{
  const list=map[tag]||[];if(!list.length)return"";
  const shown=opened[tag]===true;
  const rows=listUnits(list);
  return `<div class="fold">
    <div class="card fold-head" data-tag="${tag}"><div><h3>${shown?"▾":"▸"} ${tag}</h3><p class="sub">${list.length} 题</p></div><button type="button" class="ghost">${shown?"收起":"展开"}</button></div>
    <div class="fold-body"${shown?"":" hidden"}>${rows.map(itemRow).join("")}</div>
  </div>`;
}).join("");
box.querySelectorAll(".fold-head").forEach(el=>el.addEventListener("click",()=>{
  const tag=el.dataset.tag;setTagOpen(tag,tagOpenMap()[tag]!==true);renderByTag();
}));
box.querySelectorAll(".fold-body .item").forEach(el=>el.addEventListener("click",()=>{
  const it=ITEMS.find(x=>x.id===el.dataset.id);setNav(isGapItem(it)?gapGroup(it):((itemsByTag()[it.tag])||[it]));openDetail(el.dataset.id,"quiz");
}))}
function renderByExam(){const box=document.getElementById("byExam");if(!box)return;const map=itemsByExam();
box.innerHTML='<div class="card"><p>按<b>考试</b>归堆。KET 是阅读选择；PET 有告示、匹配、语法填空。</p></div>'+["KET","PET"].map(name=>{
  const list=map[name]||[];
  if(!list.length) return `<div class="card"><h3 style="margin:0 0 8px">${name}</h3><p class="sub">还没有题。</p></div>`;
  const rows=listUnits(list);
  return `<div class="card"><h3 style="margin:0 0 8px">${name}</h3><p class="sub">${list.length} 道</p></div>`+rows.map(itemRow).join("");
}).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS.find(x=>x.id===el.dataset.id);setNav(isGapItem(it)?gapGroup(it):((itemsByExam()[it.exam])||[it]));openDetail(el.dataset.id,"quiz")}))}
function gapNum(it){
  const m=String(it.title||"").match(/第\s*(\d+)\s*空/);
  return m?m[1]:"";
}
function paintBlank(g,cls,text){
  return (g.prompt||"").replace(/<span class="blank">[^<]*<\/span>/,'<span class="blank '+cls+'">'+text+"</span>");
}
function paintInput(g){
  return (g.prompt||"").replace(/<span class="blank">[^<]*<\/span>/,'<span class="blank"><input class="gap-in" data-gid="'+g.id+'" maxlength="24" autocomplete="off" spellcheck="false" placeholder="一词"></span>');
}
function openDetail(id,tab){const it=ITEMS.find(x=>x.id===id);const el=document.getElementById("detail");
const peers=isGapItem(it)?gapGroup(it):[it];
const notes=peers.map(g=>"<h3 style=\"margin:12px 0 6px\">"+displayTitle(g)+"</h3><div class=\"note-body\">"+(g.note||"")+"</div>").join("");
el.innerHTML=`<div class="row"><button class="ghost" id="backList">← 返回</button></div>
<div class="tabs" id="subTabs">
<button data-sub="quiz" class="${tab==="quiz"?"active":""}">再做一次</button>
<button data-sub="note" class="${tab==="note"?"active":""}">错因笔记</button>
<button data-sub="photo" class="${tab==="photo"?"active":""}">看原题照片</button></div>
<div id="sub-quiz" class="panel ${tab==="quiz"?"active":""}"><div class="card"><span class="badge ${examClass(it)}">${examOf(it)}</span> <span class="badge">${isGapItem(it)?"语法填空":(it.tag||"")}</span><p class="sub">${it.passage||""} · ${examOf(it)}</p><div class="q-en">${it.prompt||""}</div><div class="choices" id="choices"></div><div id="reasonPane" hidden><p class="sub">可以说说为什么选这个。理由对上才算对，对不上进二次错题本。</p><textarea id="reasonText" class="field" rows="3" placeholder="例如：后面是 with people，只能用 popular with"></textarea><div class="row"><button class="ghost" id="micBtn" type="button">语音输入</button><button class="primary" id="judgeReason" type="button">按理由判断</button><button class="ghost" id="skipReason" type="button">只按选项</button></div></div><div id="result" class="explain" hidden></div><div class="row"><button class="ghost" id="retry">再练一遍</button><button class="primary" id="markAgain">这题还要复习</button><button class="primary" id="nextQ">下一题</button></div></div></div>
<div id="sub-note" class="panel ${tab==="note"?"active":""}"><div class="card"><span class="badge ${examClass(it)}">${examOf(it)}</span> <span class="badge">${it.tag||""}</span>${notes}</div></div>
<div id="sub-photo" class="panel ${tab==="photo"?"active":""}"><div class="card"><p>${it.passage||""}</p><img class="page" src="${photoSrc(it.photo)}" alt="${displayTitle(it)}"></div></div>`;
document.querySelectorAll("#mainTabs button").forEach(b=>b.classList.remove("active"));
document.querySelectorAll("main > .panel").forEach(p=>p.classList.remove("active"));el.classList.add("active");
document.getElementById("backList").onclick=()=>document.querySelector('#mainTabs button[data-tab="list"]').click();
el.querySelectorAll("#subTabs button").forEach(b=>b.onclick=()=>{el.querySelectorAll("#subTabs button").forEach(x=>x.classList.remove("active"));el.querySelectorAll("#sub-quiz,#sub-note,#sub-photo").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("sub-"+b.dataset.sub).classList.add("active")});
const choices=document.getElementById("choices");
function finishQuiz(ok,reasonNote){
  choices.dataset.locked="1";
  choices.querySelectorAll("button").forEach(x=>x.classList.remove("picked"));
  const right=choices.querySelector('[data-key="'+it.answer+'"]');
  if(right)right.classList.add("correct");
  if(!ok){const w=choices.querySelector(".picked-keep");if(w&&w.dataset.key!==it.answer)w.classList.add("wrong");}
  const blank=el.querySelector(".blank");if(blank)blank.textContent=it.fill;
  const rec=srsMark(srsInit(it.id,state),ok);state.need[it.id]=!ok;if(ok)delete state.wrong[it.id];else state.wrong[it.id]=true;
  const result=document.getElementById("result");result.hidden=false;
  const pane=document.getElementById("reasonPane");if(pane)pane.hidden=true;
  result.innerHTML=(ok?"<strong>对了。</strong> ":"<strong>进二次错题本。</strong> ")+(reasonNote?("<p>"+reasonNote+"</p>"):"")+(ok?it.ok:it.bad)+"<p>下次：<b>"+(ok?SRS_STEPS[rec.step].label:"留在二次错题里改")+"</b></p>";
  state.tries.push({at:new Date().toISOString(),id:it.id,ok,reason:reasonNote||""});save();
}
function normGap(s){return String(s||"").trim().toLowerCase();}
function gapOk(g,typed){
  const pool=[g.answer].concat(g.alts||[]).map(normGap);
  return pool.indexOf(normGap(typed))>=0;
}
if(isGapItem(it)){
  const pane0=document.getElementById("reasonPane");if(pane0)pane0.hidden=true;
  const qen=el.querySelector(".q-en");
  qen.innerHTML=peers.map(g=>{
    const n=gapNum(g);
    const body=gapLocked(g.id)?paintBlank(g,"ok",g.fill||g.answer):paintInput(g);
    return '<div class="gap-line" data-gid="'+g.id+'">'+(n?'<span class="n">'+n+'.</span> ':'')+body+"</div>";
  }).join("");
  const left0=peers.filter(g=>!gapLocked(g.id)).length;
  choices.innerHTML='<p class="sub">一空一词。绿色是已经对的，不用再写。大小写无所谓。</p><div class="row"><button class="primary" type="button" id="checkGap">'+(left0?"提交判断":"已经全对了")+'</button></div>';
  function submitPassage(){
    if(choices.dataset.locked==="1")return;
    const open=peers.filter(g=>!gapLocked(g.id));
    if(!open.length){
      document.getElementById("result").hidden=false;
      document.getElementById("result").innerHTML="<strong>这篇空都对过了。</strong> 点「再练一遍」会重新空出来考一次。";
      return;
    }
    let empty=0,good=[],bad=[];
    open.forEach(g=>{
      const inp=qen.querySelector('input[data-gid="'+g.id+'"]');
      const typed=inp?inp.value:"";
      if(!normGap(typed)){empty++;return;}
      if(gapOk(g,typed)) good.push({g,typed}); else bad.push({g,typed});
    });
    if(empty){
      document.getElementById("result").hidden=false;
      document.getElementById("result").innerHTML="还有空没写。写完再提交。";
      return;
    }
    choices.dataset.locked="1";
    good.forEach(x=>{
      setGapLock(x.g.id,true);
      const rec=srsMark(srsInit(x.g.id,state),true);
      state.need[x.g.id]=false;delete state.wrong[x.g.id];
      state.tries.push({at:new Date().toISOString(),id:x.g.id,ok:true,reason:"写了 "+x.typed});
      const line=qen.querySelector('.gap-line[data-gid="'+x.g.id+'"]');
      if(line) line.innerHTML='<span class="n">'+(gapNum(x.g)||"")+(gapNum(x.g)?".":"")+"</span> "+paintBlank(x.g,"ok",x.g.fill||x.g.answer);
    });
    bad.forEach(x=>{
      const rec=srsMark(srsInit(x.g.id,state),false);
      state.need[x.g.id]=true;state.wrong[x.g.id]=true;
      state.tries.push({at:new Date().toISOString(),id:x.g.id,ok:false,reason:"写了 "+x.typed});
      const line=qen.querySelector('.gap-line[data-gid="'+x.g.id+'"]');
      if(line) line.innerHTML='<span class="n">'+(gapNum(x.g)||"")+(gapNum(x.g)?".":"")+"</span> "+paintBlank(x.g,"bad"," ");
    });
    const still=peers.filter(g=>!gapLocked(g.id));
    const allOk=!still.length;
    if(allOk) clearGapLocks(peers);
    const result=document.getElementById("result");result.hidden=false;
    if(allOk){
      result.innerHTML="<strong>全对，这篇过了。</strong><p>对的空已经留在下划线上。</p><p>下次到期会重新空出来再考一遍。</p>";
    }else{
      const bits=bad.map(x=>'<p>第 '+(gapNum(x.g)||"")+' 空写了 <b>'+x.typed+"</b>。"+x.g.bad+"</p>").join("");
      const goods=good.map(x=>x.g.ok).filter(Boolean).map(t=>"<p>"+t+"</p>").join("");
      result.innerHTML="<strong>对了 "+good.length+" 空，还有 "+still.length+" 空下次再填。</strong>"+bits+goods+"<p>对的下次显示绿色，错的还是空着。</p>";
    }
    save();
  }
  const btn=document.getElementById("checkGap");
  if(left0) btn.onclick=submitPassage; else btn.disabled=true;
  qen.addEventListener("keydown",e=>{if(e.key==="Enter")submitPassage();});
  const first=qen.querySelector(".gap-in");if(first)first.focus();
}else it.options.forEach(op=>{const b=document.createElement("button");b.dataset.key=op.key;b.textContent=op.text;
b.onclick=()=>{if(choices.dataset.locked==="1")return;
choices.querySelectorAll("button").forEach(x=>{x.classList.remove("picked");x.classList.remove("picked-keep")});
b.classList.add("picked");b.classList.add("picked-keep");
const pane=document.getElementById("reasonPane");pane.hidden=false;
document.getElementById("reasonText").value="";
document.getElementById("result").hidden=true;
};
choices.appendChild(b)});
document.getElementById("micBtn").onclick=()=>startListen(document.getElementById("reasonText"),document.getElementById("micBtn"));
document.getElementById("judgeReason").onclick=()=>{
  if(choices.dataset.locked==="1")return;
  const picked=choices.querySelector(".picked-keep");
  if(!picked){document.getElementById("result").hidden=false;document.getElementById("result").innerHTML="先选一个选项。";return;}
  const letterOk=picked.dataset.key===it.answer;
  const chk=checkReason(document.getElementById("reasonText").value,it);
  const ok=letterOk&&chk.ok;
  let note=chk.msg;
  if(!letterOk) note="选项就不对。"+chk.msg;
  else if(!chk.ok) note="选项对了，但理由没对上。"+chk.msg;
  finishQuiz(ok,note);
};
document.getElementById("skipReason").onclick=()=>{
  if(choices.dataset.locked==="1")return;
  const picked=choices.querySelector(".picked-keep");
  if(!picked)return;
  finishQuiz(picked.dataset.key===it.answer,"");
};
document.getElementById("retry").onclick=()=>openDetail(id,"quiz");
document.getElementById("markAgain").onclick=()=>{
  const pack=isGapItem(it)?gapGroup(it):[it];
  pack.forEach(g=>{
    srsMark(srsInit(g.id,state),false);
    state.need[g.id]=true;state.wrong[g.id]=true;
    setGapLock(g.id,false);
  });
  save();openDetail(id,"quiz");
};
const nid=nextId(id);const nextBtn=document.getElementById("nextQ");
if(!nid){nextBtn.disabled=true;nextBtn.textContent="已经是最后一题";}else nextBtn.onclick=()=>openDetail(nid,"quiz");}
let cardFilter="PET";
function renderCards(){const box=document.getElementById("cards");
const list=CARDS.filter(c=>{
  if(cardFilter==="PET") return c.exam==="PET";
  if(cardFilter==="KET") return c.exam!=="PET";
  return true;
});
const filters=`<div class="card"><p>红笔生词在「PET 生词」里。先看中文，点卡片看英文和例句。</p><div class="row">
<button class="ghost${cardFilter==="PET"?" primary":""}" data-cf="PET">PET 生词 ${CARDS.filter(c=>c.exam==="PET").length}</button>
<button class="ghost${cardFilter==="KET"?" primary":""}" data-cf="KET">KET ${CARDS.filter(c=>c.exam!=="PET").length}</button>
<button class="ghost${cardFilter==="ALL"?" primary":""}" data-cf="ALL">全部 ${CARDS.length}</button>
</div></div>`;
box.innerHTML=filters+list.map(c=>`<div class="card flip" data-front="${c[0]}" data-back="${c[1]}" data-hint="${c[2]}"></div>`).join("");
box.querySelectorAll("[data-cf]").forEach(b=>b.onclick=()=>{cardFilter=b.dataset.cf;renderCards()});
box.querySelectorAll(".flip").forEach(card=>{card.innerHTML=`<div class="front"><div class="cn">${card.dataset.front}</div><div class="hint">点击看英文</div></div><div class="back" hidden><div class="en">${card.dataset.back}</div><div class="hint">${card.dataset.hint}</div></div>`;
card.onclick=()=>{const f=card.querySelector(".front"),b=card.querySelector(".back"),show=b.hidden;f.hidden=show;b.hidden=!show}})}
function renderRedo(){const box=document.getElementById("redo");
const raw=ITEMS.filter(inRedo);
const list=listUnits(raw);
if(!list.length){box.innerHTML='<div class="card"><p>二次错题本是空的。</p><p class="sub">答错或点「这题还要复习」会进这里，做对才拿出去。</p></div>';return;}
box.innerHTML='<div class="card"><p>这 <b>'+list.length+'</b> 篇还没做对，先改这些。</p></div>'+list.map(it=>itemRow(it,true)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS.find(x=>x.id===el.dataset.id);setNav(isGapItem(it)?gapGroup(it):raw);openDetail(el.dataset.id,"quiz")}))}
function renderLater(){const box=document.getElementById("later");
const list=listUnits(ITEMS.filter(it=>!srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it)));
if(!list.length){box.innerHTML='<div class="card"><p>没有在等的题。</p><p class="sub">做对之后还没到点的会进这里。</p></div>';return;}
box.innerHTML='<div class="card"><p>这些题还没到点。</p></div>'+list.map(it=>itemRow(it,false)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(list);openDetail(el.dataset.id,"quiz")}))}
function renderLearned(){const box=document.getElementById("learned");
const list=listUnits(ITEMS.filter(isLearned));
if(!list.length){box.innerHTML='<div class="card"><p>还没有已学会的题。连对 '+LEARNED_STREAK+' 次会进这里。</p></div>';return;}
box.innerHTML='<div class="card"><p>连对 <b>'+LEARNED_STREAK+'</b> 次以上的题。答错会回到二次错题本。</p></div>'+list.map(it=>itemRow(it,false)).join("");
box.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>{setNav(list);openDetail(el.dataset.id,"quiz")}))}
function renderHistory(){document.getElementById("statTried").textContent=state.tries.length;document.getElementById("statRight").textContent=state.tries.filter(t=>t.ok).length;document.getElementById("statNeed").textContent=listUnits(ITEMS.filter(it=>srsDue(state.srs[it.id])&&!isLearned(it)&&!inRedo(it))).length;
const box=document.getElementById("historyList");if(!state.tries.length){box.innerHTML='<p class="sub">还没有记录。</p>';return;}
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
  setSyncStatus(getToken()?"已有 token。做完题会写到仓库，另一台打开就能看到。":"没贴 token：这台记得住，另一台看不到。");
}
renderList();renderByQ();renderByTag();renderByExam();renderCards();renderRedo();renderLater();renderLearned();renderHistory();bindSettings();
pullRemote();
