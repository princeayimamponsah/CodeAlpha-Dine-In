(async () => {
  try {
    // Step 1: Get table
    const tables = await fetch('http://localhost:5001/api/tables').then(r => r.json());
    const tid = tables.data?.[0]?._id || tables.tables?.[0]?._id;
    console.log('✓ Table ID:', tid ? 'found' : 'NOT FOUND');

    // Step 2: Signup
    const email = 'e2e-' + Date.now() + '@test.io';
    const signup = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password: 'Pass12345!' })
    });
    const sj = await signup.json();
    const token = sj.data?.token;
    console.log('✓ Signup:', signup.status === 201 ? 'SUCCESS' : 'FAILED');

    // Step 3: Reservation Create
    const res = await fetch('http://localhost:5001/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        tableId: tid,
        customerName: 'John Doe',
        phone: '+233241234567',
        guests: 4,
        reservationTime: '2026-05-19T18:00:00Z'
      })
    });
    console.log('🔴 RESERVATION CREATE:', res.status === 201 ? '✅ SUCCESS' : `❌ FAILED (${res.status})`);
    if (res.status !== 201) {
      const rj = await res.json();
      console.log('   Error:', rj.message);
    }

    // Step 4: Get menu items
    const menu = await fetch('http://localhost:5001/api/menu').then(r => r.json());
    const mid = menu.data?.[0]?._id || menu.items?.[0]?._id;
    console.log('✓ Menu Item ID:', mid ? 'found' : 'NOT FOUND');

    // Step 5: Order Create
    if (tid && token && mid) {
      const ord = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          tableId: tid,
          items: [{ menuItemId: mid, quantity: 1 }],
          specialInstructions: 'test'
        })
      });
      console.log('🔴 ORDER CREATE:', ord.status === 201 ? '✅ SUCCESS' : `❌ FAILED (${ord.status})`);
      if (ord.status !== 201) {
        const oj = await ord.json();
        console.log('   Error:', oj.message);
      }
    }

    console.log('\n✅ Test sequence complete');
  } catch (e) {
    console.error('❌ Test failed:', e.message);
  }
})();
