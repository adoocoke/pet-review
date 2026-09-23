(function () {
  const DICTATION = {
    spend: 1, activity: 1, experience: 1, create: 1, language: 1,
    suitable: 1, competition: 1, skill: 1, special: 1, actually: 1,
    available: 1, problem: 1, design: 1, allow: 1, explain: 1,
    produce: 1, discover: 1, develop: 1,
    professional: 1, perfect: 1, expect: 1, theatre: 1, interest: 1,
    business: 1, seem: 1, site: 1, suggest: 1, expert: 1, research: 1
  };
  let poolKind = "dictation";
  let queue = [];
  let idx = 0;
  let right = 0;
  let wrong = 0;
  let judged = false;

  function isDictation(c) {
    return c.src === "dictation" || !!DICTATION[c[1]];
  }
  function petCards() {
    return (typeof CARDS === "undefined" ? [] : CARDS).filter(function (c) {
      return c.exam === "PET";
    });
  }
  function pool() {
    const all = petCards();
    if (poolKind === "pet") return all.slice();
    return all.filter(isDictation);
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[.,!?;:()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function accept(answer, target) {
    const n = norm(answer);
    if (!n) return false;
    const raw = String(target || "");
    const parts = raw.split("/").map(function (p) { return norm(p); });
    if (parts.indexOf(n) !== -1) return true;
    if (norm(raw) === n) return true;
    return false;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function startRound() {
    queue = shuffle(pool());
    idx = 0;
    right = 0;
    wrong = 0;
    judged = false;
    renderDrill();
  }
  function current() {
    return queue[idx] || null;
  }
  function renderDrill() {
    const box = document.getElementById("drill");
    if (!box) return;
    const nDict = petCards().filter(isDictation).length;
    const nPet = petCards().length;
    const c = current();
    let html = "";
    html += '<div class="card">';
    html += "<p>只练错词。看中文，写出英文。对了进下一张；错了先看答案，再下一张。</p>";
    html += '<div class="row">';
    html += '<button class="ghost' + (poolKind === "dictation" ? " primary" : "") + '" data-dk="dictation">默写错词 ' + nDict + "</button>";
    html += '<button class="ghost' + (poolKind === "pet" ? " primary" : "") + '" data-dk="pet">全部 PET 生词 ' + nPet + "</button>";
    html += '<button class="ghost" id="drillShuffle">打乱再来一轮</button>';
    html += "</div></div>";
    if (!queue.length) {
      html += '<div class="card"><p>这一组还没有词。</p></div>';
      box.innerHTML = html;
      bindChrome();
      return;
    }
    if (!c) {
      html += '<div class="card">';
      html += "<p>这一轮练完了。</p>";
      html += '<p class="sub">对 <b>' + right + "</b> · 错 <b>" + wrong + "</b> · 共 " + queue.length + "</p>";
      html += '<div class="row"><button class="primary" id="drillAgain">再练一轮</button></div>';
      html += "</div>";
      box.innerHTML = html;
      bindChrome();
      const again = document.getElementById("drillAgain");
      if (again) again.onclick = startRound;
      return;
    }
    html += '<div class="card">';
    html += '<p class="sub">第 ' + (idx + 1) + " / " + queue.length + " · 对 " + right + " · 错 " + wrong + "</p>";
    html += '<div class="q-en" style="font-size:28px;text-align:center;margin:18px 0 8px">' + esc(c[0]) + "</div>";
    html += '<p class="sub" style="text-align:center">写出英文单词或词组</p>';
    html += '<input class="field" id="drillIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="在这里打英文">';
    html += '<div id="drillResult" class="explain" hidden></div>';
    html += '<div class="row">';
    html += '<button class="primary" id="drillCheck">检查</button>';
    html += '<button class="ghost" id="drillPeek">看答案</button>';
    html += '<button class="ghost" id="drillNext" hidden>下一张</button>';
    html += "</div></div>";
    box.innerHTML = html;
    bindChrome();
    const input = document.getElementById("drillIn");
    const check = document.getElementById("drillCheck");
    const peek = document.getElementById("drillPeek");
    const next = document.getElementById("drillNext");
    if (input) {
      input.focus();
      input.onkeydown = function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (judged) goNext();
          else doCheck(false);
        }
      };
    }
    if (check) check.onclick = function () { doCheck(false); };
    if (peek) peek.onclick = function () { doCheck(true); };
    if (next) next.onclick = goNext;
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }
  function doCheck(peek) {
    const c = current();
    if (!c || judged) return;
    const input = document.getElementById("drillIn");
    const pane = document.getElementById("drillResult");
    const next = document.getElementById("drillNext");
    const check = document.getElementById("drillCheck");
    const ans = input ? input.value : "";
    const ok = !peek && accept(ans, c[1]);
    judged = true;
    if (ok) right += 1;
    else wrong += 1;
    if (pane) {
      pane.hidden = false;
      if (ok) {
        pane.style.background = "var(--soft-green)";
        pane.innerHTML = "<b>对了</b> · " + esc(c[1]) + '<div class="hint" style="margin-top:6px;color:var(--muted)">' + esc(c[2] || "") + "</div>";
      } else {
        pane.style.background = "var(--soft-red)";
        pane.innerHTML = (peek ? "<b>答案</b>" : "<b>再记一次</b>") + " · " + esc(c[1]) + '<div class="hint" style="margin-top:6px;color:var(--muted)">' + esc(c[2] || "") + "</div>";
      }
    }
    if (input) input.disabled = true;
    if (check) check.hidden = true;
    if (next) {
      next.hidden = false;
      next.className = "primary";
    }
  }
  function goNext() {
    idx += 1;
    judged = false;
    renderDrill();
  }
  function bindChrome() {
    document.querySelectorAll("#drill [data-dk]").forEach(function (b) {
      b.onclick = function () {
        poolKind = b.dataset.dk;
        startRound();
      };
    });
    const sh = document.getElementById("drillShuffle");
    if (sh) sh.onclick = startRound;
  }
  function boot() {
    startRound();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
