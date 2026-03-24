const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_TOKEN';
const PROJECT_ID = 'prj_LbMDQ4X3Fyr0TaQBAhIC3KZRsDAx';
const NEW_NAME = 'basevote';

const data = JSON.stringify({ name: NEW_NAME });

const options = {
  hostname: 'api.vercel.com',
  port: 443,
  path: `/v9/projects/${PROJECT_ID}`,
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
