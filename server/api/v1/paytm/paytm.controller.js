const https = require('https');
const log = require('../../../logging');
const PaytmConfig = require('../../../config').paytmConfig;
const appConfig = require('../../../config').appConfig;
const checksum_lib = require('../checksum');

const healthcheck = (req, res) => {
  res.send('Working').status(200);
};

const initiatePayment = (req, res) => {
  log.info('initiating payment');
  var params = {};
  params['MID'] = PaytmConfig.mid;
  params['WEBSITE'] = PaytmConfig.website;
  params['CHANNEL_ID'] = 'WEB';
  params['INDUSTRY_TYPE_ID'] = 'Retail';
  params['ORDER_ID'] = 'TEST_' + new Date().getTime();
  params['CUST_ID'] = 'Customer001';
  params['TXN_AMOUNT'] = '1.00';
  params['CALLBACK_URL'] = `${appConfig.hostUrl}:${appConfig.port}/api/v1/paytm/callback`;
  params['EMAIL'] = 'abc@mailinator.com';

  checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
    log.info('generated checksum: ', checksum);
    var txn_url = PaytmConfig.transactionUrl;
    var form_fields = "";
    for (var x in params) {
      form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
    }
    form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

    const htmlHeader = '<head><title>Shoon-Chokdi Checkout Page</title></head>';
    const htmlForm = `<form method="post" action="${txn_url}" name="f1">${form_fields}</form>`;
    const htmlScript = '<script type="text/javascript">document.f1.submit();</script>';
    const htmlBody = `<body><center><h1>Please do not refresh this page...</h1></center>${htmlForm}${htmlScript}</body>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<html>${htmlHeader}${htmlBody}</html>`);
    res.end();
  });
};

const callback = (req, res) => {
  log.info('confirming order');
  log.info('req body', req.body);
  let body = req.body;
  log.debug('received complete callback request');
  var html = "";
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

        var _result = JSON.parse(response);
        html += "<b>Status Check Response</b><br>";
        for (var x in _result) {
          html += x + " => " + _result[x] + "<br/>";
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
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
};

module.exports = {
  healthcheck,
  initiatePayment,
  callback
}