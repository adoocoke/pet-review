# pet-review

**当前版本 0.4.1**（2026-09-04）  
进度键：浏览器 `localStorage` → `pet-review-v4`（兼容读入旧的 `pet-review-v3`）

给备考剑桥 **KET（A2 Key）**、并衔接 **PET（B1 Preliminary）** 的孩子用的错题复习网页。  
先解决两件事：**学习历史**、**做过的纸质练习会忘**。家长帮拍照、记笔记；孩子打开网页再练。

以后会做成手机 App。现在是纯静态网页，不需要登录。

- 复习页（GitHub Pages）：https://adoocoke.github.io/pet-review/
- 备用（Vercel）：https://pet-review-adoocokes-projects.vercel.app
- 仓库：https://github.com/adoocoke/pet-review

## 现在能做什么

打开网页就能：

1. **今日复习**：到期的错题排在最上面，点进去再做一次。
2. **按题目**：同一篇原文里的错题归在一起（Central Park、Jerry 邮件、Holidays、住院邮件、Dolphin、兼职邮件）。
3. **按知识点**：介词用法 / 语法错误 / 固定搭配 / 词组 / 生词不会用。
4. **单词词组卡**：中文 ↔ 英文翻转，带例句。
5. **学习历史**：练习次数、做对次数、今日到期数；最近 40 条记录。
6. 每道题有三块：**再做一次**、**错因笔记**、**原题照片**。

换设备或清缓存会丢进度，题库本身在仓库里。

## 版本记录

每次往题库或复习能力里加东西，就升一格版本，并写在这里。  
小改文档 / 修链接用第三位（0.4.1）；加题、加功能用第二位（0.5.0）。

### 0.4.1 · 2026-09-04

- README 写上版本号，并按提交把每次加了什么记下来

### 0.4.0 · 2026-09-04（当前功能基线，进度键 `pet-review-v4`）

- 艾宾浩斯间隔：20 分钟 → 1 小时 → 今天晚些 → 明天 → 2 天 → 4 天 → 7 天 → 15 天 → 31 天
- 到期题排最前；答对进下一格，答错或点「还要复习」回到 20 分钟
- 错题两种归堆：按原题、按知识点（`group.js`）
- 原题照片先走 Google Drive，再加 Action 同步进仓库 `photos/`
- 网页改从 GitHub Pages 地址读照片（`photos-drive.js`）
- README 写清用法、题库和加题步骤

### 0.3.0 · 2026-09-04（进度键 `pet-review-v3`）

- 恢复「错因笔记」「原题照片」两个页签
- 每道错题补完整错因分析
- 入库 Holidays p.141（cost / much cheaper / countries）
- 入库住院邮件 Fiona / Marry（fall down / because / herself）
- 入库 Dolphin Hero p.147（push back out / getting tired / come straight to）
- 入库兼职邮件 Jessie（work as / from A to B）
- 词组卡扩到和这些点对应

### 0.2.0 · 2026-09-04

- 同一套库里登记华研《剑桥PET阅读》上册（刘霞，ISBN 9787121406171）
- 开通 GitHub Pages，复习页可公开打开
- 入库 KET Part 5 Jerry → Bill 邮件错题：27 from、28 than、29 on

### 0.1.0 · 2026-09-04

- 仓库落地，第一版复习页
- 教材：华研《剑桥KET阅读》上册（ISBN 9787121406034）
- 第一道错题：p.135 Central Park 第 23 题 `be popular with`
- `source.json` 记书目和入库摘要
- 学习历史只存在本机浏览器

## 复习间隔（艾宾浩斯）

答对进入下一格，答错或点「这题还要复习」回到第一格：

20 分钟 → 1 小时 → 今天晚些 → 明天 → 2 天 → 4 天 → 7 天 → 15 天 → 31 天

实现见 `srs.js`。

## 正在用的书

两本一起学，答案在各自下册。

| 书 | 级别 | ISBN |
| --- | --- | --- |
| 华研《剑桥KET阅读》上册（电子工业出版社） | A2 Key for Schools | 9787121406034 |
| 华研《剑桥PET阅读》上册（刘霞，150 篇） | B1 Preliminary for Schools | 9787121406171 |

典型输入：孩子在纸质页上圈选项，家长拍照。目前入库的是 KET Reading Part 4（三选一）和 Part 5（完型填空）。

## 已入库错题

15 道「错了或拿不准」的题（自 0.3.0 起就是这个规模）：

| 原题 | 题号 | 要记的点 | 起于 |
| --- | --- | --- | --- |
| Central Park p.135 | 23 | be popular with | 0.1.0 |
| Jerry → Bill 邮件 | 27 / 28 / 29 | presents from；bigger than（不是 then / of）；on the top | 0.2.0 |
| Holidays p.141 | 22 / 23 / 24 | 东西 cost / 人 spend；much + 比较级；other countries | 0.3.0 |
| 住院邮件 Fiona / Marry | 25 / 27 / 30 | fall down the stairs；because ≠ so；cut herself | 0.3.0 |
| Dolphin Hero p.147 | 19 / 20 / 22 | push back out；getting tired；come straight to | 0.3.0 |
| 兼职邮件 Jessie | 25 / 26 | work as + 职业；from A to B | 0.3.0 |

词组卡 15 张，和上面这些点对应。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 复习页（标签、做题、笔记、照片、历史） |
| `data.js` | 题干、选项、对/错提示、错因笔记、词组卡 |
| `group.js` | 按原题 / 按知识点分组 |
| `srs.js` | 间隔复习 |
| `source.json` | 书目和早期入库摘要（未覆盖全部现题） |
| `photos-drive.js` | 原题照片地址（现指向 GitHub Pages） |
| `photos-manifest.json` | Drive 文件 id，给 Action 同步用 |
| `photos/` | 原题照片；可由 Action 从 Drive 拉下来 |

原题照片也备份在 Google Drive 文件夹 [pet-review-photos](https://drive.google.com/drive/folders/1fHmntNUhxfQd-5sVNaKrN509X58SDJvj)。  
网页现在读 Pages 上的 `photos/`。本地预览也可把 jpg 放到 `photos/`，文件名与 `data.js` 里的 `photo` 字段一致。

## 本地打开

仓库是静态文件，没有构建步骤。

```bash
git clone https://github.com/adoocoke/pet-review.git
cd pet-review
# 用任意静态服务器，避免 file:// 下部分环境读不到图
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080 。

## 怎么加一道新错题

加题后把版本升到 **0.5.0**，并在上面「版本记录」写清加了哪几题。

1. 给纸质页拍照，上传到 Drive 的 `pet-review-photos`，或放进 `photos/`。
2. 在 `data.js` 的 `ITEMS` 里加一条：`id`、题干、选项、正确答案、对/错说明、错因笔记、`photo` 路径。
3. 若是新词组，在 `CARDS` 里加一行：`[中文, 英文, 例句]`。
4. 在 `group.js` 里给这个 `id` 标 `passage`（哪篇原文）和 `tag`（哪个知识点）。
5. 新照片要在网页显示：把文件放进 `photos/`（或等 Action 从 Drive 同步），并在 `photos-drive.js` 补一条 Pages 地址。

孩子作业原图也可以只放 Drive、不进 git，避免把整本练习册公开。

## 下一步（网页版还没做）

- 家长端：拍照后一键入库（现在是改 `data.js`）
- 进度云同步（现在只在本机浏览器）
- PET 题型扩面：阅读其它 Part、听力、写作词组
- 再做成手机 App
