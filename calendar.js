const KEY = "pet-review-v4";
const WEEK = ["一", "二", "三", "四", "五", "六", "日"];
const RAW = "https://raw.githubusercontent.com/adoocoke/pet-review/main/progress.json";

let tries = [];
let days = {};
let view = new Date();
view.setDate(1);
let picked = dayKey(new Date());

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function dayKey(d) {
  const x = d instanceof Date ? d : new Date(d);
  if (isNaN(+x)) return "";
  return x.getFullYear() + "-" + pad(x.getMonth() + 1) + "-" + pad(x.getDate());
}
function parseLocal(key) {
  const p = key.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}
function loadLocalTries() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null") || {};
    return s.tries || [];
  } catch (e) {
    return [];
  }
}
function mergeTries(a, b) {
  const seen = new Set();
  const out = [];
  [].concat(a || [], b || []).forEach(function (t) {
    const k = (t.at || "") + "|" + t.id + "|" + String(t.ok);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(t);
  });
  return out;
}
function buildDays(list) {
  const map = {};
  list.forEach(function (t) {
    const k = dayKey(t.at);
    if (!k) return;
    const rec = map[k] || (map[k] = { tried: 0, right: 0, ids: {} });
    rec.tried += 1;
    if (t.ok) rec.right += 1;
    if (t.id) rec.ids[t.id] = true;
  });
  return map;
}
function uniqueCount(rec) {
  return rec ? Object.keys(rec.ids).length : 0;
}
function rate(rec) {
  if (!rec || !rec.tried) return 0;
  return Math.round((rec.right / rec.tried) * 100);
}
function sortedDayKeys() {
  return Object.keys(days).sort();
}
function streakEndingToday() {
  const today = dayKey(new Date());
  let cur = today;
  if (!days[cur]) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    cur = dayKey(y);
  }
  let n = 0;
  while (days[cur]) {
    n += 1;
    const d = parseLocal(cur);
    d.setDate(d.getDate() - 1);
    cur = dayKey(d);
  }
  return n;
}
function setStatus(msg) {
  const el = document.getElementById("calStatus");
  if (el) el.textContent = msg;
}

function refresh() {
  days = buildDays(tries);
  renderMonth();
  renderDetail(picked);
  renderSummary();
}

function renderSummary() {
  const keys = sortedDayKeys();
  const today = dayKey(new Date());
  const rec = days[today];
  const monthKey = view.getFullYear() + "-" + pad(view.getMonth() + 1);
  let monthDays = 0, monthTried = 0, monthRight = 0;
  keys.forEach(function (k) {
    if (k.slice(0, 7) !== monthKey) return;
    monthDays += 1;
    monthTried += days[k].tried;
    monthRight += days[k].right;
  });
  document.getElementById("sumDays").textContent = keys.length;
  document.getElementById("sumStreak").textContent = streakEndingToday();
  document.getElementById("sumToday").textContent = rec ? rec.tried : 0;
  document.getElementById("sumMonth").textContent = monthDays;
  document.getElementById("sumMonthRate").textContent = monthTried ? Math.round((monthRight / monthTried) * 100) + "%" : "—";
}

function renderMonth() {
  const y = view.getFullYear();
  const m = view.getMonth();
  document.getElementById("calTitle").textContent = y + " 年 " + (m + 1) + " 月";
  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;
  const lastDate = new Date(y, m + 1, 0).getDate();
  const today = dayKey(new Date());
  let html = WEEK.map(function (w) { return '<div class="dow">' + w + "</div>"; }).join("");
  for (let i = 0; i < start; i++) html += '<div class="cell empty"></div>';
  for (let d = 1; d <= lastDate; d++) {
    const key = y + "-" + pad(m + 1) + "-" + pad(d);
    const rec = days[key];
    const cls = ["cell"];
    if (rec) cls.push("done");
    if (key === today) cls.push("today");
    if (key === picked) cls.push("picked");
    const mark = rec ? '<span class="dot"></span><span class="n">' + rec.tried + "</span>" : "";
    html += '<button type="button" class="' + cls.join(" ") + '" data-day="' + key + '"><span class="num">' + d + "</span>" + mark + "</button>";
  }
  document.getElementById("calGrid").innerHTML = html;
  document.querySelectorAll("#calGrid .cell[data-day]").forEach(function (el) {
    el.onclick = function () {
      picked = el.dataset.day;
      renderMonth();
      renderDetail(picked);
    };
  });
}

function renderDetail(key) {
  const box = document.getElementById("calDetail");
  const rec = days[key];
  const label = key.replace(/-/, "年").replace(/-/, "月") + "日";
  if (!rec) {
    box.innerHTML = "<h3>" + label + "</h3><p class=\"sub\">这天没有做题，不会打卡。</p>";
    return;
  }
  box.innerHTML =
    "<h3>" + label + " 已打卡</h3>" +
    '<div class="stats">' +
    '<div class="stat"><b>' + rec.tried + "</b><span>做题次数</span></div>" +
    '<div class="stat"><b>' + rec.right + "</b><span>做对</span></div>" +
    '<div class="stat"><b>' + rate(rec) + "%</b><span>正确率</span></div>" +
    "</div>" +
    '<p class="sub">不同题目 ' + uniqueCount(rec) + " 道。做题当时就记上，不用另点打卡。</p>";
}

async function pullCloud() {
  setStatus("正在拉仓库里的练习记录…");
  try {
    const res = await fetch(RAW + "?t=" + Date.now());
    if (!res.ok) throw new Error(res.status);
    const remote = await res.json();
    tries = mergeTries(loadLocalTries(), remote.tries || []);
    setStatus("已合并本机和仓库，共 " + tries.length + " 次练习。");
    refresh();
  } catch (e) {
    tries = loadLocalTries();
    setStatus("仓库沠拉到，只用本机记录。");
    refresh();
  }
}

document.getElementById("prevM").onclick = function () {
  view.setMonth(view.getMonth() - 1);
  renderMonth();
  renderSummary();
};
document.getElementById("nextM").onclick = function () {
  view.setMonth(view.getMonth() + 1);
  renderMonth();
  renderSummary();
};
document.getElementById("thisM").onclick = function () {
  view = new Date();
  view.setDate(1);
  picked = dayKey(new Date());
  refresh();
};

tries = loadLocalTries();
refresh();
pullCloud();
