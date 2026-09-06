function reasonKeys(it) {
  const keys = (it.whyKeys || []).slice();
  if (it.fill) keys.push(String(it.fill));
  const opt = (it.options || []).find(function (o) { return o.key === it.answer; });
  if (opt) {
    const w = String(opt.text || "").replace(/^[A-D]\s+/i, "").trim();
    if (w) keys.push(w);
  }
  const raw = ((it.ok || "") + " " + (it.bad || "") + " " + String(it.note || "").replace(/<[^>]+>/g, " "));
  const add = raw.match(/[A-Za-z][A-Za-z'\-]{2,}/g) || [];
  add.forEach(function (w) { keys.push(w); });
  const col = raw.match(/[A-Za-z]+(?:\s+(?:with|than|from|of|to|in|on|at|for|after|before))/gi) || [];
  col.forEach(function (w) { keys.push(w); });
  if (it.tag) keys.push(it.tag);
  ["固定搭配", "介词", "比较级", "最高级", "冠词", "过去式", "词组"].forEach(function (w) {
    if (raw.indexOf(w) >= 0) keys.push(w);
  });
  const seen = {};
  return keys.map(function (k) { return String(k).trim(); }).filter(function (k) {
    if (k.length < 2) return false;
    const id = k.toLowerCase();
    if (seen[id]) return false;
    seen[id] = true;
    return true;
  });
}

function checkReason(text, it) {
  const t = String(text || "").trim();
  if (t.length < 2) return { ok: false, hits: [], msg: "没听清。再说一遍，或打几个字。" };
  const low = t.toLowerCase();
  const keys = reasonKeys(it);
  const hits = keys.filter(function (k) { return low.indexOf(k.toLowerCase()) >= 0; });
  const fill = String(it.fill || "").toLowerCase();
  const hasFill = fill && low.indexOf(fill) >= 0;
  const enHits = hits.filter(function (k) { return /[a-z]/i.test(k) && k.length >= 3; });
  const ok = !!(hasFill || enHits.length >= 1 || hits.length >= 2);
  return {
    ok: ok,
    hits: hits,
    msg: ok
      ? ("理由对上了：" + hits.slice(0, 5).join("、"))
      : "理由沠对上这题的关键词（正确答案那个词，或搭配）。进二次错题本。"
  };
}

function startListen(ta, btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    btn.textContent = "这台不能语音，请打字";
    ta.focus();
    return;
  }
  if (btn._rec) {
    try { btn._rec.stop(); } catch (e) {}
    btn._rec = null;
    btn.textContent = "语音输入";
    return;
  }
  const rec = new SR();
  rec.lang = "zh-CN";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = function (e) {
    let s = "";
    for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
    ta.value = s;
  };
  rec.onend = function () {
    btn._rec = null;
    btn.textContent = "语音输入";
  };
  rec.onerror = function () {
    btn._rec = null;
    btn.textContent = "语音失败，改打字";
    ta.focus();
  };
  btn._rec = rec;
  rec.start();
  btn.textContent = "正在听…再点停止";
}
