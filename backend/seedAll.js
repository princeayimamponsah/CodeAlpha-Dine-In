const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./src/models/MenuItem');
const Table = require('./src/models/Table');
const Reservation = require('./src/models/Reservation');
const Order = require('./src/models/Order');
const User = require('./src/models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dine-in');
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    await Order.deleteMany({});
    console.log('✓ Cleared existing data');

    // ============ SEED MENU ITEMS ============
    const menuItems = await MenuItem.insertMany([
      // Appetizers
      {
        name: 'Bruschetta',
        category: 'appetizers',
        description: 'Crispy bread with tomato, garlic, and basil',
        price: 12.99,
          image: '/images/meals/Bruschetta.jpg',
        stockQuantity: 50,
        thresholdLevel: 10,
        isAvailable: true,
        preparationTime: 5,
        isVegetarian: true,
        isSpicy: false,
      },
      {
        name: 'Calamari Fritti',
        category: 'appetizers',
        description: 'Fried squid with lemon aioli',
        price: 14.99,
          image: '/images/meals/clamari fritti.jpg',
        stockQuantity: 30,
        thresholdLevel: 8,
        isAvailable: true,
        preparationTime: 8,
        isVegetarian: false,
        isSpicy: false,
      },
      {
        name: 'Spring Rolls',
        category: 'appetizers',
        description: 'Crispy vegetable spring rolls with sweet chili dip',
        price: 9.99,
          image: '/images/meals/Spring-Rolls-6.webp',
        stockQuantity: 40,
        thresholdLevel: 10,
        isAvailable: true,
        preparationTime: 6,
        isVegetarian: true,
        isSpicy: false,
      },
      // Main Courses
      {
        name: 'Grilled Salmon',
        category: 'mains',
        description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
        price: 24.99,
          image: '/images/meals/Grilled-Salmon-.jpg',
        stockQuantity: 25,
        thresholdLevel: 5,
        isAvailable: true,
        preparationTime: 15,
        isVegetarian: false,
        isSpicy: false,
      },
      {
        name: 'Beef Ribeye',
        category: 'mains',
        description: 'Premium cut with garlic butter, served with fries',
        price: 28.99,
          image: '/images/meals/ribeye roast.webp',
        stockQuantity: 20,
        thresholdLevel: 5,
        isAvailable: true,
        preparationTime: 18,
        isVegetarian: false,
        isSpicy: false,
      },
      {
        name: 'Pasta Carbonara',
        category: 'mains',
        description: 'Classic Italian pasta with bacon, egg, and cheese',
        price: 16.99,
          image: '/images/meals/carbonara pasta.webp',
        stockQuantity: 35,
        thresholdLevel: 10,
        isAvailable: true,
        preparationTime: 12,
        isVegetarian: false,
        isSpicy: false,
      },
      {
        name: 'Vegetable Risotto',
        category: 'mains',
        description: 'Creamy risotto with seasonal vegetables',
        price: 15.99,
          image: '/images/meals/vegetable Risotto.jpg',
        stockQuantity: 30,
        thresholdLevel: 8,
        isAvailable: true,
        preparationTime: 14,
        isVegetarian: true,
        isSpicy: false,
      },
      // Desserts
      {
        name: 'Tiramisu',
        category: 'desserts',
        description: 'Classic Italian dessert with mascarpone and coffee',
        price: 7.99,
          image: '/images/meals/Tiramisu.jpg',
        stockQuantity: 20,
        thresholdLevel: 5,
        isAvailable: true,
        preparationTime: 2,
        isVegetarian: true,
        isSpicy: false,
      },
      {
        name: 'Chocolate Lava Cake',
        category: 'desserts',
        description: 'Warm chocolate cake with molten center',
        price: 8.99,
          image: '/images/meals/Chocolate Lava Cake.jpg',
        stockQuantity: 15,
        thresholdLevel: 5,
        isAvailable: true,
        preparationTime: 8,
        isVegetarian: true,
        isSpicy: false,
      },
      // Beverages
      {
        name: 'House Red Wine',
        category: 'beverages',
        description: 'Premium red wine blend',
        price: 9.99,
          image: '/images/meals/House Red Wine.jpg',
        stockQuantity: 100,
        thresholdLevel: 20,
        isAvailable: true,
        preparationTime: 1,
        isVegetarian: true,
        isSpicy: false,
      },
      {
        name: 'Iced Tea',
        category: 'beverages',
        description: 'Refreshing house-made iced tea',
        price: 3.99,
          image: '/images/meals/Iced Tea.jpg',
        stockQuantity: 100,
        thresholdLevel: 20,
        isAvailable: true,
        preparationTime: 1,
        isVegetarian: true,
        isSpicy: false,
      },
    ]);
    console.log(`✓ Added ${menuItems.length} menu items`);

    // ============ SEED TABLES ============
    const tables = await Table.insertMany([
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
    ]);
    console.log(`✓ Added ${tables.length} tables`);

    // ============ SEED RESERVATIONS ============
    const now = new Date();
    const reservations = await Reservation.insertMany([
      {
        customerName: 'John Smith',
        phone: '+1 (555) 123-4567',
        email: 'john@example.com',
        table: tables[0]._id,
        reservationTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        guests: 2,
        status: 'confirmed',
        specialRequests: 'Window seat preferred',
      },
      {
        customerName: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        email: 'sarah@example.com',
        table: tables[1]._id,
        reservationTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
        guests: 4,
        status: 'confirmed',
        specialRequests: 'Anniversary celebration',
      },
      {
        customerName: 'Michael Brown',
        phone: '+1 (555) 345-6789',
        email: 'michael@example.com',
        table: tables[2]._id,
        reservationTime: new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
        guests: 6,
        status: 'pending',
        specialRequests: 'Vegetarian options needed',
      },
    ]);
    console.log(`✓ Added ${reservations.length} reservations`);

    // ============ SEED ORDERS ============
    const orders = await Order.insertMany([
      {
        orderNumber: `ORD-${Date.now()}-001`,
        table: tables[0]._id,
        items: [
          {
            menuItem: menuItems[0]._id, // Bruschetta
            quantity: 2,
            unitPrice: 12.99,
            subtotal: 25.98,
            notes: 'No garlic',
            status: 'served',
          },
          {
            menuItem: menuItems[3]._id, // Grilled Salmon
            quantity: 2,
            unitPrice: 24.99,
            subtotal: 49.98,
            notes: 'Medium done',
            status: 'served',
          },
        ],
        subtotal: 75.96,
        tax: 11.39,
        totalAmount: 87.35,
        status: 'completed',
      },
      {
        orderNumber: `ORD-${Date.now()}-002`,
        table: tables[1]._id,
        items: [
          {
            menuItem: menuItems[2]._id, // Spring Rolls
            quantity: 1,
            unitPrice: 9.99,
            subtotal: 9.99,
            notes: '',
            status: 'ready',
          },
          {
            menuItem: menuItems[4]._id, // Beef Ribeye
            quantity: 2,
            unitPrice: 28.99,
            subtotal: 57.98,
            notes: 'Rare',
            status: 'preparing',
          },
          {
            menuItem: menuItems[7]._id, // Chocolate Lava Cake
            quantity: 2,
            unitPrice: 8.99,
            subtotal: 17.98,
            notes: 'Extra ice cream',
            status: 'pending',
          },
        ],
        subtotal: 85.95,
        tax: 12.89,
        totalAmount: 98.84,
        status: 'in-progress',
      },
    ]);
    console.log(`✓ Added ${orders.length} orders`);

    console.log('\n✅ All seed data inserted successfully!');
    console.log('Database is now populated with:');
    console.log(`  • ${menuItems.length} menu items`);
    console.log(`  • ${tables.length} tables`);
    console.log(`  • ${reservations.length} reservations`);
    console.log(`  • ${orders.length} orders`);

    await mongoose.disconnect();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
