const GH_OWNER = "adoocoke";
const GH_REPO = "pet-review";
const GH_FILE = "progress.json";
const TOKEN_KEY = "pet-review-gh-token";
const API = "https://api.github.com/repos/" + GH_OWNER + "/" + GH_REPO + "/contents/" + GH_FILE;

let progressSha = "";
let pushTimer = 0;
let syncStatus = "还没同步";

function getToken() {
  return (localStorage.getItem(TOKEN_KEY) || "").trim();
}
function setToken(t) {
  const v = (t || "").trim();
  if (v) localStorage.setItem(TOKEN_KEY, v);
  else localStorage.removeItem(TOKEN_KEY);
}
function setSyncStatus(msg) {
  syncStatus = msg;
  const el = document.getElementById("syncStatus");
  if (el) el.textContent = msg;
  const home = document.getElementById("homeSync");
  if (home) home.textContent = msg;
}
function packProgress() {
  return {
    v: 4,
    updatedAt: Date.now(),
    srs: state.srs || {},
    need: state.need || {},
    wrong: state.wrong || {},
    tries: state.tries || []
  };
}
function applyProgress(p) {
  if (!p) return;
  state.srs = p.srs || {};
  state.need = p.need || {};
  state.wrong = p.wrong || {};
  state.tries = p.tries || [];
  ITEMS.forEach(it => {
    if (state.need[it.id] === undefined) state.need[it.id] = true;
    srsInit(it.id, state);
  });
}
function recLived(r) {
  if (!r) return false;
  return !!(r.last || r.streak || r.step);
}
function recScore(r) {
  if (!r) return -1;
  return (r.last || 0) + (r.streak || 0) * 1000 + (r.step || 0) * 100;
}
function mergeProgress(a, b) {
  const out = { v: 4, updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0), srs: {}, need: {}, wrong: {}, tries: [] };
  const ids = new Set([].concat(
    Object.keys(a.srs || {}), Object.keys(b.srs || {}),
    Object.keys(a.need || {}), Object.keys(b.need || {}),
    Object.keys(a.wrong || {}), Object.keys(b.wrong || {})
  ));
  ids.forEach(id => {
    const x = (a.srs || {})[id];
    const y = (b.srs || {})[id];
    let pick;
    if (!x) pick = y;
    else if (!y) pick = x;
    else if (recLived(x) && !recLived(y)) pick = x;
    else if (!recLived(x) && recLived(y)) pick = y;
    else pick = recScore(x) >= recScore(y) ? x : y;
    if (pick) out.srs[id] = pick;
    const fromA = pick === x;
    const needA = (a.need || {})[id];
    const needB = (b.need || {})[id];
    out.need[id] = fromA
      ? (needA !== undefined ? needA : needB)
      : (needB !== undefined ? needB : needA);
    const wrongA = !!(a.wrong || {})[id];
    const wrongB = !!(b.wrong || {})[id];
    out.wrong[id] = fromA ? wrongA : wrongB;
    if (!out.wrong[id]) delete out.wrong[id];
  });
  const seen = new Set();
  [].concat(a.tries || [], b.tries || []).forEach(t => {
    const k = (t.at || "") + "|" + t.id + "|" + String(t.ok);
    if (seen.has(k)) return;
    seen.add(k);
    out.tries.push(t);
  });
  out.tries.sort((x, y) => String(x.at).localeCompare(String(y.at)));
  return out;
}
function b64encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function b64decode(str) {
  return decodeURIComponent(escape(atob(str.replace(/\s/g, ""))));
}
function authHeaders() {
  const t = getToken();
  const h = { Accept: "application/vnd.github+json" };
  if (t) h.Authorization = "Bearer " + t;
  return h;
}
async function fetchRemote() {
  const res = await fetch(API + "?ref=main", { headers: authHeaders() });
  if (res.status === 404) return { missing: true };
  if (!res.ok) throw new Error("读云端 " + res.status);
  const data = await res.json();
  progressSha = data.sha || "";
  const raw = b64decode(data.content || "");
  return JSON.parse(raw);
}
async function pullRemote() {
  setSyncStatus("正在从仓库拉进度…");
  try {
    const remote = await fetchRemote();
    if (remote.missing) {
      setSyncStatus("仓库还沠有 progress.json，贴 token 后会写上去");
      return;
    }
    const merged = mergeProgress(packProgress(), remote);
    applyProgress(merged);
    save({ skipPush: true });
    const n = (state.tries || []).length;
    setSyncStatus("已合并进度，共练过 " + n + " 次 · " + new Date().toLocaleString("zh-CN", { hour12: false }));
  } catch (e) {
    setSyncStatus("拉取失败：" + e.message);
  }
}
async function pushRemote(attempt) {
  attempt = attempt || 0;
  if (!getToken()) {
    setSyncStatus("本机进度已记住；要同步到 iPad 请先贴 token 再点「现在写」");
    return;
  }
  setSyncStatus("正在写回仓库…");
  try {
    let remote = null;
    try { remote = await fetchRemote(); } catch (e) { remote = null; }
    if (remote && !remote.missing) {
      const merged = mergeProgress(packProgress(), remote);
      applyProgress(merged);
      localStorage.setItem(KEY, JSON.stringify(state));
    }
    const body = {
      message: "progress: sync",
      content: b64encode(JSON.stringify(packProgress(), null, 2) + "\n"),
      branch: "main"
    };
    if (progressSha) body.sha = progressSha;
    const res = await fetch(API, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, authHeaders()),
      body: JSON.stringify(body)
    });
    if ((res.status === 409 || res.status === 422) && attempt < 2) {
      progressSha = "";
      return pushRemote(attempt + 1);
    }
    if (res.status === 401 || res.status === 403) {
      setSyncStatus("token 无效或沠有写权限，请重新贴");
      return;
    }
    if (!res.ok) throw new Error("写入 " + res.status);
    const data = await res.json();
    progressSha = (data.content && data.content.sha) || progressSha;
    const n = (state.tries || []).length;
    setSyncStatus("已写回仓库，共练过 " + n + " 次 · " + new Date().toLocaleString("zh-CN", { hour12: false }));
    renderList(); renderRedo(); renderLater(); renderLearned(); renderHistory();
  } catch (e) {
    setSyncStatus("写入失败：" + e.message);
  }
}
function schedulePush() {
  if (!getToken()) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(function () { pushRemote(0); }, 600);
}
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden" && getToken()) pushRemote(0);
});
window.addEventListener("pagehide", function () {
  if (getToken()) pushRemote(0);
});
