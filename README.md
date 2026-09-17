# pet-review

**当前版本 0.20.0**（2026-09-17）  
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
3. **按知识点**：告示理解 / 匹配理解 / 语法填空 / 介词用法 / 语法错误 / 固定搭配 / 词组 / 生词不会用。
4. **单词词组卡**：PET 生词单独一堆，中文 ↔ 英文翻转，带例句。
5. **学习历史**：练习次数、做对次数、今日到期数；最近 40 条记录。
6. 每道题有三块：**再做一次**、**错因笔记**、**原题照片**。
7. **设置**：贴 GitHub token，把进度写进 `progress.json`，换设备共用。

## 进度同步

- 读：打开页就拉 `progress.json`，和本机按每题 `last` 合并。
- 写：设置里贴 fine-grained PAT（只给本仓 Contents 读写），做题后 2 秒写回。
- token 存这台浏览器，**不要**把 token 提交进 git。

## 版本记录

小改文档 / 修链接用第三位（0.4.1）；加题、加功能用第二位（0.13.0）。

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
