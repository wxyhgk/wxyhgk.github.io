/* 中英文同章节互跳：zh/zh_A.html <-> en/A.html，zh/index.html <-> en/index.html */
(function () {
  function counterpart(pathname) {
    var m;
    if ((m = pathname.match(/^(.*)\/zh\/zh_(.+\.html?)$/))) {
      return { url: m[1] + '/en/' + m[2], label: 'EN', title: 'Switch to English version' };
    }
    if ((m = pathname.match(/^(.*)\/en\/index\.html?$/))) {
      return { url: m[1] + '/zh/index.html', label: '中文', title: '切换到中文版' };
    }
    if ((m = pathname.match(/^(.*)\/en\/(.+\.html?)$/))) {
      return { url: m[1] + '/zh/zh_' + m[2], label: '中文', title: '切换到中文版' };
    }
    if ((m = pathname.match(/^(.*)\/zh\/index\.html?$/))) {
      return { url: m[1] + '/en/index.html', label: 'EN', title: 'Switch to English version' };
    }
    return null;
  }
  document.addEventListener('DOMContentLoaded', function () {
    var c = counterpart(location.pathname);
    if (!c) return;
    var a = document.createElement('a');
    a.id = 'lang-switch';
    a.href = c.url;
    a.textContent = c.label;
    a.title = c.title;
    document.body.appendChild(a);
  });
})();
