const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../src/models/Order');

const runMigration = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI or MONGODB_URI is required');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const paymentStatusResult = await Order.updateMany(
    { paymentStatus: { $in: ['unpaid', 'partial'] } },
    { $set: { paymentStatus: 'pending' } }
  );

  const paymentMethodResult = await Order.updateMany(
    { paymentMethod: { $in: ['upi', 'online'] } },
    { $set: { paymentMethod: 'mobile_money' } }
  );

  console.log('Payment status updates:', paymentStatusResult.modifiedCount);
  console.log('Payment method updates:', paymentMethodResult.modifiedCount);

  await mongoose.disconnect();
  console.log('Migration completed');
};

runMigration().catch(async (error) => {
  console.error('Migration failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // no-op
  }
  process.exit(1);
});
