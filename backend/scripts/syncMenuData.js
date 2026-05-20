require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');
const Inventory = require('../src/models/Inventory');

const menuItems = [
  { name: 'French Onion Soup', category: 'appetizers', description: 'Classic caramelized onion soup with toasted bread and melted cheese', price: 32.0, stockQuantity: 35, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 10 },
  { name: 'Minestrone Soup', category: 'appetizers', description: 'Hearty vegetable and bean soup in tomato broth', price: 28.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 10 },
  { name: 'Chicken Wings', category: 'appetizers', description: 'Crispy wings tossed in house hot sauce', price: 42.0, stockQuantity: 45, thresholdLevel: 8, isVegetarian: false, isSpicy: true, preparationTime: 12 },
  { name: 'Loaded Nachos', category: 'appetizers', description: 'Corn chips with cheese, salsa, and jalapenos', price: 45.0, stockQuantity: 40, thresholdLevel: 6, isVegetarian: true, isSpicy: true, preparationTime: 10 },
  { name: 'Bruschetta', category: 'appetizers', description: 'Toasted bread topped with tomato, basil, and olive oil', price: 34.0, stockQuantity: 35, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 8 },
  { name: 'Mozzarella Sticks', category: 'appetizers', description: 'Golden fried mozzarella with marinara dip', price: 36.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 9 },
  { name: 'Caesar Salad', category: 'appetizers', description: 'Fresh romaine lettuce with Caesar dressing and croutons', price: 30.0, stockQuantity: 50, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 5 },
  { name: 'Garden Salad', category: 'appetizers', description: 'Mixed greens, tomatoes, cucumber, and house vinaigrette', price: 26.0, stockQuantity: 40, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 5 },
  { name: 'Caprese Salad', category: 'appetizers', description: 'Fresh mozzarella, tomatoes, basil, and balsamic glaze', price: 38.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 6 },
  { name: 'Slider Trio', category: 'appetizers', description: 'Three mini beef sliders with caramelized onions', price: 44.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 12 },
  { name: 'Stuffed Jalapenos', category: 'appetizers', description: 'Jalapenos stuffed with cream cheese and herbs', price: 33.0, stockQuantity: 26, thresholdLevel: 5, isVegetarian: true, isSpicy: true, preparationTime: 10 },
  { name: 'Spring Rolls', category: 'appetizers', description: 'Crispy vegetable spring rolls with sweet chili dip', price: 29.0, stockQuantity: 36, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 8 },

  { name: 'Ribeye Steak', category: 'mains', description: 'Grilled ribeye steak with herb butter', price: 145.0, stockQuantity: 25, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 22 },
  { name: 'Filet Mignon', category: 'mains', description: 'Tenderloin steak cooked to order', price: 165.0, stockQuantity: 18, thresholdLevel: 4, isVegetarian: false, isSpicy: false, preparationTime: 24 },
  { name: 'Grilled Pork Chops', category: 'mains', description: 'Juicy pork chops with garlic mash', price: 98.0, stockQuantity: 26, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 20 },
  { name: 'Roasted Chicken', category: 'mains', description: 'Herb roasted chicken with pan jus', price: 85.0, stockQuantity: 35, thresholdLevel: 6, isVegetarian: false, isSpicy: false, preparationTime: 18 },
  { name: 'Grilled Salmon', category: 'mains', description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables', price: 120.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 20 },
  { name: 'Fish and Chips', category: 'mains', description: 'Crispy battered fish served with fries', price: 95.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 18 },
  { name: 'Shrimp Scampi', category: 'mains', description: 'Sauteed shrimp in garlic butter over linguine', price: 130.0, stockQuantity: 22, thresholdLevel: 4, isVegetarian: false, isSpicy: false, preparationTime: 16 },
  { name: 'Classic Cheeseburger', category: 'mains', description: 'Beef patty, cheddar, lettuce, and house sauce', price: 62.0, stockQuantity: 45, thresholdLevel: 8, isVegetarian: false, isSpicy: false, preparationTime: 14 },
  { name: 'Club Sandwich', category: 'mains', description: 'Triple-layer sandwich with chicken, egg, and bacon', price: 58.0, stockQuantity: 40, thresholdLevel: 8, isVegetarian: false, isSpicy: false, preparationTime: 10 },
  { name: 'Chicken Panini', category: 'mains', description: 'Pressed panini with grilled chicken and cheese', price: 60.0, stockQuantity: 35, thresholdLevel: 7, isVegetarian: false, isSpicy: false, preparationTime: 11 },
  { name: 'Spaghetti Bolognese', category: 'mains', description: 'Classic spaghetti with rich beef bolognese', price: 72.0, stockQuantity: 40, thresholdLevel: 7, isVegetarian: false, isSpicy: false, preparationTime: 15 },
  { name: 'Lasagna', category: 'mains', description: 'Layered pasta bake with beef and cheese', price: 78.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 18 },
  { name: 'Pad Thai', category: 'mains', description: 'Stir-fried rice noodles with peanuts and tamarind', price: 80.0, stockQuantity: 32, thresholdLevel: 6, isVegetarian: false, isSpicy: true, preparationTime: 14 },
  { name: 'Beef Ramen', category: 'mains', description: 'Rich ramen broth with noodles and beef slices', price: 76.0, stockQuantity: 30, thresholdLevel: 6, isVegetarian: false, isSpicy: false, preparationTime: 16 },
  { name: 'Macaroni and Cheese', category: 'mains', description: 'Creamy baked macaroni and three-cheese sauce', price: 55.0, stockQuantity: 34, thresholdLevel: 6, isVegetarian: true, isSpicy: false, preparationTime: 12 },
  { name: 'Pot Roast', category: 'mains', description: 'Slow-cooked beef pot roast with vegetables', price: 90.0, stockQuantity: 24, thresholdLevel: 4, isVegetarian: false, isSpicy: false, preparationTime: 22 },
  { name: 'Meatloaf', category: 'mains', description: 'Traditional glazed meatloaf with gravy', price: 70.0, stockQuantity: 25, thresholdLevel: 5, isVegetarian: false, isSpicy: false, preparationTime: 15 },

  { name: 'Steamed Asparagus', category: 'sides', description: 'Lightly steamed asparagus with sea salt', price: 24.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 6 },
  { name: 'Roasted Brussels Sprouts', category: 'sides', description: 'Caramelized Brussels sprouts with herbs', price: 26.0, stockQuantity: 26, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 8 },
  { name: 'Sauteed Spinach', category: 'sides', description: 'Garlic sauteed spinach', price: 22.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 6 },
  { name: 'Mashed Potatoes', category: 'sides', description: 'Creamy mashed potatoes', price: 20.0, stockQuantity: 35, thresholdLevel: 6, isVegetarian: true, isSpicy: false, preparationTime: 6 },
  { name: 'French Fries', category: 'sides', description: 'Golden crispy fries', price: 18.0, stockQuantity: 50, thresholdLevel: 8, isVegetarian: true, isSpicy: false, preparationTime: 6 },
  { name: 'Onion Rings', category: 'sides', description: 'Beer-battered onion rings', price: 19.0, stockQuantity: 35, thresholdLevel: 6, isVegetarian: true, isSpicy: false, preparationTime: 7 },
  { name: 'Jollof Rice', category: 'sides', description: 'Ghana-style spiced tomato rice', price: 25.0, stockQuantity: 45, thresholdLevel: 7, isVegetarian: true, isSpicy: true, preparationTime: 10 },
  { name: 'Steamed Rice', category: 'sides', description: 'Fluffy steamed white rice', price: 16.0, stockQuantity: 60, thresholdLevel: 10, isVegetarian: true, isSpicy: false, preparationTime: 8 },
  { name: 'Garlic Bread', category: 'sides', description: 'Toasted garlic butter bread', price: 17.0, stockQuantity: 40, thresholdLevel: 7, isVegetarian: true, isSpicy: false, preparationTime: 5 },
  { name: 'Dinner Rolls', category: 'sides', description: 'Warm house-baked dinner rolls', price: 15.0, stockQuantity: 45, thresholdLevel: 8, isVegetarian: true, isSpicy: false, preparationTime: 4 },
  { name: 'Artisanal Flatbread', category: 'sides', description: 'Wood-fired flatbread with olive oil', price: 21.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 8 },

  { name: 'Chocolate Cake', category: 'desserts', description: 'Rich chocolate cake with chocolate frosting', price: 28.0, stockQuantity: 25, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 2 },
  { name: 'Cheesecake', category: 'desserts', description: 'Baked cheesecake with berry compote', price: 30.0, stockQuantity: 22, thresholdLevel: 4, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Fruit Tart', category: 'desserts', description: 'Seasonal fruit tart with custard', price: 27.0, stockQuantity: 24, thresholdLevel: 4, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Assorted Pastries', category: 'desserts', description: 'Chef selection of daily pastries', price: 24.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 2 },
  { name: 'Vanilla Ice Cream', category: 'desserts', description: 'Classic vanilla bean ice cream', price: 22.0, stockQuantity: 30, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 2 },
  { name: 'Chocolate Gelato', category: 'desserts', description: 'Dense Italian-style chocolate gelato', price: 24.0, stockQuantity: 26, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 2 },
  { name: 'Mango Sorbet', category: 'desserts', description: 'Refreshing dairy-free mango sorbet', price: 23.0, stockQuantity: 25, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 2 },
  { name: 'Fudge Brownie', category: 'desserts', description: 'Warm chocolate brownie with fudge sauce', price: 26.0, stockQuantity: 28, thresholdLevel: 5, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Apple Pie', category: 'desserts', description: 'Classic apple pie with cinnamon', price: 27.0, stockQuantity: 22, thresholdLevel: 4, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Creme Brulee', category: 'desserts', description: 'Silky custard with caramelized sugar top', price: 32.0, stockQuantity: 20, thresholdLevel: 4, isVegetarian: true, isSpicy: false, preparationTime: 4 },

  { name: 'Iced Coffee', category: 'beverages', description: 'Cold brewed coffee with ice and milk', price: 18.0, stockQuantity: 100, thresholdLevel: 10, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Passion Fruit Juice', category: 'beverages', description: 'Fresh passion fruit juice served chilled', price: 15.0, stockQuantity: 80, thresholdLevel: 10, isVegetarian: true, isSpicy: false, preparationTime: 3 },
  { name: 'Sobolo', category: 'beverages', description: 'Traditional hibiscus drink with ginger', price: 14.0, stockQuantity: 40, thresholdLevel: 8, isVegetarian: true, isSpicy: true, preparationTime: 3 },
];

async function syncMenu() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI or MONGODB_URI is required');
  }

  await mongoose.connect(mongoUri);

  for (const item of menuItems) {
    const imageText = encodeURIComponent(item.name);
    const image = `https://via.placeholder.com/300x200?text=${imageText}`;

    const menuDoc = await MenuItem.findOneAndUpdate(
      { name: item.name },
      {
        ...item,
        image,
        isAvailable: item.stockQuantity > 0,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    await Inventory.findOneAndUpdate(
      { menuItem: menuDoc._id },
      {
        menuItem: menuDoc._id,
        itemName: menuDoc.name,
        stockLevel: menuDoc.stockQuantity,
        thresholdLevel: menuDoc.thresholdLevel,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  console.log(`Synced ${menuItems.length} menu items with inventory records.`);
  await mongoose.disconnect();
}

syncMenu().catch((error) => {
  console.error('Failed to sync menu data:', error.message);
  process.exit(1);
});
