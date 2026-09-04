const SRS_STEPS = [
  { hours: 0.33, label: "20分钟后" },
  { hours: 1, label: "1小时后" },
  { hours: 8, label: "今天晚些" },
  { hours: 24, label: "明天" },
  { hours: 48, label: "2天后" },
  { hours: 96, label: "4天后" },
  { hours: 168, label: "7天后" },
  { hours: 360, label: "15天后" },
  { hours: 744, label: "31天后" }
];
function srsInit(id, state) {
  if (!state.srs) state.srs = {};
  if (!state.srs[id]) state.srs[id] = { step: 0, next: Date.now(), streak: 0 };
  return state.srs[id];
}
function srsDue(rec) { return !rec || rec.next <= Date.now(); }
function srsMark(rec, ok) {
  const now = Date.now();
  if (ok) {
    rec.streak = (rec.streak || 0) + 1;
    rec.step = Math.min((rec.step || 0) + 1, SRS_STEPS.length - 1);
  } else {
    rec.streak = 0;
    rec.step = 0;
  }
  rec.next = now + SRS_STEPS[rec.step].hours * 3600 * 1000;
  rec.last = now;
  return rec;
}
function srsWhen(rec) {
  if (!rec) return "现在就练";
  const diff = rec.next - Date.now();
  if (diff <= 0) return "现在到期";
  const h = Math.round(diff / 3600000);
  if (h < 1) return "不到1小时";
  if (h < 24) return h + "小时后";
  return Math.round(h / 24) + "天后";
}
