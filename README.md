# pet-review

**当前版本 0.7.0**（2026-09-05）  
进度键：浏览器 `localStorage` → `pet-review-v4`（兼容读入旧的 `pet-review-v3`）  
云端进度：仓库根目录 `progress.json`

给备考剑桥 **KET（A2 Key）**、并衔接 **PET（B1 Preliminary）** 的孩子用的错题复习网页。  
先解决两件事：**学习历史**、**做过的纸质练习会忘**。家长帮拍照、记笔记；孩子打开网页再练。

以后会做成手机 App。现在是纯静态网页，不需要登录。要把进度写回仓库，在「设置」里贴 token。

- 复习页（GitHub Pages）：https://adoocoke.github.io/pet-review/
- 备用（Vercel）：https://pet-review-adoocokes-projects.vercel.app
- 仓库：https://github.com/adoocoke/pet-review

## 现在能做什么

打开网页就能：

1. **今日复习**：到期的错题排在最上面，点进去再做一次。
2. **按题目**：同一篇原文里的错题归在一起。
3. **按知识点**：介词用法 / 语法错误 / 固定搭配 / 词组 / 生词不会用。
4. **单词词组卡**：中文 ↔ 英文翻转，带例句。
5. **学习历史**：练习次数、做对次数、今日到期数；最近 40 条记录。
6. 每道题有三块：**再做一次**、**错因笔记**、**原题照片**。
7. **设置**：贴 GitHub token，把进度写进 `progress.json`，换设备共用。

## 进度同步

- 读：打开页就拉 `progress.json`，和本机按每题 `last` 合并。
- 写：设置里贴 fine-grained PAT（只给本仓 Contents 读写），做题后 2 秒写回。
- token 存这台浏览器，**不要**把 token 提交进 git。

## 版本记录

小改文档 / 修链接用第三位（0.4.1）；加题、加功能用第二位（0.7.0）。

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
