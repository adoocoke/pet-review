/* 题库分片规则
 * 上限：单文件 32KB，或 20 道题（先到先拆）。
 * 为什么 32KB：手机打开快，GitHub 提交也稳；错因笔记一长就会挡到这里。
 * 怎么拆：按原题一页一个文件，放 data/，用 ITEMS.push。
 * index.html 要加对应 script。
 */
const DATA_LIMIT_KB = 32;
const DATA_LIMIT_ITEMS = 20;
const ITEMS = [];
const CARDS = [];
