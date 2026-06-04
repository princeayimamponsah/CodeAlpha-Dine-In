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
    // Login using existing admin (seeded) or create temp user
    const email = 'admin@dine-in.com';
    const password = 'password123';

    const loginData = JSON.stringify({ email, password });
    const loginOpts = { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) } };
    let login = await request(loginOpts, loginData);
    console.log('login:', login.statusCode, login.body && login.body.message);
    let token = login.body && login.body.data && login.body.data.token;
    if (!token) {
      // Try to register a temporary admin and login again
      console.log('Attempting to register a temporary admin and retry login');
      const regData = JSON.stringify({ name: 'Smoke Admin', email, password, role: 'admin' });
      const regOpts = { hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(regData) } };
      const reg = await request(regOpts, regData);
      console.log('register:', reg.statusCode, reg.body && reg.body.message);
      login = await request(loginOpts, loginData);
      console.log('login(after register):', login.statusCode, login.body && login.body.message);
      token = login.body && login.body.data && login.body.data.token;
      if (!token) {
        console.error('No token returned after register; aborting');
        process.exit(2);
      }
    }

    // Fetch active orders
    const activeOpts = { hostname: 'localhost', port: 5000, path: '/api/orders/active', method: 'GET', headers: { Authorization: `Bearer ${token}` } };
    const active = await request(activeOpts);
    console.log('active orders status:', active.statusCode);
    const orders = active.body && active.body.data;
    if (!orders || orders.length === 0) {
      console.log('No active orders to process.');
      process.exit(0);
    }

    const order = orders[0];
    console.log('Selected order:', order.orderNumber, 'status:', order.orderStatus || order.status);

    const transitions = ['preparing', 'ready', 'served', 'completed'];
    let currentId = order._id;
    for (const status of transitions) {
      console.log(`Updating order ${order.orderNumber} -> ${status}`);
      const updateData = JSON.stringify({ status });
      const updateOpts = { hostname: 'localhost', port: 5000, path: `/api/orders/${currentId}/status`, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(updateData), Authorization: `Bearer ${token}` } };
      const res = await request(updateOpts, updateData);
      console.log(' update response:', res.statusCode, res.body && res.body.message);
      await new Promise((r) => setTimeout(r, 500));
    }

    // Fetch order by id
    const getOpts = { hostname: 'localhost', port: 5000, path: `/api/orders/${currentId}`, method: 'GET', headers: { Authorization: `Bearer ${token}` } };
    const final = await request(getOpts);
    console.log('Final status:', final.statusCode, final.body && final.body.data && (final.body.data.orderStatus || final.body.data.status));

    process.exit(0);
  } catch (err) {
    console.error('error', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
