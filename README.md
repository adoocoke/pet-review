# pet-review

**当前版本 0.13.0**（2026-09-07）  
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
3. **按知识点**：告示理解 / 匹配理解 / 介词用法 / 语法错误 / 固定搭配 / 词组 / 生词不会用。
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

### 0.7.0 · 2026-09-05

- 入库 KET Test 2–9 里圈过、改过或拿不准的题

## 复习间隔（艾宾浩斯）

20 分钟 → 1 小时 → 今天晚些 → 明天 → 2 天 → 4 天 → 7 天 → 15 天 → 31 天

## 正在用的书

| 书 | 级别 | ISBN |
| --- | --- | --- |
| 华研《剑桥KET阅读》上册 | A2 Key for Schools | 9787121406034 |
| 华研《剑桥PET阅读》上册 | B1 Preliminary for Schools | 9787121406171 |
