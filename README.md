# Restaurant Website

A full‑featured restaurant website built with **React + Tailwind CSS** on the frontend and **Express + SQLite** on the backend. It includes menu management, a reservation system, online ordering, user authentication, and order tracking.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [License](#license)

---

## Overview
The Restaurant Website provides a seamless experience for both customers and staff:
- **Customers** can browse the menu, make reservations, place orders online, and track their order status.
- **Staff** (via an admin portal) can manage menu items, view reservations, and monitor incoming orders.

The project is split into two main parts:
1. **Backend** – Express server with SQLite handling data persistence and authentication.
2. **Frontend** – React app styled with Tailwind CSS, consuming the backend APIs.

---

## Features
- **Menu Management** – CRUD operations for menu items (categories, dishes, prices, images).
- **Reservation System** – Create, view, update, and cancel reservations with date/time validation.
- **Online Ordering** – Add items to cart, checkout, and receive order confirmation.
- **User Authentication** – JWT‑based auth for customers and admin roles (signup, login, protected routes).
- **Order Tracking** – Users can view order history and status; admins can update order state (preparing, ready, delivered).

---

## Tech Stack
| Layer          | Technology                                   |
|----------------|----------------------------------------------|
| Frontend       | React 18, Tailwind CSS, Axios, React Router |
| Backend        | Node.js, Express, SQLite (via better‑sqlite3)|
| Auth           | JSON Web Token (JWT), bcryptjs               |
| Dev Tools      | ESLint, Prettier, nodemon (backend), Vite (frontend) |

---

## Setup Instructions

### Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn**
- **Git**

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/restaurant-website.git
cd restaurant-website/backend

# Install dependencies
npm install

# Copy example env and configure
cp .env.example .env
# Edit .env to set PORT, JWT_SECRET, and optionally DB_PATH

# Initialize the database (runs migrations/seeders)
npm run db:init

# Start the dev server
npm run dev   # uses nodemon, watches for changes
```
The API will be available at `http://localhost:5000/api`.

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy example env and configure API base URL
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api (adjust if backend runs elsewhere)

# Start the dev server
npm run dev   # Vite dev server, usually at http://localhost:5173
```

---

## API Endpoints
All endpoints are prefixed with `/api`. Authentication routes return a JWT that should be sent as `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| POST   | `/auth/register`  | Register a new user (customer) |
| POST   | `/auth/login`     | Login and receive JWT          |
| GET    | `/auth/me`        | Get logged‑in user profile     |

### Menu
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/menu`           | List all menu items (with pagination) |
| GET    | `/menu/:id`       | Get a single menu item          |
| POST   | `/menu`           | **Admin** – Create a new menu item |
| PUT    | `/menu/:id`       | **Admin** – Update a menu item  |
| DELETE | `/menu/:id`       | **Admin** – Delete a menu item  |

### Reservations
| Method | Endpoint                | Description                               |
|--------|-------------------------|-------------------------------------------|
| GET    | `/reservations`         | List reservations for the logged‑in user  |
| POST   | `/reservations`         | Create a new reservation                  |
| PUT    | `/reservations/:id`     | Update (customer can cancel/modify own)   |
| DELETE | `/reservations/:id`     | Cancel a reservation                      |
| GET    | `/admin/reservations`   | **Admin** – View all reservations         |

### Orders
| Method | Endpoint          | Description                                 |
|--------|-------------------|---------------------------------------------|
| GET    | `/orders`         | List orders for the logged‑in user          |
| POST   | `/orders`         | Create a new order (cart → order)           |
| GET    | `/orders/:id`     | Get details of a specific order             |
| PUT    | `/orders/:id/status` | **Admin** – Update order status (preparing, ready, delivered) |
| GET    | `/admin/orders`   | **Admin** – View all orders                 |

---

## Environment Variables
Create a `.env` file in both `backend/` and `frontend/` directories.

### Backend (`.env`)
```dotenv
PORT=5000
JWT_SECRET=your_super_secret_key
DB_PATH=./database/restaurant.sqlite   # relative to backend root
# Optional: NODE_ENV=development
```

### Frontend (`.env`)
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant Website
```

---

## Running the Application
1. Start the backend (`npm run dev` in `backend/`).
2. Start the frontend (`npm run dev` in `frontend/`).
3. Open your browser to the frontend URL (usually `http://localhost:5173`).

Both servers support hot reloading during development.

---

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.