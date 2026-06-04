# Quick Start Guide - DINE IN Restaurant Management System

## 🚀 Start in 5 Minutes

### Option 1: With Docker (Recommended)

1. Install Docker and Docker Compose

2. In the root directory, run:
```bash
docker-compose up -d
```

3. Backend starts at `http://localhost:5000`
   Frontend starts at `http://localhost:3000`

### Option 2: Manual Setup (Without Docker)

#### Backend Setup:

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Make sure MongoDB is running on your machine
# For Windows: mongod (in separate terminal)
# For Mac: brew services start mongodb-community

# Start backend server
npm run dev
```

Backend will run at http://localhost:5000

#### Frontend Setup:

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

Frontend will open at http://localhost:3000

---

## 📝 Login Credentials

**Admin User (Full Access):**
- Email: admin@dine-in.com
- Password: password123
- Role: admin

**Staff User (Limited Access):**
- Email: staff@dine-in.com
- Password: password123
- Role: staff

---

## 📊 What You Get Out of the Box

### Dashboard
- Real-time order tracking
- Table occupancy status
- Inventory alerts
- Sales metrics

### Order Management
- Create and track orders
- Manage order status (pending → preparing → served → completed)
- Process payments
- Add/remove items from active orders

### Reservations
- Book tables for customers
- Prevent double-booking
- View upcoming reservations
- Manage reservation status

### Menu Management (Admin Only)
- Add/edit/delete menu items
- Manage stock levels
- Set item availability
- Track food categories and preparation time

### Table Management (Admin Only)
- Create and configure tables
- Set table capacity
- Organize by location (main, patio, private)
- Track current occupancy

### Inventory (Admin Only)
- Monitor stock levels
- Get low-stock alerts
- Restock items
- Track supplier information

---

## 🔧 Important Environment Variables

### Backend (.env)

```
PORT=5000                           # Server port
NODE_ENV=development                # Environment mode
MONGODB_URI=mongodb://localhost:27017/dine-in  # MongoDB connection
JWT_SECRET=your-secret-key         # JWT signing key
JWT_EXPIRE=7d                       # Token expiration
BCRYPT_ROUNDS=10                    # Password hashing rounds
CORS_ORIGIN=http://localhost:3000  # Frontend URL
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

---

## 🧪 Test the System

1. **Login** → Use admin credentials
2. **Create a Table** → Go to Tables, add Table 1 (capacity 4)
3. **Create an Order** → Go to Orders, select table, add menu items
4. **Track Order** → Watch order status update from pending → served
5. **Make a Reservation** → Go to Reservations, book a table
6. **Check Inventory** → Go to Inventory (Admin), see stock levels

---

## 🛠️ Common Issues

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows: mongod (in separate terminal)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port 5000 Already in Use
```bash
# Change in backend/.env
PORT=5001
```

### Port 3000 Already in Use
```bash
# Kill process or change port in frontend
npm start -- --port 3000
```

### CORS Error
Update `CORS_ORIGIN` in backend/.env to match your frontend URL

---

## 📚 API Documentation

### Key Endpoints

```
POST   /api/auth/login               - Login user
POST   /api/auth/register            - Register new user
GET    /api/menu                     - Get all menu items
POST   /api/menu                     - Create menu item
GET    /api/tables                   - Get all tables
POST   /api/tables                   - Create table
POST   /api/orders                   - Create order
GET    /api/orders                   - Get all orders
PATCH  /api/orders/:id/status        - Update order status
POST   /api/reservations             - Create reservation
GET    /api/reservations             - Get all reservations
GET    /api/inventory                - Get inventory items
```

Full API documentation in `backend/README.md`

---

## 🚢 Deploy to Production

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder to Vercel/Netlify
3. Set `REACT_APP_API_URL` to production backend URL

---

## 💡 Next Steps

1. Customize the brand colors in `frontend/tailwind.config.js`
2. Add your restaurant logo
3. Customize menu categories
4. Set up payment gateway
5. Deploy to production

---

## 📞 Need Help?

- Check logs: `npm run dev` with verbose output
- Verify MongoDB connection: `mongosh`
- Test API: Use Postman or similar tool
- Review code in backend/ and frontend/ folders

---

**Happy serving! 🍽️**
