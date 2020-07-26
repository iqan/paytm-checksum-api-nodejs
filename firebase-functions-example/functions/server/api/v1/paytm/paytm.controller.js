const https = require('https');
const log = require('../../../logging');
const PaytmConfig = require('../../../config').paytmConfig;
const appConfig = require('../../../config').appConfig;
const checksum_lib = require('../checksum');

const healthcheck = (req, res) => {
  res.send('Working').status(200);
};

const initiatePayment = (req, res) => {
  try {
    var queryParams = req.query;
    log.debug('query param', queryParams);
    log.info('initiating payment');
    var params = {};
    params['MID'] = PaytmConfig.mid;
    params['WEBSITE'] = PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = queryParams.order_id;
    params['CUST_ID'] = queryParams.customer_id;
    params['TXN_AMOUNT'] = queryParams.amount;
    params['CALLBACK_URL'] = `${appConfig.hostUrl}:${appConfig.port}/api/v1/paytm/callback`;
    params['EMAIL'] = queryParams.email;
  
    checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
      log.info('generated checksum: ', checksum);
      var txn_url = PaytmConfig.transactionUrl;
      var form_fields = "";
      for (var x in params) {
        form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
      }
      form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
      const htmlHeader = '<head><title>Checkout Page</title></head>';
      const htmlForm = `<form method="post" action="${txn_url}" name="f1">${form_fields}</form>`;
      const htmlScript = '<script type="text/javascript">document.f1.submit();</script>';
      const htmlBody = `<body><center><h1>Please do not refresh this page...</h1></center>${htmlForm}${htmlScript}</body>`;
  
      res.clearCookie("TXNID");
      res.clearCookie("STATUS");
      res.clearCookie("RESPCODE");
      res.clearCookie("RESPMSG");
      res.clearCookie("TXNDATE");
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`<html>${htmlHeader}${htmlBody}</html>`);
      res.end();
    });  
  } catch (error) {
    log.error(error);
    res.status(500).send('Something went wrong');
  }
};

const callback = (req, res) => {
  try {
    log.info('confirming order');
    log.info('req body', req.body);
    let body = req.body;
    log.debug('received complete callback request');
    var post_data = body;
  
    // received params in callback
    log.info('Callback Response: ', post_data, "\n");
  
    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(post_data, PaytmConfig.key, checksumhash);
    log.info("Checksum Result => ", result, "\n");
  
    // Send Server-to-Server request to verify Order Status
    var params = { "MID": PaytmConfig.mid, "ORDERID": post_data.ORDERID };
  
    checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
      log.info('generated checksum for verification: ', checksum);
      params.CHECKSUMHASH = checksum;
      post_data = 'JsonData=' + JSON.stringify(params);
  
      var options = {
        hostname: PaytmConfig.hostName,
        port: 443,
        path: '/merchant-status/getTxnStatus',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
        }
      };
  
      // Set up the request
      var response = "";
      log.info('Checking transaction status');
      var post_req = https.request(options, function (post_res) {
        post_res.on('data', function (chunk) {
          log.debug('receiving data...');
          response += chunk;
        });
  
        post_res.on('end', function () {
          log.info('S2S Response: ', response, "\n");
          const parsedJson = JSON.parse(response);
          res.cookie('TXNID', parsedJson.TXNID);
          res.cookie('STATUS', parsedJson.STATUS);
          res.cookie('RESPCODE', parsedJson.RESPCODE);
          res.cookie('RESPMSG', parsedJson.RESPMSG);
          res.cookie('TXNDATE', parsedJson.TXNDATE);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(response);
          res.end();
        });
      });
  
      // post the data
      post_req.write(post_data);
      post_req.on('error', (err) => {
        log.error('Error occurred while checking transation status', err);
      });
      post_req.end();
    }); 
  } catch (error) {
    log.error(error);
    res.status(500).send('Something went wrong');
  }
};

module.exports = {
  healthcheck,
  initiatePayment,
  callback
}