const crypto = require('crypto');
const express = require('express');
const natTunnel = require('nat-tunnel');

const app = express();

module.exports = {
  share: (customName) => {
    // generate unique base path
    const basePath = customName || crypto.randomBytes(8).toString('hex');

    // select some random port from 30000-40000 range
    const port = Math.round(Math.random() * (40000 - 30000) + 30000);

    const serveIndex = require('serve-index')(basePath);

    app.use(
      '/',
      express.static(process.cwd()),
      serveIndex(process.cwd(), {
        icons: true,
      }),
    );

    const server = app.listen(port, () => {
      natTunnel.register(basePath, process.env.SHAREDIR_PROVIDER_HOST || 'nat-tunnel.tk',
        process.env.SHAREDIR_PROVIDER_PORT || 80, '0.0.0.0', port);
    });

    server.timeout = 86400000; // prevent express from closing tunnel for 24h
  },
};
