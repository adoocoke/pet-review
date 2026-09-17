function cardLetter(c) {
  const en = String(c[1] || "").replace(/^[^A-Za-z]+/, "");
  const ch = (en.charAt(0) || "#").toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}
function cardAttr(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function jumpAz(letter) {
  const el = document.getElementById("card-" + letter);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const all = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const i = all.indexOf(letter);
  for (let k = i + 1; k < all.length; k++) {
    const n = document.getElementById("card-" + all[k]);
    if (n) { n.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  }
}
function bindAzRail(rail) {
  if (!rail) return;
  function fromPoint(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (hit && hit.dataset && hit.dataset.az) return hit.dataset.az;
    return "";
  }
  rail.querySelectorAll("b[data-az]").forEach(function (b) {
    b.onclick = function (e) {
      e.preventDefault();
      jumpAz(b.dataset.az);
    };
  });
  rail.addEventListener("touchstart", function (e) {
    const t = e.changedTouches[0];
    const L = fromPoint(t.clientX, t.clientY);
    if (L) jumpAz(L);
  }, { passive: true });
  rail.addEventListener("touchmove", function (e) {
    const t = e.changedTouches[0];
    const L = fromPoint(t.clientX, t.clientY);
    if (L) jumpAz(L);
  }, { passive: true });
}
if (typeof cardFilter === "undefined") var cardFilter = "PET";
function renderCards() {
  const box = document.getElementById("cards");
  if (!box || typeof CARDS === "undefined") return;
  const list = CARDS.filter(function (c) {
    if (cardFilter === "PET") return c.exam === "PET";
    if (cardFilter === "KET") return c.exam !== "PET";
    return true;
  }).slice().sort(function (a, b) {
    return String(a[1] || "").localeCompare(String(b[1] || ""), "en", { sensitivity: "base" });
  });
  const nPet = CARDS.filter(function (c) { return c.exam === "PET"; }).length;
  const nKet = CARDS.filter(function (c) { return c.exam !== "PET"; }).length;
  const have = {};
  list.forEach(function (c) { have[cardLetter(c)] = true; });
  const letters = ("#ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
  let html = '<nav class="az-rail" id="azRail">';
  letters.forEach(function (L) {
    html += '<b data-az="' + L + '" class="' + (have[L] ? "" : "off") + '">' + L + "</b>";
  });
  html += "</nav><div class=\"cards-list\">";
  html += '<div class="card"><p>红笔生词在「PET 生词」。先看中文，点卡片看英文。</p><div class="row">';
  html += '<button class="ghost' + (cardFilter === "PET" ? " primary" : "") + '" data-cf="PET">PET 生词 ' + nPet + "</button>";
  html += '<button class="ghost' + (cardFilter === "KET" ? " primary" : "") + '" data-cf="KET">KET ' + nKet + "</button>";
  html += '<button class="ghost' + (cardFilter === "ALL" ? " primary" : "") + '" data-cf="ALL">全部 ' + CARDS.length + "</button>";
  html += '<button class="primary" id="goDrill">去练错词</button>';
  html += "</div><p class=\"sub\">这一屏 " + list.length + " 张。右边字母点一下，或顺着滑。</p></div>";
  let last = "";
  list.forEach(function (c) {
    const L = cardLetter(c);
    if (L !== last) {
      html += '<div class="card-letter" id="card-' + L + '">' + L + "</div>";
      last = L;
    }
    html += '<div class="card flip" data-front="' + cardAttr(c[0]) + '" data-back="' + cardAttr(c[1]) + '" data-hint="' + cardAttr(c[2]) + '"></div>';
  });
  html += "</div>";
  box.innerHTML = html;
  box.querySelectorAll("[data-cf]").forEach(function (b) {
    b.onclick = function () { cardFilter = b.dataset.cf; renderCards(); };
  });
  const go = document.getElementById("goDrill");
  if (go) go.onclick = function () {
    const tab = document.querySelector('#mainTabs button[data-tab="drill"]');
    if (tab) tab.click();
  };
  box.querySelectorAll(".flip").forEach(function (card) {
    card.innerHTML = '<div class="front"><div class="cn">' + card.dataset.front + '</div><div class="hint">点击看英文</div></div><div class="back" hidden><div class="en">' + card.dataset.back + '</div><div class="hint">' + card.dataset.hint + "</div></div>";
    card.onclick = function () {
      const f = card.querySelector(".front"), b = card.querySelector(".back"), show = b.hidden;
      f.hidden = show; b.hidden = !show;
    };
  });
  bindAzRail(document.getElementById("azRail"));
}
renderCards();
