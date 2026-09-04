# pet-review

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

进度存在浏览器 `localStorage`，键名 `pet-review-v4`。换设备或清缓存会丢进度，题库本身在仓库里。

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

15 道「错了或拿不准」的题：

| 原题 | 题号 | 要记的点 |
| --- | --- | --- |
| Central Park p.135 | 23 | be popular with |
| Jerry → Bill 邮件 | 27 / 28 / 29 | presents from；bigger than（不是 then / of）；on the top |
| Holidays p.141 | 22 / 23 / 24 | 东西 cost / 人 spend；much + 比较级；other countries |
| 住院邮件 Fiona / Marry | 25 / 27 / 30 | fall down the stairs；because ≠ so；cut herself |
| Dolphin Hero p.147 | 19 / 20 / 22 | push back out；getting tired；come straight to |
| 兼职邮件 Jessie | 25 / 26 | work as + 职业；from A to B |

词组卡 15 张，和上面这些点对应。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 复习页（标签、做题、笔记、照片、历史） |
| `data.js` | 题干、选项、对/错提示、错因笔记、词组卡 |
| `group.js` | 按原题 / 按知识点分组 |
| `srs.js` | 间隔复习 |
| `source.json` | 书目和早期入库摘要（未覆盖全部现题） |
| `photos-drive.js` | 原题照片 → Google Drive 缩略图 |
| `photos-manifest.json` | 照片清单 |
| `photos/` | 本地照片目录；仓库里先放说明，大图走 Drive |

原题照片在 Google Drive 文件夹 [pet-review-photos](https://drive.google.com/drive/folders/1fHmntNUhxfQd-5sVNaKrN509X58SDJvj)。  
文件夹需对「知道链接的任何人」可见，网页才能出图。本地预览也可把 jpg 放到 `photos/`，文件名与 `data.js` 里的 `photo` 字段一致。

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

1. 给纸质页拍照，上传到 Drive 的 `pet-review-photos`，或放进 `photos/`。
2. 在 `data.js` 的 `ITEMS` 里加一条：`id`、题干、选项、正确答案、对/错说明、错因笔记、`photo` 路径。
3. 若是新词组，在 `CARDS` 里加一行：`[中文, 英文, 例句]`。
4. 在 `group.js` 里给这个 `id` 标 `passage`（哪篇原文）和 `tag`（哪个知识点）。
5. 新照片要在网页显示：`photos-drive.js` 里补 Drive thumbnail；或把文件丢进 GitHub 的 `photos/`。

孩子作业原图默认不进 git，避免把整本练习册公开。

## 下一步（网页版还没做）

- 家长端：拍照后一键入库（现在是改 `data.js`）
- 进度云同步（现在只在本机浏览器）
- PET 题型扩面：阅读其它 Part、听力、写作词组
- 再做成手机 App
