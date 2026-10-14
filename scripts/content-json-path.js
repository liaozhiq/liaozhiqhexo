// Hexo 6 起 post.path 不再带前导斜杠，而主题的站内搜索是用
// location.href='{path}' 直接跳转的：相对路径在非首页（例如 /archives/）会拼错。
// 这里在生成阶段把 content.json 里的 path 补成绝对路径，与旧版 Hexo 的输出格式一致。
const TARGET = 'content.json';

hexo.extend.filter.register('after_generate', function () {
  const route = hexo.route;
  if (!route.list().includes(TARGET)) return;

  const chunks = [];
  return new Promise((resolve, reject) => {
    route
      .get(TARGET)
      .on('data', (chunk) => chunks.push(chunk))
      .on('error', reject)
      .on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const list = Array.isArray(data) ? data : data.posts;

          let changed = false;
          if (Array.isArray(list)) {
            for (const item of list) {
              if (typeof item.path === 'string' && !item.path.startsWith('/')) {
                item.path = '/' + item.path;
                changed = true;
              }
            }
          }

          if (changed) route.set(TARGET, JSON.stringify(data));
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
});
