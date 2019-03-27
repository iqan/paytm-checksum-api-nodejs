const appConfig = {
  port: process.env.PORT || 3000,
  hostUrl: process.env.HOST_URL || `http://localhost`
};

const logConfig = {
  level: process.env.LOG_LEVEL || 'debug'
};

var paytmConfig = {
	mid: process.env.PAYTM_MERCH_ID || '<YOUR-MERCH-ID>',
	key: process.env.PAYTM_MERCH_KEY || '<YOUR-MERCH-KEY>',
  website: process.env.PAYTM_MERCH_WEBSITE || 'WEBSTAGING',
  transactionUrl: process.env.PAYTM_TXN_URL || 'https://securegw-stage.paytm.in/theia/processTransaction',
  hostName: process.env.PAYTM_HOST || 'securegw-stage.paytm.in'
};

module.exports = {
  appConfig,
  logConfig,
  paytmConfig
}
