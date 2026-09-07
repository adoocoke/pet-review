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
function renderCards() {
  const box = document.getElementById("cards");
  if (!box) return;
  const sorted = CARDS.slice().sort(function (a, b) {
    return String(a[1] || "").localeCompare(String(b[1] || ""), "en", { sensitivity: "base" });
  });
  const have = {};
  sorted.forEach(function (c) { have[cardLetter(c)] = true; });
  const letters = ("#ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
  let html = '<nav class="az-rail" id="azRail">';
  letters.forEach(function (L) {
    html += '<b data-az="' + L + '" class="' + (have[L] ? "" : "off") + '">' + L + "</b>";
  });
  html += '</nav><div class="cards-list">';
  html += '<div class="card"><p>共 <b>' + sorted.length + '</b> 张。右边字母点一下，或顺着滑。</p></div>';
  let last = "";
  sorted.forEach(function (c) {
    const L = cardLetter(c);
    if (L !== last) {
      html += '<div class="card-letter" id="card-' + L + '">' + L + "</div>";
      last = L;
    }
    html += '<div class="card flip" data-front="' + cardAttr(c[0]) + '" data-back="' + cardAttr(c[1]) + '" data-hint="' + cardAttr(c[2]) + '"></div>';
  });
  html += "</div>";
  box.innerHTML = html;
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
