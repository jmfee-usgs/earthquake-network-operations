'use strict';

var config = require('./config');


var MOUNT_PATH = config.ini.MOUNT_PATH;


var addMiddleware = function (connect, options, middlewares) {
  middlewares.unshift(
    function (request, response, next) {
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.setHeader('Access-Control-Allow-Headers',
          'accept,origin,authorization,content-type');
      return next();
    },
    require('grunt-connect-rewrite/lib/utils').rewriteRequest,
    require('grunt-connect-proxy/lib/utils').proxyRequest,
    require('gateway')(options.base[0], {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    })
  );
  return middlewares;
};


var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: config.templatePort,
      rewrite: {
        '^/theme': ''
      }
    }
  ],

  rules: [
    {
      from: '^' + MOUNT_PATH + '/telemetry.json(.*)$',
      to: '/telemetry.json.php$1'
    },
    {
      from: '^' + MOUNT_PATH + '/telemetry.html$',
      to: '/telemetry.html.php'
    },
    {
      from: '^' + MOUNT_PATH + '/(.*)$',
      to: '/$1'
    }
  ],

  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs'
      ],
      livereload: config.liveReloadPort,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.buildPort +
          MOUNT_PATH + '/telemetry.html',
      port: config.buildPort
    }
  },

  dist: {
    options: {
      base: [
        config.dist + '/htdocs'
      ],
      port: config.distPort,
      keepalive: true,
      open: 'http://localhost:' + config.distPort +
          MOUNT_PATH + '/telemetry.html',
      middleware: addMiddleware
    }
  },

  example: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src + '/htdocs',
        config.etc
      ],
      middleware: addMiddleware,
      open: 'http://localhost:' + config.examplePort + '/example.php',
      port: config.examplePort
    }
  },

  template: {
    options: {
      base: [
        'node_modules/hazdev-template/dist/htdocs'
      ],
      port: config.templatePort,
      middleware: addMiddleware
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        config.build + '/' + config.test,
        config.etc,
        'node_modules'
      ],
      port: config.testPort,
      open: 'http://localhost:' + config.testPort + '/test.html'
    }
  }
};


module.exports = connect;
