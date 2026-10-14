// 使用 Git 提交时间更新文章页的 updated，避免重新克隆后文件时间全部变化。
// 历史文章以 baseline 提交为界：未改动时保留 front matter 中的原 updated。
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baselinePath = path.join(hexo.base_dir, '.git-updated-baseline');
const baseline = fs.readFileSync(baselinePath, 'utf8').trim();

function runGit(args) {
  return execFileSync('git', args, {
    cwd: hexo.base_dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  }).trim();
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data.source || !data.source.startsWith('_posts/')) return;

  const fullSource = path.join(hexo.source_dir, data.source);
  const relativeSource = path.relative(hexo.base_dir, fullSource).replace(/\\/g, '/');
  let timestamp = '';

  try {
    const workingTreeChanges = runGit(['status', '--porcelain', '--', relativeSource]);

    if (workingTreeChanges) {
      timestamp = fs.statSync(fullSource).mtime.toISOString();
    } else {
      timestamp = runGit([
        'log',
        '-1',
        '--format=%cI',
        `${baseline}..HEAD`,
        '--',
        relativeSource
      ]);
    }
  } catch (err) {
    // 保留 front matter 中已有的 updated，避免构建因 Git 不可用而失败。
  }

  if (timestamp) data.updated = new Date(timestamp);
});
