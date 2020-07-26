const app = require('../app');
const appConfig = require('../config').appConfig;
const log = require('../logging');

const port = appConfig.port;
const server = require('http').createServer(app);

server.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
