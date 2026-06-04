(async () => {
  const base = 'http://localhost:5000';
  const admin = { email: 'admin@dine-in.com', password: 'password123' };

  try {
    console.log('Checking backend health...');
    let res = await fetch(`${base}/health`);
    if (!res.ok) throw new Error('Backend health check failed: ' + res.status);
    console.log('Backend healthy');

    console.log('Logging in as admin...');
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });
    const login = await res.json();
    if (!res.ok) throw new Error('Login failed: ' + (login.message || res.status));
    const token = login.data?.token || login.token || login.accessToken;
    if (!token) throw new Error('No token returned from login');
    console.log('Logged in, token received');

    const item = {
      name: 'SMOKE TEST DISH ' + Date.now(),
      category: 'specials',
      description: 'Temp item for smoke test',
      price: 9.99,
      stockQuantity: 10,
      image: '',
      isVegetarian: false,
      isSpicy: false,
      isPopular: false,
      isAvailable: true,
    };

    console.log('Creating menu item...');
    res = await fetch(`${base}/api/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(item),
    });
    const created = await res.json();
    if (!res.ok) throw new Error('Create failed: ' + (created.message || res.status));
    const newId = created.data?._id || created._id;
    console.log('Created item id:', newId);

    console.log('Updating menu item name...');
    res = await fetch(`${base}/api/menu/${newId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ name: item.name + ' (updated)' }),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error('Update failed: ' + (updated.message || res.status));
    console.log('Updated item');

    console.log('Deleting menu item...');
    res = await fetch(`${base}/api/menu/${newId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    const deleted = await res.json();
    if (!res.ok) throw new Error('Delete failed: ' + (deleted.message || res.status));
    console.log('Deleted item successfully');

    console.log('Smoke test completed successfully');
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exitCode = 2;
  }
})();
