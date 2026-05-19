// Seed data for MongoDB
// Run this in MongoDB shell or use mongosh to populate initial data

db.users.insertMany([
  {
    name: "Admin User",
    email: "admin@dine-in.com",
    password: "$2a$10$D9Z.TP.B.4KM/0H6Hc1tKe7.Z5q5.q5q5q5q5q5q5q5q5q5q5q5q5q5", // password123
    role: "admin",
    phone: "+1 (555) 000-0001",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Staff Member",
    email: "staff@dine-in.com",
    password: "$2a$10$D9Z.TP.B.4KM/0H6Hc1tKe7.Z5q5.q5q5q5q5q5q5q5q5q5q5q5q5q5", // password123
    role: "staff",
    phone: "+1 (555) 000-0002",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.menuitems.insertMany([
  {
    name: "Caesar Salad",
    category: "appetizers",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 9.99,
    image: "https://via.placeholder.com/300x200?text=Caesar+Salad",
    stockQuantity: 50,
    thresholdLevel: 5,
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Grilled Salmon",
    category: "mains",
    description: "Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 24.99,
    image: "https://via.placeholder.com/300x200?text=Grilled+Salmon",
    stockQuantity: 30,
    thresholdLevel: 5,
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: false,
    isSpicy: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Spicy Chicken Curry",
    category: "mains",
    description: "Tender chicken in aromatic curry sauce with rice",
    price: 16.99,
    image: "https://via.placeholder.com/300x200?text=Chicken+Curry",
    stockQuantity: 40,
    thresholdLevel: 5,
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: false,
    isSpicy: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chocolate Cake",
    category: "desserts",
    description: "Rich chocolate cake with chocolate frosting",
    price: 7.99,
    image: "https://via.placeholder.com/300x200?text=Chocolate+Cake",
    stockQuantity: 25,
    thresholdLevel: 5,
    isAvailable: true,
    preparationTime: 2,
    isVegetarian: true,
    isSpicy: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Iced Coffee",
    category: "beverages",
    description: "Cold brewed coffee with ice and milk",
    price: 4.99,
    image: "https://via.placeholder.com/300x200?text=Iced+Coffee",
    stockQuantity: 100,
    thresholdLevel: 10,
    isAvailable: true,
    preparationTime: 3,
    isVegetarian: true,
    isSpicy: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.tables.insertMany([
  {
    tableNumber: 1,
    capacity: 2,
    status: "available",
    location: "main",
    currentOrder: null,
    currentReservation: null,
    notes: "Window seat",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    tableNumber: 2,
    capacity: 4,
    status: "available",
    location: "main",
    currentOrder: null,
    currentReservation: null,
    notes: "",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    tableNumber: 3,
    capacity: 6,
    status: "available",
    location: "main",
    currentOrder: null,
    currentReservation: null,
    notes: "Good for groups",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    tableNumber: 4,
    capacity: 2,
    status: "available",
    location: "patio",
    currentOrder: null,
    currentReservation: null,
    notes: "Outdoor seating",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    tableNumber: 5,
    capacity: 8,
    status: "available",
    location: "private",
    currentOrder: null,
    currentReservation: null,
    notes: "Private dining room",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Seed data inserted successfully!");
