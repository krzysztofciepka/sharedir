var express = require('express');
var serveIndex = require('serve-index');
const natTunnel = require('nat-tunnel');
const escapeHtml = require('escape-html');
const fs = require('fs');
const path = require('path');
var mime = require('mime-types');
const normalize = path.normalize;
const sep = path.sep;
const extname = path.extname;

var cache = {};

function load(icon) {
    if (cache[icon]) return cache[icon];
    return cache[icon] = fs.readFileSync(__dirname + '/public/icons/' + icon, 'base64');
  }

function iconStyle(files, useIcons) {
    if (!useIcons) return '';
    var i;
    var list = [];
    var rules = {};
    var selector;
    var selectors = {};
    var style = '';
  
    for (i = 0; i < files.length; i++) {
      var file = files[i];
  
      var isDir = file.stat && file.stat.isDirectory();
      var icon = isDir
        ? { className: 'icon-directory', fileName: icons.folder }
        : iconLookup(file.name);
      var iconName = icon.fileName;
  
      selector = '#files .' + icon.className + ' .name';
  
      if (!rules[iconName]) {
        rules[iconName] = 'background-image: url(data:image/png;base64,' + load(iconName) + ');'
        selectors[iconName] = [];
        list.push(iconName);
      }
  
      if (selectors[iconName].indexOf(selector) === -1) {
        selectors[iconName].push(selector);
      }
    }
  
    for (i = 0; i < list.length; i++) {
      iconName = list[i];
      style += selectors[iconName].join(',\n') + ' {\n  ' + rules[iconName] + '\n}\n';
    }
  
    return style;
  }

var icons = {
    // base icons
    'default': 'page_white.png',
    'folder': 'folder.png',
  
    // generic mime type icons
    'font': 'font.png',
    'image': 'image.png',
    'text': 'page_white_text.png',
    'video': 'film.png',
  
    // generic mime suffix icons
    '+json': 'page_white_code.png',
    '+xml': 'page_white_code.png',
    '+zip': 'box.png',
  
    // specific mime type icons
    'application/javascript': 'page_white_code_red.png',
    'application/json': 'page_white_code.png',
    'application/msword': 'page_white_word.png',
    'application/pdf': 'page_white_acrobat.png',
    'application/postscript': 'page_white_vector.png',
    'application/rtf': 'page_white_word.png',
    'application/vnd.ms-excel': 'page_white_excel.png',
    'application/vnd.ms-powerpoint': 'page_white_powerpoint.png',
    'application/vnd.oasis.opendocument.presentation': 'page_white_powerpoint.png',
    'application/vnd.oasis.opendocument.spreadsheet': 'page_white_excel.png',
    'application/vnd.oasis.opendocument.text': 'page_white_word.png',
    'application/x-7z-compressed': 'box.png',
    'application/x-sh': 'application_xp_terminal.png',
    'application/x-msaccess': 'page_white_database.png',
    'application/x-shockwave-flash': 'page_white_flash.png',
    'application/x-sql': 'page_white_database.png',
    'application/x-tar': 'box.png',
    'application/x-xz': 'box.png',
    'application/xml': 'page_white_code.png',
    'application/zip': 'box.png',
    'image/svg+xml': 'page_white_vector.png',
    'text/css': 'page_white_code.png',
    'text/html': 'page_white_code.png',
    'text/less': 'page_white_code.png',
  
    // other, extension-specific icons
    '.accdb': 'page_white_database.png',
    '.apk': 'box.png',
    '.app': 'application_xp.png',
    '.as': 'page_white_actionscript.png',
    '.asp': 'page_white_code.png',
    '.aspx': 'page_white_code.png',
    '.bat': 'application_xp_terminal.png',
    '.bz2': 'box.png',
    '.c': 'page_white_c.png',
    '.cab': 'box.png',
    '.cfm': 'page_white_coldfusion.png',
    '.clj': 'page_white_code.png',
    '.cc': 'page_white_cplusplus.png',
    '.cgi': 'application_xp_terminal.png',
    '.cpp': 'page_white_cplusplus.png',
    '.cs': 'page_white_csharp.png',
    '.db': 'page_white_database.png',
    '.dbf': 'page_white_database.png',
    '.deb': 'box.png',
    '.dll': 'page_white_gear.png',
    '.dmg': 'drive.png',
    '.docx': 'page_white_word.png',
    '.erb': 'page_white_ruby.png',
    '.exe': 'application_xp.png',
    '.fnt': 'font.png',
    '.gam': 'controller.png',
    '.gz': 'box.png',
    '.h': 'page_white_h.png',
    '.ini': 'page_white_gear.png',
    '.iso': 'cd.png',
    '.jar': 'box.png',
    '.java': 'page_white_cup.png',
    '.jsp': 'page_white_cup.png',
    '.lua': 'page_white_code.png',
    '.lz': 'box.png',
    '.lzma': 'box.png',
    '.m': 'page_white_code.png',
    '.map': 'map.png',
    '.msi': 'box.png',
    '.mv4': 'film.png',
    '.pdb': 'page_white_database.png',
    '.php': 'page_white_php.png',
    '.pl': 'page_white_code.png',
    '.pkg': 'box.png',
    '.pptx': 'page_white_powerpoint.png',
    '.psd': 'page_white_picture.png',
    '.py': 'page_white_code.png',
    '.rar': 'box.png',
    '.rb': 'page_white_ruby.png',
    '.rm': 'film.png',
    '.rom': 'controller.png',
    '.rpm': 'box.png',
    '.sass': 'page_white_code.png',
    '.sav': 'controller.png',
    '.scss': 'page_white_code.png',
    '.srt': 'page_white_text.png',
    '.tbz2': 'box.png',
    '.tgz': 'box.png',
    '.tlz': 'box.png',
    '.vb': 'page_white_code.png',
    '.vbs': 'page_white_code.png',
    '.xcf': 'page_white_picture.png',
    '.xlsx': 'page_white_excel.png',
    '.yaws': 'page_white_code.png'
  };

