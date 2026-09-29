# pet-review

**当前版本 0.24.0**（2026-09-29）  
进度键：浏览器 `localStorage` → `pet-review-v4`（兼容读入旧的 `pet-review-v3`）  
云端进度：仓库根目录 `progress.json`

给备考剑桥 **KET（A2 Key）**、并衔接 **PET（B1 Preliminary）** 的孩子用的错题复习网页。  
先解决两件事：**学习历史**、**做过的纸质练习会忘**。家长帮拍照、记笔记；孩子打开网页再练。

以后会做成手机 App。现在是 **PWA**：Safari / Chrome 可以「添加到主屏幕」，离线也能打开已缓存的复习页。

- 复习页（GitHub Pages）：https://adoocoke.github.io/pet-review/
- 备用（Vercel）：https://pet-review-adoocokes-projects.vercel.app
- 仓库：https://github.com/adoocoke/pet-review

## 现在能做什么

打开网页就能：

1. **今日复习**：到期的错题排在最上面，点进去再做一次。
2. **按题目**：同一篇原文里的错题归在一起。
3. **按知识点**：告示理解 / 匹配理解 / 语法填空 / 介词用法 / 语法错误 / 固定搭配 / 词组 / 生词不会用。
4. **单词词组卡**：PET 生词单独一堆，中文 ↔ 英文翻转，带例句。
5. **练错词**：默写本红圈/改笔词单独一页，看中文写英文；也可切到全部 PET 生词。
6. **学习历史**：练习次数、做对次数、今日到期数；最近 40 条记录。
7. 每道题有三块：**再做一次**、**错因笔记**、**原题照片**。
8. **设置**：贴 GitHub token，把进度写进 `progress.json`，换设备共用。

## 进度同步

- 读：打开页就拉 `progress.json`，和本机按每题 `last` 合并。
- 写：设置里贴 fine-grained PAT（只给本仓 Contents 读写），做题后 2 秒写回。
- token 存这台浏览器，**不要**把 token 提交进 git。

## 版本记录

小改文档 / 修链接用第三位（0.4.1）；加题、加功能用第二位（0.13.0）。

### 0.24.0 · 2026-09-29

- 做成 PWA：可添加到主屏幕，独立窗口打开
- 增加 `manifest.webmanifest`、图标、Service Worker
- 离线能打开已打开过的复习页；题库和 app.js 未改

### 0.23.0 · 2026-09-23

- Week 2 拼写不稳也入练错词：forget / keen / organise / festival / collect / advice / scientist
- 写对的仍不入

### 0.22.0 · 2026-09-23

- Week 2 默写只收红圈 / 改笔：professional / perfect / expect / theatre / interest / business / seem / site / suggest / expert / research
- 进「练错词 · 默写错词」和「单词词组卡 · PET 生词」
- 写对的不入（amazing、appear、whole、prefer 等）；opportunity 已有卡，不重复

### 0.21.1 · 2026-09-17

- 右侧「顶 25 50 75 底」字号改小（11px → 8px）

### 0.21.0 · 2026-09-17

- 新增「练错词」页签：默写错词 18 个单独练，看中文写英文
- 对了进下一张；错了或点「看答案」先显示正确词和例句
- 可切「全部 PET 生词」；不改 app.js，旧题不动
- 单词词组卡恢复 PET / KET 筛选，并有入口跳到练错词

### 0.20.0 · 2026-09-17

- 词汇默写 Day 1–5：只收红圈 / 改笔 / 写错的词
- 进「单词词组卡 · PET 生词」：spend / activity / experience / create / language / suitable / competition / skill / special / actually / available / problem / design / allow / explain / produce / discover / develop
- 写对、没有圈的词不入（teenager、popular、famous 等）
- 已有卡片不重复：practice、improve、popular with

### 0.19.0 · 2026-09-08

- 按书重新解析 p.101–102：一篇就是一道整题
- 第一次做对的空（like / with / if / up / to / when / as / or）留在下划线上
- 改笔空才要填：菜园 them 是 it→them，不再当成第一次就对
- 改错时整篇文章都在，不拆成单空

### 0.18.0 · 2026-09-08

- 语法填空改成整篇原文：6 个空都在文章里
- 书上本来对的空直接写在下划线上
- 复习做对的空也留在线上（绿色），错的继续空白再填
- 看完整句才能判断，不再只抽半句

