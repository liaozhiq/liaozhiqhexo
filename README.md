# liaozhiqhexo

[https://liaozhiq.github.io](https://liaozhiq.github.io) 的 Hexo 源码。

原站只发布了 `hexo generate` 之后的静态产物（`liaozhiq.github.io` 仓库），源码仓库已经找不到，
这个工程是从已发布的 HTML 产物反向重建出来的，目标是可以正常 `hexo g` 并且输出与原站一致。

## 目录结构

```
_config.yml          站点配置（title / url / permalink / 部署目标等）
package.json         依赖与常用脚本
scaffolds/           hexo new 的模板
scripts/             Hexo 扩展脚本（见下方“对主题的两处适配”）
source/
  _posts/            文章（6 篇，均为原站文章的反向还原）
  about/             关于页
  tags/              标签页
  categories/        分类页
  img/               站点自有图片（头像、favicon、收款码等）
themes/tomotoes/     主题 hexo-theme-tomotoes，对应 2018-04-14 的代码状态
```

## 常用命令

```bash
npm install        # 安装依赖
npm run server     # 本地预览，默认 http://localhost:4000
npm run build      # 生成静态文件到 public/
npm run deploy     # clean + generate + 推送到 liaozhiq.github.io
```

## 部署

`_config.yml` 里已经配好：

```yaml
deploy:
  type: git
  repo: https://github.com/liaozhiq/liaozhiq.github.io.git
  branch: master
```

`npm run deploy` 会把 `public/` 的内容推到 `liaozhiq.github.io` 仓库的 `master` 分支，也就是线上站点。
推送需要本地有该仓库的写权限（HTTPS 需要凭据，或改用 SSH 地址）。

源码本身单独用一个仓库保存，本仓库的 `origin` 已经指向 `https://github.com/liaozhiq/liaozhiqhexo.git`。
该仓库需要先在 GitHub 上建好（**建成空仓库，不要勾选 README / .gitignore / license**，
否则远端会有初始提交，首次推送要先合并），然后：

```bash
git push -u origin master
```

如果源码想放到别的仓库名下，改 `git remote set-url origin <新地址>` 即可，
另外记得同步更新本 README 里的仓库地址。

## 与原站的一致性

已核对一致的部分：

- 6 篇文章的标题、日期、标签、永久链接（`/posts/<abbrlink>/`）以及正文
- 主题版本（`themes/tomotoes` 用的是 2018-04-14 那次提交，`main.js` 与原站产物逐字节一致）
- 头像、favicon、微信/支付宝收款码、打赏图等图片资源
- 归档页、关于页、标签/分类页的输出结构
- `atom.xml`、`content.json`
- 主题里被作者改过的三处内容：控制台 banner、footer 的 "Theme comes form"、`script.js` 里的一言兜底文案

已知差异（都只影响 HTML 细节，不影响显示效果）：

- Hexo 由 3.x 升到 6.3.0，`open_graph`、标签列表等 helper 的输出略有不同
- `css/style.css` 由 Less 重新编译，字节不同但样式一致
- 生成产物为 LF 换行，原站产物是 CRLF

## 对主题的两处适配

主题是 2018 年写的，直接跑在 Hexo 6 上会有两处不兼容，已在 `scripts/` 里解决，主题代码本身保持原样：

1. `scripts/theme-locals.js`：Hexo 6 不再向模板注入 lodash 的 `_`，而主题模板里大量用到，
   这里通过 `template_locals` 过滤器把 `_` 补回去。
2. `scripts/content-json-path.js`：Hexo 6 的 `post.path` 不带前导斜杠，会让站内搜索在非首页拼错链接，
   生成后把 `content.json` 里的 `path` 补成绝对路径。

## 两个可以顺手修掉的小问题（保持原样复刻，未改动）

1. `/tags/` 和 `/categories/` 两个页面的 `title` 是反的（标签页写的是“分类”，分类页写的是“标签”），
   应该是当年复制粘贴留下的，改 `source/tags/index.md` 和 `source/categories/index.md` 的 `title` 即可。
2. 主题里一言超长的兜底文案改在 `source/js/script.js`，但页面实际加载的是 `script.min.js`，
   所以线上生效的仍然是“为了正义！”。两处一起改才会生效。

## 主题

[hexo-theme-tomotoes](https://github.com/SimonAKing/hexo-theme-tomotoes)（Unlicense），
已随本仓库一起提交，不再单独 clone。
