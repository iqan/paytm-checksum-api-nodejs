const router = require('express').Router();
const controller = require('./paytm.controller');

router.get('/healthcheck', controller.healthcheck);
router.get('/initiatePayment', controller.initiatePayment);
router.post('/callback', controller.callback);

module.exports = router;