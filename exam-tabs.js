const BYQ_EXAM_KEY = "pet-review-byq-exam";
function byQExam() {
  const v = localStorage.getItem(BYQ_EXAM_KEY);
  return v === "PET" ? "PET" : "KET";
}
function setByQExam(e) {
  localStorage.setItem(BYQ_EXAM_KEY, e === "PET" ? "PET" : "KET");
}
function countExam(name) {
  return ITEMS.filter(function (it) { return examOf(it) === name; }).length;
}
function renderByQ() {
  const box = document.getElementById("byQ");
  if (!box) return;
  const exam = byQExam();
  const ketN = countExam("KET");
  const petN = countExam("PET");
  const map = {};
  ITEMS.forEach(function (it) {
    if (examOf(it) !== exam) return;
    (map[it.passage] = map[it.passage] || []).push(it);
  });
  const names = Object.keys(map);
  let html = '<div class="card"><p>按<b>原题</b>归堆。先选 KET 或 PET。</p><div class="tabs" id="byQExamTabs">';
  html += '<button type="button" data-exam="KET" class="' + (exam === "KET" ? "active" : "") + '">KET · ' + ketN + "</button>";
  html += '<button type="button" data-exam="PET" class="' + (exam === "PET" ? "active" : "") + '">PET · ' + petN + "</button>";
  html += "</div></div>";
  if (!names.length) {
    html += '<div class="card"><p>' + exam + " 还没有原题。</p></div>";
  } else {
    html += names.map(function (name) {
      const list = map[name];
      return '<div class="card"><h3 style="margin:0 0 8px">' + name + '</h3><p class="sub">' + list.length + " 道</p></div>" + list.map(itemRow).join("");
    }).join("");
  }
  box.innerHTML = html;
  box.querySelectorAll("#byQExamTabs button").forEach(function (b) {
    b.onclick = function () { setByQExam(b.dataset.exam); renderByQ(); };
  });
  box.querySelectorAll(".item").forEach(function (el) {
    el.addEventListener("click", function () {
      const it = ITEMS.find(function (x) { return x.id === el.dataset.id; });
      const same = (map[it.passage] || [it]);
      setNav(same);
      openDetail(el.dataset.id, "quiz");
    });
  });
}
function renderByExam() {
  const box = document.getElementById("byExam");
  if (!box) return;
  const map = itemsByExam();
  const ketN = (map.KET || []).length;
  const petN = (map.PET || []).length;
  box.innerHTML = '<div class="card"><p>按<b>考试</b>归堆。KET <b>' + ketN + "</b> 道，PET <b>" + petN + "</b> 道。</p></div>" +
    ["KET", "PET"].map(function (name) {
      const list = map[name] || [];
      if (!list.length) return '<div class="card"><h3 style="margin:0 0 8px">' + name + '</h3><p class="sub">还没有题。</p></div>';
      return '<div class="card"><h3 style="margin:0 0 8px">' + name + '</h3><p class="sub">' + list.length + " 道</p></div>" + list.map(itemRow).join("");
    }).join("");
  box.querySelectorAll(".item").forEach(function (el) {
    el.addEventListener("click", function () {
      const it = ITEMS.find(function (x) { return x.id === el.dataset.id; });
      setNav((itemsByExam()[it.exam]) || [it]);
      openDetail(el.dataset.id, "quiz");
    });
  });
}
renderByQ();
renderByExam();
