function attachPosRail(box) {
  if (!box) return;
  const old = box.querySelector(".pct-rail");
  if (old) old.remove();
  const items = box.querySelectorAll(".item");
  if (items.length <= 10) return;
  const marks = [
    { label: "顶", pct: 0 },
    { label: "25", pct: 25 },
    { label: "50", pct: 50 },
    { label: "75", pct: 75 },
    { label: "底", pct: 100 }
  ];
  const rail = document.createElement("nav");
  rail.className = "pct-rail";
  marks.forEach(function (m) {
    const b = document.createElement("b");
    b.textContent = m.label;
    b.dataset.pct = String(m.pct);
    rail.appendChild(b);
  });
  box.appendChild(rail);
  function jump(pct) {
    const n = items.length;
    const i = Math.min(n - 1, Math.max(0, Math.round((Number(pct) / 100) * (n - 1))));
    items[i].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function fromPoint(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (hit && hit.dataset && hit.dataset.pct != null) return hit.dataset.pct;
    return "";
  }
  rail.querySelectorAll("b").forEach(function (b) {
    b.onclick = function (e) {
      e.preventDefault();
      jump(b.dataset.pct);
    };
  });
  rail.addEventListener("touchstart", function (e) {
    const t = e.changedTouches[0];
    const p = fromPoint(t.clientX, t.clientY);
    if (p !== "") jump(p);
  }, { passive: true });
  rail.addEventListener("touchmove", function (e) {
    const t = e.changedTouches[0];
    const p = fromPoint(t.clientX, t.clientY);
    if (p !== "") jump(p);
  }, { passive: true });
}
function wrapWithRail(name, panelId) {
  const orig = window[name];
  if (typeof orig !== "function") return;
  window[name] = function () {
    orig.apply(this, arguments);
    attachPosRail(document.getElementById(panelId));
  };
}
wrapWithRail("renderList", "list");
wrapWithRail("renderByQ", "byQ");
wrapWithRail("renderByExam", "byExam");
wrapWithRail("renderRedo", "redo");
wrapWithRail("renderLater", "later");
wrapWithRail("renderLearned", "learned");
attachPosRail(document.getElementById("list"));
attachPosRail(document.getElementById("byQ"));
attachPosRail(document.getElementById("byExam"));
attachPosRail(document.getElementById("redo"));
attachPosRail(document.getElementById("later"));
attachPosRail(document.getElementById("learned"));
