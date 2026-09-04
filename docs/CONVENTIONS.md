# 代码约定

给这个复习网页用。文件少，约定也少，但要固定，避免下一题把结构拆散。

## 版本

- 展示在 `index.html` 大标题旁，现在是 **v0.4.3** 这一类。README 里写产品版本 **0.4.1**。
- 加题、加能力：升第二位（0.5.0），并在 README 「版本记录」写清加了什么。
- 改文档、修链接、改 Action：升第三位（0.4.2）。
- 进度键：`localStorage` → `pet-review-v4`。改 SRS 结构才换键（v5），并兼容读旧键。

## 目录

```
index.html          页面与交互
scs.js              间隔复习
sgroup.js           按原题 / 按知识点
data.js             只放 ITEMS=[]、CARDS=[] 和上限说明
data/<passage>.js   一篇原题一个分片
data/cards.js       词卡
photos/             原题 jpg，文件名 = data 里 photo 字段
photos-manifest.json  Drive id，给 Action
photos-drive.js     照片地址表（可为空，网页用相对路径）
```

不要把题库塞回单文件 `data.js`。

## 题库分片

一个 `data/*.js` 先到先拆：

- 大小 32KB
- 或 20 道题

新篇文新文件。`index.html` 里加一行 `<script src="data/....js">`。

## 一道题的字段

必填：`id`、`title`、`prompt`、`options`、`answer`、`fill`、`ok`、`bad`、`note`、`photo`、`passage`、`tag`、`point`。

- `id` 稳定，不要改旧 id（进度挂在 id 上）
- `photo` 用 `photos/<name>.jpg`，和 Drive / 仓库文件名一致
- `tag` 只用这五个：介词用法、语法错误、固定搭配、词组、生词不会用
- `note` 写完整错因，不要只写答案

词卡一行：`["中文", "英文", "例句"]`。

## 照片

1. 上传 Drive 文件夹 `pet-review-photos`
2. `photos-manifest.json` 补 `{ name, id }`
3. 跑 Action；同名覆盖，不会复制一份
4. 网页用相对路径 `photos/....jpg`

孩子整页作业原图可以只放 Drive、不进 git。

## 提交说明

- `feat:` 能力
- `content:` 加题 / 改笔记 / 加图
- `infra:` Action、托管
- `docs:` 路线、约定、README
- `fix:` 坏掉的东西

一次提交只做一类事。

## 加一道新错题（正确顺序）

1. 照片进 Drive，文件名定好
2. 写 `data/<passage>.js` 一条 ITEM
3. `group.js` 标 passage / tag
4. 需要词卡就写 `data/cards.js`
5. manifest 补 id，跑 Action
6. README 补一行，版本按规则升
