const functions = require('firebase-functions');
const app = require('./server/app');

exports.api = functions.https.onRequest(app);