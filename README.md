# Paisa Track - UPI Payment Tracker

<div align="center">

![Paisa Track Logo](https://img.shields.io/badge/Paisa-Track-blue?style=for-the-badge&logo=wallet&logoColor=white)

**A unified mobile application to track and manage UPI payments across multiple platforms**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.10-000020?style=flat&logo=expo)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

</div>

---

## Overview

**Paisa Track** solves the problem of fragmented payment history across multiple UPI apps (Google Pay, PhonePe, Paytm, etc.) by providing a centralized platform to manually log, categorize, and analyze all your UPI expenses.

### Key Features

- **Secure Authentication** - JWT-based login system with bcrypt password hashing
- **Transaction Management** - Add, edit, delete, and categorize payments
- **Spending Analytics** - Visual dashboards and category breakdowns
- **Cross-Platform** - Works on iOS, Android, and Web
- **Modern UI** - Clean, intuitive design with NativeWind (Tailwind CSS)
- **Real-time Data** - Instant updates and synchronization

---

## Tech Stack

### Frontend (Mobile App)
- **Framework:** React Native with Expo SDK 54
- **Navigation:** React Navigation 7.x (Stack & Tab Navigators)
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **Icons:** Expo Vector Icons & React Native Vector Icons
- **State Management:** React Hooks
- **Development:** Expo CLI

### Backend (API Server)
- **Runtime:** Node.js with Express.js
- **Database:** MySQL with Prisma ORM
- **Authentication:** JWT tokens with bcryptjs
- **Middleware:** CORS, JSON parsing
- **Development:** Nodemon for hot reloading

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Code Formatting:** Prettier with Tailwind plugin
- **Database Management:** Prisma Studio

---

## Project Structure

```
Paisa_Track/
├── frontend/                   # React Native Mobile App
│   ├── screens/               # App screens (Login, Dashboard, etc.)
│   ├── components/            # Reusable UI components
│   ├── navigation/            # Navigation configuration
│   ├── services/             # API service calls
│   ├── utils/                # Utility functions
│   ├── assets/               # Images and static files
│   ├── App.js                # Main app entry point
│   └── package.json          # Frontend dependencies
│
├── backend/                   # Node.js API Server
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic services
│   │   ├── utils/            # Backend utilities
│   │   └── index.js          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json          # Backend dependencies
│
├── README.md                 # Project documentation
├── Idea.md                   # Project concept and requirements
└── structure.md              # Detailed project structure
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **MySQL** database server

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on specific platform:**
   ```bash
   npm run android    # Android emulator/device
   npm run ios        # iOS simulator (macOS only)
   npm run web        # Web browser
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. **Set up database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/paisa_track"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
```

### API Endpoints

#### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

#### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

---
- **Modern Design** with gradient backgrounds
- **Responsive Layout** for all screen sizes
- **Keyboard Handling** for smooth input experience
- **Loading States** and error handling
- **Consistent Theming** across all screens

---
## Roadmap

### Phase 1 (Current)
- Authentication system
- Basic transaction management
- Dashboard interface
- Mobile app foundation

### Phase 2 (Planned)
- Advanced analytics with charts
- Export functionality (PDF/CSV)
- Budget planning features
- Notification system

### Phase 3 (Future)
- Bank integration APIs
-  Multi-currency support
- Expense sharing features
-  Advanced reporting

---

## Author

**Abhay Pratap Yadav**  
URN: 2024-B-04092006B

---

## License

This project is developed as part of an academic assignment. All rights reserved.
