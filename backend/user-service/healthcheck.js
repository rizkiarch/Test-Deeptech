import http from 'http';
import ENV from './src/config/env.js';

const options = {
    host: 'localhost',
    port: ENV.PORT || 5001,
    path: '/api/health',
    timeout: 2000
};

const request = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', (err) => {
    console.log('ERROR:', err.message);
    process.exit(1);
});

request.end();