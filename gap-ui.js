function gapKey(it,g){return it.gaps?(it.id+":"+g.n):(g.id||it.id);}
function practiceGaps(it){return (it.gaps||[]).filter(function(g){return !g.given;});}
function blankFilled(n,cls,text,gid){
  return '<span class="blank '+cls+'" data-n="'+n+'"'+(gid?' data-gid="'+gid+'"':'')+'><sup class="bn">'+n+"</sup>"+text+"</span>";
}
function blankInput(n,gid){
  return '<span class="blank" data-n="'+n+'"><sup class="bn">'+n+'</sup><input class="gap-in" data-gid="'+gid+'" maxlength="24" autocomplete="off" spellcheck="false" placeholder=""></span>';
}
function renderPassageHtml(it){
  if(!(it&&it.article&&it.gaps)) return "";
  var html=String(it.article);
  it.gaps.forEach(function(g){
    var key=gapKey(it,g);
    var slot=g.given?blankFilled(g.n,"given",g.answer,""):(gapLocked(key)?blankFilled(g.n,"ok",g.answer,key):blankInput(g.n,key));
    html=html.split("{{"+g.n+"}}").join(slot);
  });
  return '<span class="heading">'+(it.heading||it.title||it.passage||"")+"</span>"+html;
}
(function(){
  var _itemRow=itemRow;
  itemRow=function(it,forceDue){
    if(it&&it.gaps){
      var rec=state.srs[it.id]||{streak:0};
      var practice=practiceGaps(it);
      var locked=practice.filter(function(g){return gapLocked(gapKey(it,g));}).length;
      var left=practice.length-locked;
      var anyRedo=inRedo(it);
      var allLearn=isLearned(it);
      var gBadge=anyRedo?"二次错题":allLearn?"已学会":(left?"今日到期":"已对完");
      return '<div class="card item '+(anyRedo||left?"due":"")+'" data-id="'+it.id+'"><div><span class="badge '+(anyRedo||left?"":"ok")+'">'+gBadge+'</span><span class="badge '+examClass(it)+'">'+examOf(it)+'</span><h3>'+(it.passage||displayTitle(it))+'</h3><p class="sub">'+(left?("还要填 "+left+" 空 · 文里已对 "+locked+" 空"):"这篇要改的空都对了")+"</p></div><button class=\"ghost\">开始</button></div>";
    }
    return _itemRow(it,forceDue);
  };
})();
(function(){
  var _open=openDetail;
  openDetail=function(id,tab){
    var it=ITEMS.find(function(x){return x.id===id;});
    _open(id,tab);
    if(!it||!it.article||!it.gaps) return;
    var el=document.getElementById("detail");
    var qen=el.querySelector(".q-en");
    var choices=document.getElementById("choices");
    var result=document.getElementById("result");
    if(!qen||!choices) return;
    qen.classList.add("passage");
    qen.innerHTML=renderPassageHtml(it);
    var units=practiceGaps(it);
    var left0=units.filter(function(g){return !gapLocked(gapKey(it,g));}).length;
    choices.innerHTML='<p class="sub">整篇一起看。第一次做对的空已经写在下划线上，空白的才要填。一空一词，大小写无所谓。</p><div class="row"><button class="primary" type="button" id="checkGap">'+(left0?"提交判断":"已经全对了")+"</button></div>";
    if(result) result.hidden=true;
    function submitPassage(){
      if(choices.dataset.locked==="1") return;
      var open=units.filter(function(g){return !gapLocked(gapKey(it,g));});
      if(!open.length){
        result.hidden=false;
        result.innerHTML="<strong>这篇要改的空都对过了。</strong> 点「再练一遍」会把改错空重新空出来。第一次做对的空还留在文里。";
        return;
      }
      var empty=0,good=[],bad=[];
      open.forEach(function(g){
        var key=gapKey(it,g);
        var inp=qen.querySelector('input[data-gid="'+key+'"]');
        var typed=inp?inp.value:"";
        if(!normGap(typed)){empty++;return;}
        if(gapOk(g,typed)) good.push({g:g,typed:typed,key:key}); else bad.push({g:g,typed:typed,key:key});
      });
      if(empty){
        result.hidden=false;
        result.innerHTML="还有空没写。写完再提交。";
        return;
      }
      choices.dataset.locked="1";
      good.forEach(function(x){
        setGapLock(x.key,true);
        state.tries.push({at:new Date().toISOString(),id:it.id,ok:true,reason:"第"+x.g.n+"空 写了 "+x.typed});
        var inp=qen.querySelector('input[data-gid="'+x.key+'"]');
        if(inp){
          var wrap=inp.closest(".blank")||inp.parentNode;
          wrap.className="blank ok";
          wrap.innerHTML='<sup class="bn">'+x.g.n+"</sup>"+x.g.answer;
        }
      });
      bad.forEach(function(x){
        state.tries.push({at:new Date().toISOString(),id:it.id,ok:false,reason:"第"+x.g.n+"空 写了 "+x.typed});
        var inp=qen.querySelector('input[data-gid="'+x.key+'"]');
        if(inp){
          var wrap=inp.closest(".blank")||inp.parentNode;
          wrap.classList.add("bad");
          inp.value="";
          inp.placeholder="再写";
        }
      });
      var still=units.filter(function(g){return !gapLocked(gapKey(it,g));});
      var allOk=!still.length;
      if(allOk){
        units.forEach(function(g){setGapLock(gapKey(it,g),false);});
        srsMark(srsInit(it.id,state),true);
        state.need[it.id]=false;delete state.wrong[it.id];
      }else{
        srsMark(srsInit(it.id,state),false);
        state.need[it.id]=true;state.wrong[it.id]=true;
        choices.dataset.locked="";
      }
      result.hidden=false;
      if(allOk){
        result.innerHTML="<strong>全对，这篇过了。</strong><p>对的空已经留在下划线上。</p><p>下次到期会重新空出来再考一遍。</p>";
      }else{
        var bits=bad.map(function(x){return "<p>第 "+x.g.n+" 空写了 <b>"+x.typed+"</b>。"+(x.g.bad||"")+"</p>";}).join("");
        result.innerHTML="<strong>对了 "+good.length+" 空，还有 "+still.length+" 空。</strong>"+bits+"<p>第一次做对的空一直留在文里。这次对的下次绿色。空着的继续改。</p>";
      }
      save();
    }
    var btn=document.getElementById("checkGap");
    if(btn){
      if(left0) btn.onclick=submitPassage; else btn.disabled=true;
    }
    qen.addEventListener("keydown",function(e){if(e.key==="Enter")submitPassage();});
    var first=qen.querySelector(".gap-in"); if(first) first.focus();
    var retry=document.getElementById("retry");
    if(retry) retry.onclick=function(){
      practiceGaps(it).forEach(function(g){setGapLock(gapKey(it,g),false);});
      save({skipPush:true});
      openDetail(id,"quiz");
    };
  };
})();
