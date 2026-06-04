const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ statusCode: res.statusCode, body: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const ts = Date.now();
    const email = `smoke+${ts}@example.com`;
    const password = 'SmokePass!23';

    const regData = JSON.stringify({ name: 'Smoke Test Admin', email, password, role: 'admin' });
    const regOpts = { hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(regData) } };
    const reg = await request(regOpts, regData);
    console.log('register:', reg.statusCode, reg.body && reg.body.message);

    const loginData = JSON.stringify({ email, password });
    const loginOpts = { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) } };
    const login = await request(loginOpts, loginData);
    console.log('login:', login.statusCode, login.body && login.body.message);

    const token = login.body && login.body.data && login.body.data.token;
    if (!token) {
      console.error('No token returned, aborting');
      process.exit(2);
    }

    const ordersOpts = { hostname: 'localhost', port: 5000, path: '/api/orders', method: 'GET', headers: { Authorization: `Bearer ${token}` } };
    const orders = await request(ordersOpts);
    console.log('orders:', orders.statusCode, Array.isArray(orders.body) ? `${orders.body.length} items` : orders.body);

    process.exit(0);
  } catch (err) {
    console.error('error', err && err.message ? err.message : err);
    process.exit(3);
  }
})();
