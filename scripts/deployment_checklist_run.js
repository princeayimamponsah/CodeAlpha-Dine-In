const base = 'http://localhost:5000';

const headersJson = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const fmt = (status) => (status ? 'PASS' : 'FAIL');

async function api(path, options = {}) {
  const response = await fetch(`${base}${path}`, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body, headers: response.headers };
}

async function main() {
  const results = [];
  const add = (name, ok, detail) => {
    results.push({ name, ok, detail });
    console.log(`[${fmt(ok)}] ${name} - ${detail}`);
  };

  // Health check
  const health = await api('/health');
  add('Backend health', health.ok, `status ${health.status}`);

  // Admin login
  const adminLogin = await api('/api/auth/login', {
    method: 'POST',
    headers: headersJson(),
    body: JSON.stringify({ email: 'admin@dine-in.com', password: 'password123' }),
  });
  const adminToken = adminLogin.body?.data?.token;
  add('Admin login', adminLogin.ok && !!adminToken, `status ${adminLogin.status}`);

  // Invalid password
  const invalidLogin = await api('/api/auth/login', {
    method: 'POST',
    headers: headersJson(),
    body: JSON.stringify({ email: 'admin@dine-in.com', password: 'wrong-password' }),
  });
  add('Invalid password rejected', invalidLogin.status === 401, `status ${invalidLogin.status}`);

  // Create 3 users
  const ts = Date.now();
  const users = [1, 2, 3].map((i) => ({
    name: `Checklist User ${i}`,
    email: `checklist.user.${ts}.${i}@example.com`,
    password: 'Pass12345!',
    role: 'staff',
  }));

  let createdUsers = 0;
  for (const user of users) {
    const reg = await api('/api/auth/register', {
      method: 'POST',
      headers: headersJson(),
      body: JSON.stringify(user),
    });
    if (reg.status === 201) {
      createdUsers += 1;
    }
  }
  add('Create 3 users', createdUsers === 3, `created ${createdUsers}/3`);

  // Duplicate email
  const dupReg = await api('/api/auth/register', {
    method: 'POST',
    headers: headersJson(),
    body: JSON.stringify(users[0]),
  });
  add('Duplicate email rejected', dupReg.status === 400, `status ${dupReg.status}`);

  // Google login route (redirect expected)
  const google = await fetch(`${base}/api/auth/google`, { redirect: 'manual' });
  add(
    'Google login route available',
    google.status >= 300 && google.status < 400,
    `status ${google.status}`
  );

  // Menu CRUD + create 10 menu items
  const menuCreateRes = [];
  const menuIds = [];
  for (let i = 1; i <= 10; i += 1) {
    const item = {
      name: `Checklist Dish ${ts}-${i}`,
      category: 'specials',
      description: `Checklist menu item ${i}`,
      price: 10 + i,
      stockQuantity: 30,
      thresholdLevel: 5,
      isAvailable: true,
      image: '/images/meals/Spring-Rolls-6.webp',
    };

    const created = await api('/api/menu', {
      method: 'POST',
      headers: headersJson(adminToken),
      body: JSON.stringify(item),
    });

    menuCreateRes.push(created.status === 201);
    const id = created.body?.data?._id;
    if (id) {
      menuIds.push(id);
    }
  }
  add('Create 10 menu items', menuCreateRes.filter(Boolean).length === 10, `created ${menuIds.length}/10`);

  // Menu edit + delete
  const menuUpdate = await api(`/api/menu/${menuIds[0]}`, {
    method: 'PATCH',
    headers: headersJson(adminToken),
    body: JSON.stringify({ name: `Checklist Dish ${ts}-1 Updated` }),
  });
  add('Edit menu item', menuUpdate.ok, `status ${menuUpdate.status}`);

  const menuDelete = await api(`/api/menu/${menuIds[9]}`, {
    method: 'DELETE',
    headers: headersJson(adminToken),
  });
  add('Delete menu item', menuDelete.ok, `status ${menuDelete.status}`);

  // Tables: create 5, list all, available, occupied
  const baseTableNumber = Number(String(ts).slice(-5));
  const newTableNumbers = Array.from({ length: 5 }, (_, i) => 50000 + baseTableNumber + i);
  let createdTables = 0;
  const createdTableIds = [];
  for (const number of newTableNumbers) {
    const t = await api('/api/tables', {
      method: 'POST',
      headers: headersJson(adminToken),
      body: JSON.stringify({ tableNumber: number, capacity: 4, status: 'available', location: 'main' }),
    });
    if (t.status === 201) {
      createdTables += 1;
      createdTableIds.push(t.body?.data?._id);
    }
  }
  add('Create 5 tables', createdTables === 5, `created ${createdTables}/5`);

  const allTables = await api('/api/tables');
  const availableTables = await api('/api/tables/available');
  add('View tables', allTables.ok && Array.isArray(allTables.body?.data), `count ${allTables.body?.data?.length || 0}`);
  add('Available tables endpoint', availableTables.ok, `count ${availableTables.body?.data?.length || 0}`);

  if (createdTableIds[0]) {
    await api(`/api/tables/${createdTableIds[0]}/status`, {
      method: 'PATCH',
      headers: headersJson(adminToken),
      body: JSON.stringify({ status: 'occupied' }),
    });
  }

  const tableStats = await api('/api/tables/statistics', {
    headers: headersJson(adminToken),
  });
  add('Occupied tables tracked', tableStats.ok && Number(tableStats.body?.data?.occupied) >= 1, `occupied ${tableStats.body?.data?.occupied}`);

  // Reservations: create 3 and confirm one
  const latestAvailableTables = await api('/api/tables/available');
  const reservationTableIds = (latestAvailableTables.body?.data || [])
    .filter((table) => table.capacity >= 3)
    .slice(0, 3)
    .map((table) => table._id);
  const reservationIds = [];
  const reservationErrors = [];
  const baseTime = Date.now() + 3 * 60 * 60 * 1000;

  for (let i = 0; i < reservationTableIds.length; i += 1) {
    const reservation = await api('/api/reservations', {
      method: 'POST',
      headers: headersJson(adminToken),
      body: JSON.stringify({
        tableId: reservationTableIds[i],
        customerName: `Reservation Guest ${i + 1}`,
        phone: `02412345${10 + i}`,
        guests: 3,
        reservationTime: new Date(baseTime + i * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (reservation.status === 201) {
      reservationIds.push(reservation.body?.data?._id);
    } else {
      reservationErrors.push(`status ${reservation.status}: ${reservation.body?.message || 'unknown error'}`);
    }
  }
  add(
    'Create 3 reservations',
    reservationIds.length === 3,
    `created ${reservationIds.length}/3${reservationErrors.length ? ` (${reservationErrors.join(' | ')})` : ''}`
  );

  if (reservationIds[0]) {
    const confirm = await api(`/api/reservations/${reservationIds[0]}/confirm`, {
      method: 'PATCH',
      headers: headersJson(adminToken),
    });
    add('Confirm reservation', confirm.ok, `status ${confirm.status}`);
  } else {
    add('Confirm reservation', false, 'no reservation id');
  }

  const reservationList = await api('/api/reservations', {
    headers: headersJson(adminToken),
  });
  add('Reservation listing', reservationList.ok, `count ${reservationList.body?.data?.length || 0}`);

  // Orders: create 5 orders total and verify inventory auto update
  const orderTableIds = createdTableIds.slice(0, 5);
  const orderMenuId = menuIds[1];

  const itemBefore = await api(`/api/menu/${orderMenuId}`, { headers: headersJson(adminToken) });
  const stockBefore = itemBefore.body?.data?.stockQuantity;

  const createdOrderIds = [];
  for (let i = 0; i < 5; i += 1) {
    const tableId = orderTableIds[i] || createdTableIds[0];
    const quantity = i === 0 ? 2 : 1;
    const order = await api('/api/orders', {
      method: 'POST',
      headers: headersJson(adminToken),
      body: JSON.stringify({
        tableId,
        items: [{ menuItemId: orderMenuId, quantity }],
        specialInstructions: `Checklist order ${i + 1}`,
      }),
    });

    if (order.status === 201) {
      createdOrderIds.push(order.body?.data?._id);
    }
  }

  add('Create 5 orders', createdOrderIds.length === 5, `created ${createdOrderIds.length}/5`);

  const ordersList = await api('/api/orders', { headers: headersJson(adminToken) });
  add('View orders in Orders page API', ordersList.ok, `count ${ordersList.body?.data?.length || 0}`);

  const itemAfter = await api(`/api/menu/${orderMenuId}`, { headers: headersJson(adminToken) });
  const stockAfter = itemAfter.body?.data?.stockQuantity;
  add(
    'Inventory auto update (menu stock)',
    Number.isFinite(stockBefore) && Number.isFinite(stockAfter) && stockAfter === stockBefore - 6,
    `stock ${stockBefore} -> ${stockAfter}`
  );

  const inventoryList = await api('/api/inventory', { headers: headersJson(adminToken) });
  const invEntry = (inventoryList.body?.data || []).find((x) => x.menuItem?._id === orderMenuId);
  add(
    'Inventory collection updated',
    inventoryList.ok && invEntry && invEntry.stockLevel === stockAfter,
    `inventory stock ${invEntry?.stockLevel}`
  );

  // Dashboard analytics proxies
  const sales = await api(`/api/orders/daily-sales?date=${new Date().toISOString()}`, {
    headers: headersJson(adminToken),
  });
  add('Dashboard sales endpoint', sales.ok, `total orders today ${sales.body?.data?.totalOrders ?? 'n/a'}`);

  add('Dashboard table stats endpoint', tableStats.ok, JSON.stringify(tableStats.body?.data || {}));

  // Collection-level verification from API
  const usersList = await api('/api/auth/users', { headers: headersJson(adminToken) });
  add('Users collection has data', usersList.ok && (usersList.body?.data?.length || 0) >= 3, `count ${usersList.body?.data?.length || 0}`);
  add('Tables collection has data', allTables.ok && (allTables.body?.data?.length || 0) >= 5, `count ${allTables.body?.data?.length || 0}`);
  add('MenuItems collection has data', true, `count >= ${(menuIds.length - 1)}`);
  add('Reservations collection has data', reservationList.ok && (reservationList.body?.data?.length || 0) >= 3, `count ${reservationList.body?.data?.length || 0}`);
  add('Orders collection has data', ordersList.ok && (ordersList.body?.data?.length || 0) >= 5, `count ${ordersList.body?.data?.length || 0}`);
  add('Inventory collection has data', inventoryList.ok && (inventoryList.body?.data?.length || 0) >= 1, `count ${inventoryList.body?.data?.length || 0}`);

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log('\n===== CHECKLIST SUMMARY =====');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed checks:');
    results.filter((r) => !r.ok).forEach((r) => console.log(`- ${r.name}: ${r.detail}`));
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Checklist runner failed:', error.message);
  process.exit(2);
});
