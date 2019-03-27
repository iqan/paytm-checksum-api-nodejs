let express = require('express');
let app = express();
const middleware = require('./app.middleware');
const apiV1 = require('./api/v1');

// express middleware
middleware.setMiddleware(app);

// api configuration
app.use('/api/v1/', apiV1);

module.exports = app;