### 0.16.0 · 2026-09-08

- 语法填空改成按篇填空：一篇里的空一次提交
- 对的空留在下划线上，下次绿色不用再写
- 错的空下次还是空白
- 全对才过关；部分对只锁住对的那些

### 0.15.0 · 2026-09-08

- PET 语法填空（专项训练 p.101–102，Write one word）：孩子自己打一个词，不再出选项
- 少年记者：or / when / Each / so are facts
- 学校菜园：or make it part / increase in
- NBA 经历：it didn't sink in / was playing / keep in touch / get to know / but
- 离不开的东西：a pair of glasses / list are / Things that / such as
- 单空做对的不入（like you、along with、if、set up、them、to sow、when we first、as well as）

### 0.14.0 · 2026-09-08

- PET 完型（专项训练 p.93–95）：只收改笔/双圈
- 室内雪仗 stays / frozen / shape / knocked over
- 自己做衣服 practice / benefits / environmentally friendly
- 公开演讲 class / present / improve / effect
- 养鸡 get to know
- 练习 5 Legoland 还没做，不入

### 0.13.0 · 2026-09-07

- PET 告示 / 匹配：题干上方用金色虚线框出原文，再出选项
- 标签 PET；「按考试」里单独一堆
- 红笔生词进「单词词组卡 → PET 生词」，中文点开看英文
- 入库改笔/双圈：泳池 reserved、泳池派对泳衣、储物柜 examination、圣诞晚会报名、访客登记、二手车、电影票、Viki 短信、Eliana 滑冰营
- 单圈做对的告示不入；Mike 夏令营原文不完整，暂不入

### 0.12.0 · 2026-09-07

- 开始入 PET Part 1 告示

### 0.8.0 · 2026-09-05

- 入库 Part 5 邮件 + Part 4 Potter / Films p.111 / Thanksgiving / Zoo / Jellyfish 里改笔、双写的空（#23）
- 33 道：tell sb that、be back at school、has been、go for a walk、arrive at、got married、A and I、enjoy ourselves、find out、have been to、afraid of、too close to、go for a ride 等
- Test 3 / Test 5 没写完的空先不入

### 0.7.0 · 2026-09-05

- 入库 KET Test 2–9 里圈过、改过或拿不准的题（#22）
- Tennis：enter sb for / like you / one of the
- Sharks：metres long / not too deep
- Getting hotter：stop … from / cold areas / have a problem
- Camels：desert ≠ dessert / winter
- Action figures：these things
- Gwen Stefani：draws / favourite
- Ukulele：sound / movie stars / surprising / quickly
- Dubai 6/6、驼驼其余 5 题全对，不入库

### 0.5.0 · 2026-09-04

- 设置页贴 token，进度写进本仓 `progress.json`
- 打开页自动拉云端并合并；做题后 debounce 2 秒写回

### 0.4.1 · 2026-09-04

- README 写上版本号

### 0.4.0 · 2026-09-04（功能基线，进度键 `pet-review-v4`）

- 艾宾浩斯间隔、两种归堆、Drive 同步照片

### 0.3.0 · 2026-09-04

- 错因笔记、原题照片；Holidays / 住院 / Dolphin / Jessie 入库

### 0.2.0 · 2026-09-04

- PET 教材 + Pages + Jerry 邮件

### 0.1.0 · 2026-09-04

- 仓库落地，Central Park 23

## 复习间隔（艾宾浩斯）

20 分钟 → 1 小时 → 今天晚些 → 明天 → 2 天 → 4 天 → 7 天 → 15 天 → 31 天

## 正在用的书

| 书 | 级别 | ISBN |
| --- | --- | --- |
| 华研《剑桥KET阅读》上册 | A2 Key for Schools | 9787121406034 |
| 华研《剑桥PET阅读》上册 | B1 Preliminary for Schools | 9787121406171 |

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 复习页 |
| `sync.js` | 进度读写 GitHub `progress.json` |
| `progress.json` | 艾宾浩斯进度与历史 |
| `data/*.js` | 按篇拆分的题库 |
| `group.js` | 按原题 / 按知识点 |
| `srs.js` | 间隔复习 |
| `photos/` | 原题照片 |

## 下一步（网页版还没做）

- 家长端：拍照后一键入库
- PET 题型扩面
- 再做成手机 App
