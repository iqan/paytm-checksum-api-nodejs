const log4js = require('log4js');

log4js.configure({
  appenders: { logfile: { type: 'file', filename: 'app.log' }, console: { type: 'console' } },
  categories: { default: { appenders: ['logfile', 'console'], level: 'debug' } }
});

const logger = log4js.getLogger('default');

module.exports = logger;
