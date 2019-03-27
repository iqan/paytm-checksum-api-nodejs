const router = require('express').Router();

const paytmRoutes = require('./paytm');

router.use('/paytm', paytmRoutes);

module.exports = router;
