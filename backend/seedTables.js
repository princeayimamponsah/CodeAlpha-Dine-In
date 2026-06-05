const mongoose = require('mongoose');
require('dotenv').config();

const Table = require('./src/models/Table');

const seedTables = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dine-in');
    console.log('Connected to MongoDB');

    // Clear existing tables
    await Table.deleteMany({});
    console.log('Cleared existing tables');

    // Define table data
    const tables = [
      {
        tableNumber: 1,
        capacity: 2,
        status: 'available',
        location: 'main',
        notes: 'Window seat',
        isActive: true,
      },
      {
        tableNumber: 2,
        capacity: 4,
        status: 'available',
        location: 'main',
        notes: '',
        isActive: true,
      },
      {
        tableNumber: 3,
        capacity: 6,
        status: 'available',
        location: 'main',
        notes: 'Good for groups',
        isActive: true,
      },
      {
        tableNumber: 4,
        capacity: 2,
        status: 'available',
        location: 'patio',
        notes: 'Outdoor seating',
        isActive: true,
      },
      {
        tableNumber: 5,
        capacity: 8,
        status: 'available',
        location: 'private',
        notes: 'Private dining room',
        isActive: true,
      },
      {
        tableNumber: 6,
        capacity: 4,
        status: 'available',
        location: 'main',
        notes: '',
        isActive: true,
      },
      {
        tableNumber: 7,
        capacity: 4,
        status: 'available',
        location: 'main',
        notes: '',
        isActive: true,
      },
      {
        tableNumber: 8,
        capacity: 2,
        status: 'available',
        location: 'main',
        notes: 'Bar seating',
        isActive: true,
      },
    ];

    // Insert tables
    const createdTables = await Table.insertMany(tables);
    console.log(`✓ Successfully added ${createdTables.length} tables to the database`);

    // Display created tables
    createdTables.forEach((table) => {
      console.log(
        `  Table ${table.tableNumber}: Capacity ${table.capacity}, Status: ${table.status}`
      );
    });

    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tables:', error.message);
    process.exit(1);
  }
};

seedTables();
