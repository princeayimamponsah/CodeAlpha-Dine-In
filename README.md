# DINE IN - Professional Restaurant Management System

A modern, full-stack Restaurant Management System built with Node.js, Express.js, React, MongoDB, and Tailwind CSS. This system provides a professional dashboard for managing orders, reservations, tables, menu items, and inventory with real restaurant operational logic.

## 🌟 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based auth with admin and staff roles
- **Order Management**: Create, track, and manage orders with real-time updates
- **Table Management**: Visual table layout with status management
- **Reservations**: Book tables with conflict prevention and validation
- **Menu Management**: Add, edit, delete menu items with stock tracking
- **Inventory Management**: Real-time stock monitoring with low-stock alerts
- **Analytics Dashboard**: Sales reports, order tracking, and key metrics

### Advanced Features
- Role-based access control (Admin & Staff)
- Automatic inventory deduction on orders
- Low stock alerts and notifications
- Payment processing workflow
- Responsive mobile-first design
- Dark mode support
- Real-time status updates

## 🏗️ Project Structure

```
DINE-IN/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── config/            # Configuration files (DB, JWT, Password)
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & Error handling
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Utilities & validators
│   │   └── server.js          # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                   # React Application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/            # Page components
    │   ├── services/         # API service layer
    │   ├── context/          # State management (Zustand)
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    ├── public/               # Static files
    ├── package.json
    ├── tailwind.config.js
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone and navigate to backend**
```bash
cd backend
cp .env.example .env
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables** (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dine-in
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Start the backend server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Demo Credentials
- **Email**: admin@dine-in.com
- **Password**: password123
- **Role**: Admin (Full access to all features)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (Admin only)

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (Admin)
- `PATCH /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)
- `GET /api/menu/low-stock` - Get low stock items

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table (Admin)
- `PATCH /api/tables/:id` - Update table (Admin)
- `PATCH /api/tables/:id/status` - Update table status
- `GET /api/tables/available` - Get available tables
- `PATCH /api/tables/:id/free` - Free a table

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get reservation details
- `PATCH /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/confirm` - Confirm reservation
- `PATCH /api/reservations/:id/complete` - Complete reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment` - Process payment
- `PATCH /api/orders/:id/add-item` - Add item to order
- `PATCH /api/orders/:id/remove-item` - Remove item from order
- `GET /api/orders/active` - Get active orders
- `GET /api/orders/daily-sales` - Get daily sales data

### Inventory
- `GET /api/inventory` - Get full inventory (Admin)
- `GET /api/inventory/low-stock` - Get low stock items
- `PATCH /api/inventory/:id` - Update inventory
- `PATCH /api/inventory/:id/restock` - Restock item

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (admin/staff)
- phone, isActive

### MenuItem
- name, category, description
- price, image, stockQuantity
- thresholdLevel, isAvailable
- isVegetarian, isSpicy

### Table
- tableNumber, capacity
- status (available/reserved/occupied)
- location, currentOrder, currentReservation

### Reservation
- customerName, phone, email
- table, reservationTime, guests
- status (pending/confirmed/completed/cancelled)
- specialRequests

### Order
- orderNumber, table, items
- subtotal, tax, totalAmount
- orderStatus, paymentStatus
- createdBy, startedAt, completedAt

### OrderItem
- menuItem, quantity, unitPrice, subtotal
- notes, status

### Inventory
- menuItem, itemName, stockLevel
- thresholdLevel, unit, supplier
- lastRestockDate, cost

## 🎨 UI Components

### Built-in Components
- **Toast Notifications** - Success, error, warning messages
- **Badge** - Status indicators
- **Card** - Container components with variants
- **Button** - Primary, secondary, success, danger, warning, outline
- **Input** - Text fields with validation
- **Modal** - Dialogs for forms and confirmations
- **Loading Spinner** - Loading states
- **Empty State** - No data scenarios
- **Navbar** - Top navigation with user menu
- **Sidebar** - Navigation menu with role filtering

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Input validation on all endpoints
- Protected API routes with middleware
- CORS configuration
- Error handling and logging

## 🔄 Business Logic

### Order Processing
1. Validate table and menu items
2. Check inventory stock
3. Deduct stock from inventory
4. Calculate totals and tax
5. Create order record
6. Update table status

### Reservation Booking
1. Validate table capacity vs guest count
2. Check for time conflicts
3. Prevent double booking
4. Update table status to reserved
5. Store reservation details

### Inventory Management
- Automatic stock deduction on order placement
- Low stock alerts when below threshold
- Prevent ordering unavailable items
- Restock functionality with supplier tracking

## 📊 Dashboard Metrics

- **Active Orders Count** - Live order tracking
- **Occupied Tables** - Current table status
- **Low Stock Items** - Inventory alerts
- **Daily Sales** - Revenue tracking
- **Sales Trends** - Weekly charts
- **Order Analytics** - Orders per day

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password**: Bcryptjs
- **Validation**: Express-validator
- **File Upload**: Multer (optional)

### Frontend
- **Library**: React 18+
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS 3+
- **UI Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dine-in
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Docker Setup (Optional)

Using Docker Compose to run MongoDB:

```bash
# In the root directory
docker-compose up -d
```

This will start MongoDB on port 27017.

## 🧪 Testing

### Manual Testing
1. Login with demo credentials
2. Create and manage orders
3. Make and manage reservations
4. Add/edit menu items
5. Manage tables
6. Monitor inventory

### API Testing
Use Postman or similar tools with the provided API endpoints.

## 🚢 Deployment

### Backend (Heroku/Railway/Render)
```bash
# Configure environment variables on platform
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### CORS Issues
- Update CORS_ORIGIN in backend .env

### Port Already in Use
- Change PORT in .env or kill process on port

## 📄 License

This project is open-source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 💡 Future Enhancements

- [ ] Real-time updates with Socket.io
- [ ] QR code menu system
- [ ] Printable receipts
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics
- [ ] Multi-location support
- [ ] Kitchen display system (KDS)
- [ ] Customer loyalty program
- [ ] Online ordering integration

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ for restaurant management**
