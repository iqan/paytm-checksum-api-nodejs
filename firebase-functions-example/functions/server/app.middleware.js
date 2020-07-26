const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const log = require('./logging');

log.info('Setting up API middleware');

const setMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  morgan.token('time', () => new Date().toISOString());
  app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));
}

module.exports = {
  setMiddleware
};
