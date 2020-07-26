let express = require('express');
let app = express();
const middleware = require('./app.middleware');
const apiV1 = require('./api/v1');

// express middleware
middleware.setMiddleware(app);

// api configuration
app.use('/api/v1/', apiV1);

// additional routes
app.use('*', (req, res) => {
  res.status(404).send('Endpoint not found');
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  } else {
    res.status(500).send('Something went wrong!')
  }
});

module.exports = app;
