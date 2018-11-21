const sendEmail = require('../app/utils/email')

module.exports = (appInfo) => {
  const config = {
    version: 'v1.7.1',
    keys: `${appInfo.name}123456`,
    targetUrl: 'http://df-gray.zhiyitech.cn/',
    notfound: {
      pageUrl: '/error/404',
    },
    view: {
      defaultViewEngine: 'nunjucks',
      defaultExtension: '.jsp',
      mapping: {
        '.jsp': 'nunjucks',
        '.html': 'nunjucks',
        '.nj': 'nunjucks',
      },
    },
    nunjucks: {
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
      }
    },
    security: {
      'csrf': {
        enable: false,
      },
      'xframe': {
        enable: false,
      }
    },
    onerror: {
      all(err, ctx) {
        sendEmail(err, ctx)
      },
    },
    alinode: {
      server: 'wss://agentserver.node.aliyun.com:8080',
      appid: '51990',
      secret: '0b0df124231598cedcb188b02d0ec0eca039d3da',
      logdir: '/tmp/',
      error_log: [
        '/root/.logs/error.#YYYY#-#MM#-#DD#.log',
      ]
    }
  }
  return config
}
