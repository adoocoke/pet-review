const GROUP = {
  "p135-q23": { passage: "Central Park p.135", tag: "固定搭配", point: "be popular with" },
  "mail1-q27": { passage: "Jerry 邮件", tag: "介词用法", point: "presents from" },
  "mail1-q28": { passage: "Jerry 邮件", tag: "语法错误", point: "than ≠ then" },
  "mail1-q29": { passage: "Jerry 邮件", tag: "介词用法", point: "on the top" },
  "p141-q22": { passage: "Holidays p.141", tag: "语法错误", point: "cost / spend" },
  "p141-q23": { passage: "Holidays p.141", tag: "语法错误", point: "much + 比较级" },
  "p141-q24": { passage: "Holidays p.141", tag: "生词不会用", point: "countries" },
  "hosp-q25": { passage: "住院邮件 Fiona / Marry", tag: "固定搭配", point: "fall down the stairs" },
  "hosp-q27": { passage: "住院邮件 Fiona / Marry", tag: "语法错误", point: "because / so" },
  "hosp-q30": { passage: "住院邮件 Fiona / Marry", tag: "语法错误", point: "cut herself" },
  "dol-q19": { passage: "Dolphin Hero p.147", tag: "词组", point: "push back out" },
  "dol-q20": { passage: "Dolphin Hero p.147", tag: "生词不会用", point: "getting tired" },
  "dol-q22": { passage: "Dolphin Hero p.147", tag: "词组", point: "come straight to" },
  "job-q25": { passage: "兼职邮件 Jessie", tag: "固定搭配", point: "work as" },
  "job-q26": { passage: "兼职邮件 Jessie", tag: "介词用法", point: "from A to B" },
  "films-q20": { passage: "The First Films p.153", tag: "生词不会用", point: "a comedy" },
  "films-q21": { passage: "The First Films p.153", tag: "生词不会用", point: "got wet" },
  "tennis-q4": { passage: "Tennis p.88", tag: "固定搭配", point: "enter sb for" },
  "tennis-q5": { passage: "Tennis p.88", tag: "词组", point: "like you" },
  "tennis-q6": { passage: "Tennis p.88", tag: "固定搭配", point: "one of the" },
  "sharks-q1": { passage: "Sharks and whales p.88", tag: "生词不会用", point: "metres long" },
  "sharks-q5": { passage: "Sharks and whales p.88", tag: "生词不会用", point: "not too deep" },
  "hotter-q2": { passage: "The world is getting hotter p.89", tag: "固定搭配", point: "stop ... from" },
  "hotter-q5": { passage: "The world is getting hotter p.89", tag: "生词不会用", point: "cold areas" },
  "hotter-q6": { passage: "The world is getting hotter p.89", tag: "生词不会用", point: "have a problem" },
  "camels-q5": { passage: "Bactrian camels p.90", tag: "生词不会用", point: "desert ≠ dessert" },
  "figures-q3": { passage: "Collecting action figures p.90", tag: "生词不会用", point: "these things" },
  "gwen-q5": { passage: "Gwen Stefani p.91", tag: "生词不会用", point: "draw pictures" },
  "gwen-q6": { passage: "Gwen Stefani p.91", tag: "生词不会用", point: "favourite" },
  "uke-q1": { passage: "The ukulele p.92", tag: "生词不会用", point: "make a sound" },
  "uke-q4": { passage: "The ukulele p.92", tag: "生词不会用", point: "movie stars" },
  "uke-q5": { passage: "The ukulele p.92", tag: "语法错误", point: "surprising / surprised" },
  "uke-q6": { passage: "The ukulele p.92", tag: "词组", point: "really quickly" }
};
const TAG_ORDER = ["介词用法", "语法错误", "固定搭配", "词组", "生词不会用"];
ITEMS.forEach(function (it) {
  var g = GROUP[it.id] || {};
  it.passage = g.passage || it.meta;
  it.tag = g.tag || "语法错误";
  it.point = g.point || "";
});
function itemsByPassage() {
  var map = {};
  ITEMS.forEach(function (it) { (map[it.passage] = map[it.passage] || []).push(it); });
  return map;
}
function itemsByTag() {
  var map = {};
  TAG_ORDER.forEach(function (t) { map[t] = []; });
  ITEMS.forEach(function (it) { (map[it.tag] = map[it.tag] || []).push(it); });
  return map;
}
