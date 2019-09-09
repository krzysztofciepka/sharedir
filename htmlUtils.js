const path = require('path');
const escapeHtml = require('escape-html');
const { iconLookup } = require('./icons');

const { extname } = path;
const { normalize } = path;
const { sep } = path;

let base = '';

function normalizeSlashes(p) {
  return p.split(sep).join('/');
}

function htmlPath(dir) {
  const parts = dir.split('/');
  const crumb = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part) {
      parts[i] = encodeURIComponent(part);
      crumb.push(
        `<a href="/${base}${escapeHtml(
          `${parts.slice(0, i + 1).join('/')}/`,
        )}">${escapeHtml(part)}</a>`,
      );
    }
  }

  crumb.unshift([`<a href="/${base}">~</a>`]);

  return crumb.join('/');
}

function createHtmlFileList(files, dir, useIcons, view) {
  let html = `<ul id="files" class="view-${escapeHtml(view)}">${
    view === 'details'
      ? '<li class="header">'
          + '<span class="name">Name</span>'
          + '<span class="size">Size</span>'
          + '<span class="date">Modified</span>'
          + '</li>'
      : ''
  }`;

  html += files
    .map((file) => {
      const classes = [];
      const isDir = file.stat && file.stat.isDirectory();
      const p = dir.split('/').map((c) => encodeURIComponent(c));

      if (useIcons) {
        classes.push('icon');

        if (isDir) {
          classes.push('icon-directory');
        } else {
          const ext = extname(file.name);
          const icon = iconLookup(file.name);

          classes.push('icon');
          classes.push(`icon-${ext.substring(1)}`);

          if (classes.indexOf(icon.className) === -1) {
            classes.push(icon.className);
          }
        }
      }

      p.push(encodeURIComponent(file.name));

      const date = file.stat && file.name !== '..'
        ? `${file.stat.mtime.toLocaleDateString()} ${file.stat.mtime.toLocaleTimeString()}`
        : '';
      const size = file.stat && !isDir ? file.stat.size : '';

      return (
        `<li><a href="${escapeHtml(
          `/${base}
          ${normalizeSlashes(normalize(p.join('/')))}
          ${isDir ? '/' : ''}
          `,
        )}" class="${escapeHtml(classes.join(' '))}"`
          + ` title="${escapeHtml(file.name)}">`
          + `<span class="name">${escapeHtml(file.name)}</span>`
          + `<span class="size">${escapeHtml(size)}</span>`
          + `<span class="date">${escapeHtml(date)}</span>`
          + '</a></li>'
      );
    })
    .join('\n');

  html += '</ul>';

  return html;
}

module.exports = {
  init: (basePath) => {
    base = basePath;
    return {
      createHtmlFileList,
      htmlPath,
    };
  },
};
