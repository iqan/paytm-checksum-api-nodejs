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
http://localhost:3000/api/v1/paytm/initiatePayment - Will redirect to PayTM gateway for payments
http://localhost:3000/api/v1/paytm/callback - This endpoint is called from PayTM with payload about operation

