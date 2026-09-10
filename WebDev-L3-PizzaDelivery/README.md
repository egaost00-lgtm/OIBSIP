# 🍕 Crust & Co. — Pizza Delivery Full-Stack Application

A production-style full-stack pizza ordering and inventory management platform built as part of the **OASIS INFOBYTE SIP Internship — Web Development & Designing, Level 3**.

Crust & Co. provides a complete customer ordering experience with authentication, email verification, custom pizza building, Razorpay test payments, order tracking, and an administrative dashboard for inventory and order management.

---

## 🚀 Features

### 👤 User Side

- User registration with email verification
- Secure password hashing with bcrypt
- JWT-based authentication
- Login validation and protected user access
- Forgot password with email reset link
- Pizza dashboard with available varieties
- Custom pizza builder
  - 5 pizza base options
  - 5 sauce options
  - Cheese selection
  - Multiple vegetable selection
- Dynamic custom pizza pricing
- Cart with quantity management
- Order summary before payment
- Razorpay test-mode checkout
- Order confirmation
- Real-time order status tracking through polling
- Customer logout

### 👨‍💼 Admin Side

- Separate admin login
- Protected admin dashboard
- View incoming customer orders
- Update order status
- Inventory management dashboard
- View current inventory stock
- Configurable low-stock thresholds
- Manual inventory stock updates
- Automatic inventory deduction after orders
- Automated low-stock email notifications
- Scheduled inventory monitoring using `node-cron`

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication & Security
- JWT
- bcryptjs

### Payments
- Razorpay Test Mode

### Email
- Nodemailer
- Gmail SMTP

### Scheduling
- node-cron

---

## 📁 Project Structure

```text
WebDev-L3-PizzaDelivery/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── Checkout.jsx
│   │   ├── CustomPizza.jsx
│   │   ├── EmailVerification.jsx
│   │   ├── OrderTracking.jsx
│   │   └── ResetPassword.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
