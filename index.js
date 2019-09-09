const express = require('express');
const serveIndex = require('serve-index');
const natTunnel = require('nat-tunnel');
const escapeHtml = require('escape-html');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { iconStyle } = require('./icons');
const { init } = require('./htmlUtils');

const app = express();

module.exports = {
  share: () => {
    // generate unique base path
    const basePath = crypto.randomBytes(8).toString('hex');

    // select some random port from 30000-40000 range
    const port = Math.round(Math.random() * (40000 - 30000) + 30000);

    const htmlUtils = init(basePath);

    app.use(
      '/',
      express.static(process.cwd()),
      serveIndex(process.cwd(), {
        icons: true,
        template: (locals, callback) => {
          fs.readFile(
            path.join(__dirname, 'public/template.html'),
            { encoding: 'utf8' },
            (err, data) => {
              if (err) {
                throw err;
              }

              let template = data;

              template = template.replace(
                /\{style\}/g,
                locals.style.concat(
                  iconStyle(locals.fileList, locals.displayIcons),
                ),
              ).replace(
                /\{files\}/g,
                htmlUtils.createHtmlFileList(
                  locals.fileList,
                  locals.directory,
                  locals.displayIcons,
                  locals.viewName,
                ),
              ).replace(
                /\{directory\}/g,
                escapeHtml(locals.directory),
              ).replace(
                /\{linked-path\}/g,
                htmlUtils.htmlPath(locals.directory),
              );

              callback(null, template);
            },
          );
        },
      }),
    );

    const server = app.listen(port, () => {
      natTunnel.register(basePath, process.env.SHAREDIR_PROVIDER_HOST || 'nat-tunnel.tk',
        process.env.SHAREDIR_PROVIDER_PORT || 80, '0.0.0.0', port);
    });

    server.timeout = 86400000; // prevent express from closing tunnel for 24h
  },
};