var app = express();

function iconLookup(filename) {
    var ext = extname(filename);
  
    // try by extension
    if (icons[ext]) {
      return {
        className: 'icon-' + ext.substring(1),
        fileName: icons[ext]
      };
    }
  
    var mimetype = mime.lookup(ext);
  
    // default if no mime type
    if (mimetype === false) {
      return {
        className: 'icon-default',
        fileName: icons.default
      };
    }
  
    // try by mime type
    if (icons[mimetype]) {
      return {
        className: 'icon-' + mimetype.replace('/', '-'),
        fileName: icons[mimetype]
      };
    }
  
    var suffix = mimetype.split('+')[1];
  
    if (suffix && icons['+' + suffix]) {
      return {
        className: 'icon-' + suffix,
        fileName: icons['+' + suffix]
      };
    }
  
    var type = mimetype.split('/')[0];
  
    // try by type only
    if (icons[type]) {
      return {
        className: 'icon-' + type,
        fileName: icons[type]
      };
    }
  
    return {
      className: 'icon-default',
      fileName: icons.default
    };
  }

function normalizeSlashes(path) {
    return path.split(sep).join('/');
  };

  function htmlPath(dir) {
    console.log(dir)
    var parts = dir.split('/');
    var crumb = [];
  
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
  
      if (part) {
        console.log(part)
        parts[i] = encodeURIComponent(part);
        crumb.push('<a href="/serwer' + escapeHtml(parts.slice(0, i + 1).join('/') + '/') + '">' + escapeHtml(part) + '</a>');
      }
    }
    console.log(crumb)
    crumb.unshift(['<a href="/serwer">~</a>'])
   
    return crumb.join('/');
  }

function createHtmlFileList(files, dir, useIcons, view) {
    var html = '<ul id="files" class="view-' + escapeHtml(view) + '">'
      + (view === 'details' ? (
        '<li class="header">'
        + '<span class="name">Name</span>'
        + '<span class="size">Size</span>'
        + '<span class="date">Modified</span>'
        + '</li>') : '');
  
    html += files.map(function (file) {
      var classes = [];
      var isDir = file.stat && file.stat.isDirectory();
      var path = dir.split('/').map(function (c) { return encodeURIComponent(c); });
  
      if (useIcons) {
        classes.push('icon');
  
        if (isDir) {
          classes.push('icon-directory');
        } else {
          var ext = extname(file.name);
          var icon = iconLookup(file.name);
  
          classes.push('icon');
          classes.push('icon-' + ext.substring(1));
  
          if (classes.indexOf(icon.className) === -1) {
            classes.push(icon.className);
          }
        }
      }
  
      path.push(encodeURIComponent(file.name));
  
      var date = file.stat && file.name !== '..'
        ? file.stat.mtime.toLocaleDateString() + ' ' + file.stat.mtime.toLocaleTimeString()
        : '';
      var size = file.stat && !isDir
        ? file.stat.size
        : '';
  
      return '<li><a href="'
        + escapeHtml( '/serwer' + normalizeSlashes(normalize(path.join('/'))) + (isDir ? '/' : ''))
        + '" class="' + escapeHtml(classes.join(' ')) + '"'
        + ' title="' + escapeHtml(file.name) + '">'
        + '<span class="name">' + escapeHtml(file.name) + '</span>'
        + '<span class="size">' + escapeHtml(size) + '</span>'
        + '<span class="date">' + escapeHtml(date) + '</span>'
        + '</a></li>';
    }).join('\n');
  
    html += '</ul>';
  
    return html;
  }

  module.exports = {
      share: () => {

// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/', express.static(process.cwd()), serveIndex(process.cwd(), { 'icons': true, template: (locals, callback) => {
    fs.readFile(path.join(__dirname, 'public/template.html'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            throw err;
        }

        data = data.replace(/\{style\}/g, locals.style.concat(iconStyle(locals.fileList, locals.displayIcons)))
        data = data.replace(/\{files\}/g, createHtmlFileList(locals.fileList, locals.directory, locals.displayIcons, locals.viewName))
        data = data.replace(/\{directory\}/g, escapeHtml(locals.directory))
        data = data.replace(/\{linked-path\}/g, htmlPath(locals.directory));
        callback(null, data)
    })
} }))


app.listen(3000, () => {
    natTunnel.register('serwer', 'nat-tunnel.tk', 80, '127.0.0.1', 3000)
});
      }
  }