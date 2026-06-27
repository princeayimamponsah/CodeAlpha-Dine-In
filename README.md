# 🍽️ DINE-IN - Restaurant Management System

A modern, full-stack restaurant management platform with real-time reservations, orders, inventory tracking, and comprehensive analytics.

## 📋 Features

### Core Functionality
- ✅ **Table Management** - Interactive table status tracking and allocation
- ✅ **Reservations** - Smart booking system with table availability checking
- ✅ **Order Management** - Real-time order tracking with item status updates
- ✅ **Menu Management** - Digital menu with inventory integration
- ✅ **Inventory Control** - Stock tracking with automatic alerts
- ✅ **User Authentication** - Secure role-based access control (Admin/Staff/Manager)
- ✅ **Analytics & Reports** - Sales tracking, revenue analysis, and performance metrics
- ✅ **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- Staff user management and role assignment
- Menu item creation and inventory management
- Table configuration and layout
- Real-time order and reservation monitoring
- Revenue and performance reports
- System settings and configuration

### Staff Features
- View and manage reservations
- Process and track orders
- Update table status
- View menu and inventory
- Basic analytics access

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18+ with Vite
- Tailwind CSS for styling
- Lucide React icons
- Zustand for state management
- Axios for HTTP requests
- date-fns for date formatting

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

**Deployment:**
- Docker containerization (Backend)
- npm package management

## 📁 Project Structure

```
DINE-IN/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Orders, etc.)
│   │   ├── services/        # API service layer
│   │   ├── context/         # Global state (Zustand)
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   ├── config/          # Database, JWT config
│   │   └── utils/           # Helpers and validators
│   ├── scripts/             # Utility scripts
│   ├── tests/               # Test files
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── docker-compose.yml        # Docker orchestration
├── package.json             # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dine-in.git
   cd DINE-IN
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Configuration**
   - Create `.env` file in `backend/` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/dine-in
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5001
   NODE_ENV=development
   ```

2. **Frontend Configuration**
   - Create `.env` file in `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: `http://localhost:5001`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

4. **Seed Database** (Optional - adds sample data)
   ```bash
   cd backend
   node seedAll.js
   ```

### Default Admin Account
After seeding, use these credentials to login:
- Email: `admin@dine-in.com`
- Password: `password123`

## 📚 API Documentation

### Authentication Endpoints
```
POST   /auth/register        - Register new user
POST   /auth/login           - Login user
GET    /auth/me              - Get current user
PATCH  /auth/profile         - Update profile
GET    /auth/users           - Get all users (Admin)
PATCH  /auth/users/:id/role  - Update user role (Admin)
```

### Tables Endpoints
```
GET    /tables               - Get all tables
GET    /tables/available     - Get available tables (with guest count filtering)
GET    /tables/:id           - Get table details
POST   /tables               - Create new table (Admin only)
PATCH  /tables/:id           - Update table
PATCH  /tables/:id/status    - Update table status
DELETE /tables/:id           - Delete table (Admin only)
GET    /tables/statistics    - Get table statistics (Admin)
```

### Reservations Endpoints
```
GET    /reservations         - Get all reservations (with status filtering)
GET    /reservations/:id     - Get reservation details
POST   /reservations         - Create new reservation
PATCH  /reservations/:id     - Update reservation
PATCH  /reservations/:id/confirm   - Confirm reservation
PATCH  /reservations/:id/complete  - Complete reservation
PATCH  /reservations/:id/cancel    - Cancel reservation
DELETE /reservations/:id     - Delete reservation
GET    /reservations/upcoming      - Get upcoming reservations
```

### Menu Endpoints
```
GET    /menu                 - Get all menu items
GET    /menu/:id             - Get menu item details
POST   /menu                 - Create menu item (Admin only)
PATCH  /menu/:id             - Update menu item
DELETE /menu/:id             - Delete menu item (Admin only)
GET    /menu/available       - Get available items
GET    /menu/low-stock       - Get low stock items
```

### Orders Endpoints
```
GET    /orders               - Get all orders
GET    /orders/:id           - Get order details
POST   /orders               - Create new order
PATCH  /orders/:id           - Update order
PATCH  /orders/:id/status    - Update order status
DELETE /orders/:id           - Delete order
GET    /orders/active        - Get active orders
```

## 🗄️ Database Schema

### Users
- _id, name, email, password (hashed), role, phone, timestamps

### Tables
- _id, tableNumber, capacity, status (available/reserved/occupied), location, notes, isActive, timestamps

### MenuItems
- _id, name, category, description, price, image, stockQuantity, isAvailable, preparationTime, isVegetarian, isSpicy, timestamps

### Reservations
- _id, customerName, phone, email, table (ref), reservationTime, guests, status (pending/confirmed/completed/cancelled), specialRequests, timestamps

### Orders
- _id, orderNumber, table (ref), items (array), totalAmount, subtotal, tax, status, timestamps

## 🔐 Authentication & Authorization

The system uses JWT-based authentication with role-based access control:

- **Admin**: Full system access
- **Manager**: Dashboard, reports, staff management
- **Staff**: Order and reservation management, basic analytics

## 📱 Responsive Design

The application is built with mobile-first responsive design using Tailwind CSS:
- Mobile devices (< 640px)
- Tablets (640px - 1024px)  
- Desktops (1024px+)

All pages are fully responsive with adaptive layouts and touch-friendly interfaces.

## 🧪 Testing

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Unit Tests
```bash
cd backend
npm run test
```

## 📦 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

### Build Docker Image
```bash
docker build -t dine-in-backend ./backend
```

### Run with Docker Compose
```bash
docker-compose up
```

## 🔧 Development

### Code Style
- ESLint configured for JavaScript
- Prettier for code formatting
- Consistent naming conventions

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create Pull Request
```

## 📊 Sample Data

The database comes pre-populated with:
- **11 Menu Items** - Appetizers, mains, desserts, beverages
- **8 Tables** - Various capacities and locations
- **3 Reservations** - At different statuses for testing
- **2 Orders** - With different items and statuses

Run `node seedAll.js` in the backend directory to repopulate sample data.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database name is correct

### CORS Errors
- Check `MONGODB_URI` in backend `.env`
- Ensure frontend API URL matches backend in `.env`

### Port Already in Use
```bash
# Kill process using port 5001
lsof -ti :5001 | xargs kill -9

# Or change port in backend .env
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Push notifications for orders
- [ ] QR code table ordering
- [ ] Payment integration
- [ ] Customer loyalty program
- [ ] Multi-location support
- [ ] Advanced analytics with charts
- [ ] Staff scheduling module
- [ ] Online booking with customer accounts

---

**Last Updated:** May 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
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
MONGO_URI=mongodb://localhost:27017/dine-in
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
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

### Backend (Render)
1. Create a new Web Service from the repository.
2. Set the root directory to `backend`.
3. Use `npm install` as the build command.
4. Use `npm start` as the start command.
5. Add these environment variables:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env or the platform environment variables
- If you already use MONGODB_URI, it is also accepted

### CORS Issues
- Update CORS_ORIGIN in backend .env
- Ensure FRONTEND_URL matches the deployed frontend on Render

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
