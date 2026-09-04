# Roadmap

产品管法：一张总卡 + 阶段标签。看板是 GitHub Issues，不是另做一套工具。

- 总卡：[#1 产品路线 · MVP 0.4 已交付](https://github.com/adoocoke/pet-review/issues/1)
- 列表：https://github.com/adoocoke/pet-review/issues
- 代码约定：[`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)

## 用户

备考剑桥 KET（A2 Key）并衔接 PET 的孩子；家长协助拍照、记笔记。

当前只解决两件事：**学习历史**、**纸质练习会忘**。

## 怎么看阶段

| 标签 | 意思 |
| --- | --- |
| `mvp` + `shipped` | 0.4 已交付，卡已关 |
| `now` | 这一拼要做 |
| `next` | 下一拼 |
| `later` | 更后再说 |

加功能升第二位版本（0.5.0）；改文档 / 修链接升第三位（0.4.2）。

## MVP 0.4 · 已交付

孩子打开网页能把纸质错题再做一遍，看到错因和原图，按间隔回来。

| 卡 | 状态 |
| --- | --- |
| [#2 复习页三页签](https://github.com/adoocoke/pet-review/issues/2) | 已关 |
| [#3 艾宾浩斯](https://github.com/adoocoke/pet-review/issues/3) | 已关 |
| [#4 两种归堆](https://github.com/adoocoke/pet-review/issues/4) | 已关 |
| [#5 词卡 + 本机历史](https://github.com/adoocoke/pet-review/issues/5) | 已关 |
| [#6 题库拆分](https://github.com/adoocoke/pet-review/issues/6) | 已关 |
| [#7 Pages + Vercel](https://github.com/adoocoke/pet-review/issues/7) | 已关 |
| [#8 Drive 同步照片](https://github.com/adoocoke/pet-review/issues/8) | 已关 |
| [#9 15 道错题](https://github.com/adoocoke/pet-review/issues/9) | 已关 |

## Now

| 卡 | 为什么 |
| --- | --- |
| [#10 加题按约定走](https://github.com/adoocoke/pet-review/issues/10) | README 还写旧 `data.js`，要改成拆分流程 |
| [#11 Vercel 连仓库](https://github.com/adoocoke/pet-review/issues/11) | 备用站现在不跟 push |

## Next

| 卡 | 为什么 |
| --- | --- |
| [#12 家长拍照一键入库](https://github.com/adoocoke/pet-review/issues/12) | 现在加题要改 JS |
| [#13 进度云同步](https://github.com/adoocoke/pet-review/issues/13) | 换设备会丢 localStorage |

## Later

| 卡 | 为什么 |
| --- | --- |
| [#14 PET 题型扩面](https://github.com/adoocoke/pet-review/issues/14) | MVP 只覆盖阅读 Part 4/5 |
| [#15 手机 App](https://github.com/adoocoke/pet-review/issues/15) | 网页稳了再做 |

## 不做什么（这一拿）

- 登录系统
- 把整本练习册公开进 git
- 在 App 里重写一套题库
