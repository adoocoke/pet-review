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
function examTabBar(exam, ketN, petN, id) {
  return '<div class="tabs" id="' + id + '">' +
    '<button type="button" data-exam="KET" class="' + (exam === "KET" ? "active" : "") + '">KET · ' + ketN + "</button>" +
    '<button type="button" data-exam="PET" class="' + (exam === "PET" ? "active" : "") + '">PET · ' + petN + "</button>" +
    "</div>";
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
  let html = '<div class="card"><p>按<b>原题</b>归堆。先选 KET 或 PET。语法填空点进去是整篇。</p>' + examTabBar(exam, ketN, petN, "byQExamTabs") + "</div>";
  if (!names.length) {
    html += '<div class="card"><p>' + exam + " 还没有原题。</p></div>";
  } else {
    html += names.map(function (name) {
      const list = map[name];
      const head = list[0];
      if (typeof isGapItem === "function" && isGapItem(head)) {
        const rows = typeof listUnits === "function" ? listUnits(list) : list;
        return rows.map(itemRow).join("");
      }
      return '<div class="card"><h3 style="margin:0 0 8px">' + name + '</h3><p class="sub">' + list.length + " 道</p></div>" + list.map(itemRow).join("");
    }).join("");
  }
  box.innerHTML = html;
  box.querySelectorAll("#byQExamTabs button").forEach(function (b) {
    b.onclick = function () { setByQExam(b.dataset.exam); renderByQ(); renderByExam(); };
  });
  box.querySelectorAll(".item").forEach(function (el) {
    el.addEventListener("click", function () {
      const it = ITEMS.find(function (x) { return x.id === el.dataset.id; });
      const pack = (typeof isGapItem === "function" && isGapItem(it) && typeof gapGroup === "function") ? gapGroup(it) : (map[it.passage] || [it]);
      setNav(pack);
      openDetail(el.dataset.id, "quiz");
    });
  });
}
function renderByExam() {
  const box = document.getElementById("byExam");
  if (!box) return;
  const exam = byQExam();
  const ketN = countExam("KET");
  const petN = countExam("PET");
  const raw = ITEMS.filter(function (it) { return examOf(it) === exam; });
  const list = typeof listUnits === "function" ? listUnits(raw) : raw;
  let html = '<div class="card"><p>按<b>考试</b>看题。先选 KET 或 PET。</p>' + examTabBar(exam, ketN, petN, "byExamTabs") + "</div>";
  if (!list.length) html += '<div class="card"><p>' + exam + " 还没有题。</p></div>";
  else html += list.map(itemRow).join("");
  box.innerHTML = html;
  box.querySelectorAll("#byExamTabs button").forEach(function (b) {
    b.onclick = function () { setByQExam(b.dataset.exam); renderByExam(); renderByQ(); };
  });
  box.querySelectorAll(".item").forEach(function (el) {
    el.addEventListener("click", function () {
      const it = ITEMS.find(function (x) { return x.id === el.dataset.id; });
      const pack = (typeof isGapItem === "function" && isGapItem(it) && typeof gapGroup === "function") ? gapGroup(it) : raw;
      setNav(pack);
      openDetail(el.dataset.id, "quiz");
    });
  });
}
renderByQ();
renderByExam();
