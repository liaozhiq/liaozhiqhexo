// hexo-theme-tomotoes 是 2018 年为主题写的，模板里大量使用 lodash 的 `_`。
// Hexo 6 不再向模板注入 `_`，这里通过 template_locals 过滤器补回来，
// 这样 theme 目录可以保持原样不动。
hexo.extend.filter.register('template_locals', function (locals) {
  locals._ = require('lodash');
  return locals;
});
