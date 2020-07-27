# paytm-checksum-api-nodejs
A PayTM checksum api in nodejs to provide backend for Mobile/Web apps


## Getting Started

### Prerequisites
- PayTM developers account
- NodeJS

### Run api
- Update `appConfig.js` with your merchant-id/key and hosturl
- install dependencies
`npm install`
- run app
`npm run start`

### Endpoints
V1 Base url pattern: `http://<host>:<port>/api/v1/paytm/<endpoint>`

#### Examples:
http://localhost:3000/api/v1/paytm/healthcheck - To verify if API is running correctly  
http://localhost:3000/api/v1/paytm/initiatePayment?order_id=123&customer_id=123&amount=10&email=abc@gmail.com - Will redirect to PayTM gateway for payments  
http://localhost:3000/api/v1/paytm/callback - This endpoint is called from PayTM with payload about operation  


### Deploy API to Firebase Cloud Functions
- Create a new directory
- Navigate to it using console
- Install Firebase tools: `npm install -g firebase-tools`
- Login to Firebase: `firebase login`
- Initialize firebase project: `firebase init`  
  - Select your project and Cloud Functions
  - This will create firebase functions project
- Copy `server` folder from this repository to `Functions` folder
- Copy dependencies from package.json (this repository) to that new packages.json (in Functions folder)
- Add below lines to `Functions/index.js` file
```js
const app = require('./server/app');
exports.api = functions.https.onRequest(app);
```
- Cloud function is ready. You can now deploy it using `firebase deploy`
- Check if it is deployed correctly
  - Go to Firebase Cloud Functions
  - Copy Function URL
  - Navigate to: `https://<PROJECT_LOCATION>-<PROJECT_NAME>.cloudfunctions.net/api/api/v1/paytm/healthcheck`
  - You should see text: `working`

You can also refer to `firebase-functions-example`.
