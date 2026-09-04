# 代码约定

给这个复习网页用。文件少，约定也少，但要固定，避免下一题把结构拆散。

## 先建 Issue 再改代码

以后有需求，不要直接改网页。顺序：

1. 开一张 GitHub Issue（能挂到 #1 看板就挂）
2. 写清：为什么、做完算完
3. 标 `now` / `next` / `later`
4. 再改代码；提交说明带 `#编号`
5. 验过后关 Issue

正在做的那张卡里的小补丁可以不另开。换一个新能力必须先建卡。

## 版本

- 展示在 `index.html` 大标题旁，现在是 **v0.5.2**。README 里写产品版本 **0.5.0**起。
- 加题、加能力：升第二位（0.6.0），并在 README 「版本记录」写清加了什么。
- 改文档、修链接、改 Action、小按钮：升第三位（0.5.2）。
- 进度键：`localStorage` → `pet-review-v4`。改 SRS 结构才换键（v5），并兼容读旧键。

## 目录

```
index.html            页面与交互
srs.js                间隔复习
sync.js               进度读写 progress.json
group.js              按原题 / 按知识点
data.js               只放 ITEMS=[]、CARDS=[] 和上限说明
data/<passage>.js     一篇原题一个分片
data/cards.js         词卡
progress.json         艾宾浩斯进度
photos/               原题 jpg
photos-manifest.json  Drive id
```

不要把题库塞回单文件 `data.js`。

## 题库分片

一个 `data/*.js` 先到先拆：32KB 或 20 道题。新篇文新文件。

## 一道题的字段

必填：`id`、`title`、`prompt`、`options`、`answer`、`fill`、`ok`、`bad`、`note`、`photo`、`passage`、`tag`、`point`。

- `id` 稳定，不要改旧 id
- `photo` 用 `photos/<name>.jpg`
- `tag` 只用：介词用法、语法错误、固定搭配、词组、生词不会用
- `note` 写完整错因

## 照片

1. 上传 Drive `pet-review-photos`
2. `photos-manifest.json` 补 `{ name, id }`
3. 跑 Action；同名覆盖
4. 网页用 `photos/....jpg`

## 提交说明

- `feat:` 能力
- `content:` 加题 / 改笔记 / 加图
- `infra:` Action、托管
- `docs:` 路线、约定、README
- `fix:` 坏掉的东西

一次提交只做一类事。有 Issue 就写 `#16` 这类。

## 加一道新错题

1. 照片进 Drive
2. 写 `data/<passage>.js`
3. `group.js` 标 passage / tag
4. 词卡写 `data/cards.js`
5. manifest 补 id，跑 Action
6. README 补一行，版本按规则升
