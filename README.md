# ☕ Brew3D Coffee Commerce Platform

A full-stack coffee e-commerce and café management web application featuring an interactive 3D-inspired frontend, persistent shopping cart, customer checkout, table reservations, order management, and an administrative dashboard.

Built with **HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and Mongoose**, the application demonstrates a complete frontend-to-backend commerce workflow and is deployed using Netlify and Render.

---

## 🌐 Live Demo

🚀 [View Swa Cafe Live Website](https://swa-cafe-commerce.netlify.app/)

---

## 📖 Project Overview

**Brew3D Coffee Commerce Platform** is a full-stack, multi-page web application designed to simulate a modern digital café experience.

The platform allows customers to explore coffee products, add products to a persistent shopping cart, complete checkout, place orders, reserve tables, and contact the café.

A dedicated administrative dashboard provides café-management functionality, including viewing customer orders, viewing reservations, deleting completed or unwanted records, and adding products.

The project demonstrates practical full-stack development by connecting a responsive JavaScript frontend to a deployed Node.js and Express REST API backed by MongoDB Atlas.

---

## ✨ Core Features

### ☕ Coffee Menu & Product Browsing

- Interactive coffee product catalogue
- Product names, images, and prices
- Coffee-category filtering
- Add-to-cart functionality
- Animated product cards
- Responsive product layouts

### 🛒 Shopping Cart

- Add products directly from the menu
- Persistent cart using browser LocalStorage
- Live cart quantity indicator
- Multiple-product support
- Product quantity tracking
- Individual item totals
- Dynamic order total calculation
- Remove products from cart
- Cart data retained while navigating between pages

### 💳 Customer Checkout

- Dedicated checkout workflow
- Customer full-name collection
- Email-address collection
- Phone-number collection
- Delivery-address collection
- Payment-method selection
- Complete order summary before submission
- Product quantities and prices displayed
- Total order value calculated automatically
- Successful-order confirmation
- MongoDB order persistence
- Cart automatically cleared after successful checkout

> The current card option records the selected payment method as part of the order. Integration with a production payment gateway is planned as a future enhancement.

### 📅 Table Reservations

Customers can submit table reservations through the booking interface.

Booking information is sent through the backend API and stored for administrative management.

### 📩 Contact Experience

- Dedicated contact page
- Customer enquiry form
- Backend contact endpoint
- Responsive contact interface

### 👩‍💼 Admin Dashboard

The administrative dashboard provides café-management functionality including:

- View customer orders
- View customer contact information
- View delivery addresses
- View payment methods
- View ordered products
- View quantities
- View order totals
- View order status
- View order timestamps
- Delete customer orders
- View table reservations
- View reservation date and time
- View guest count
- Delete table bookings
- Add new products

---

## 🔄 Complete Customer Journey

```text
Customer Visits Website
        │
        ▼
Browse Coffee Menu
        │
        ▼
Select Coffee Products
        │
        ▼
Add Products to Cart
        │
        ▼
Persistent LocalStorage Cart
        │
        ▼
Review Shopping Cart
        │
        ▼
Proceed to Checkout
        │
        ▼
Enter Customer Details
        │
        ├── Full Name
        ├── Email
        ├── Phone
        ├── Delivery Address
        └── Payment Method
        │
        ▼
Review Order Summary
        │
        ▼
Place Order
        │
        ▼
Express REST API
        │
        ▼
MongoDB Atlas
        │
        ▼
Admin Dashboard
        │
        ▼
View / Manage / Delete Order
```

---

## 📅 Reservation Workflow

```text
Customer
   │
   ▼
Table Booking Form
   │
   ▼
Booking Details
   │
   ▼
Express Booking API
   │
   ▼
MongoDB Atlas
   │
   ▼
Admin Dashboard
   │
   ▼
View / Delete Reservation
```

---

## 🏗️ Application Architecture

```text
┌──────────────────────────────┐
│           CUSTOMER           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       NETLIFY FRONTEND       │
│                              │
│  HTML5                       │
│  CSS3                        │
│  JavaScript                  │
│  LocalStorage                │
│  Swiper.js                   │
│  ScrollReveal                │
│  Boxicons                    │
└──────────────┬───────────────┘
               │
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│        RENDER BACKEND        │
│                              │
│  Node.js                     │
│  Express.js                  │
│  Mongoose                    │
│  REST API                    │
│  CORS                        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        MONGODB ATLAS         │
│                              │
│  Orders                      │
│  Bookings                    │
│  Products                    │
│  Contact Requests            │
└──────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Multi-page website structure |
| CSS3 | Responsive styling and visual effects |
| JavaScript | Frontend application logic |
| LocalStorage | Persistent shopping-cart storage |
| Swiper.js | Interactive content components |
| ScrollReveal | Scroll-based animations |
| Boxicons | Interface icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API and server routing |
| Mongoose | MongoDB object modelling |
| CORS | Frontend/backend cross-origin communication |
| dotenv | Environment-variable management |

### Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Mongoose Schemas | Application data modelling |

### Deployment & Development

| Technology | Purpose |
|---|---|
| Netlify | Frontend deployment |
| Render | Backend API deployment |
| GitHub | Version control and source-code hosting |
| Git | Source-control workflow |
| VS Code | Development environment |

---

## 🖥️ Website Pages

The application contains multiple dedicated pages:

```text
index.html
about.html
menu.html
services.html
booking.html
cart.html
contact.html
admin.html
```

### Home

Introduces Swa Cafe through an animated, coffee-themed landing experience.

### About

Presents the café concept and brand experience.

### Menu

Displays coffee products and allows customers to add selected products to their shopping cart.

### Services

Presents the services offered by Swa Cafe.

### Booking

Allows customers to submit table reservations.

### Cart & Checkout

Displays selected products, quantities, prices and totals before allowing customers to complete their order.

### Contact

Provides a dedicated customer-contact interface.

### Admin

Provides administrative access to application data and café-management functionality.

---

## ⚙️ REST API

The frontend communicates with the Express backend through REST-style API endpoints.

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/orders` | Place a customer order |
| `GET` | `/api/orders` | Retrieve customer orders |
| `DELETE` | `/api/orders/:id` | Delete an order |

### Bookings

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/bookings` | Create a table reservation |
| `GET` | `/api/bookings` | Retrieve reservations |
| `DELETE` | `/api/bookings/:id` | Delete a reservation |

### Products

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/products` | Add a product |

### Contact

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/contacts` | Submit a customer enquiry |

---

## 🧾 Order Data Model

Customer orders can contain information such as:

```text
Order
│
├── Customer
│   ├── Name
│   ├── Email
│   ├── Phone
│   └── Address
│
├── Items
│   ├── Product Name
│   ├── Price
│   ├── Quantity
│   └── Image
│
├── Total
├── Payment Method
├── Status
├── Created Time
└── Updated Time
```

This information is persisted in MongoDB and retrieved by the administrative dashboard.

---

## 🛍️ Shopping Cart Logic

The cart is managed on the frontend using browser LocalStorage.

This provides:

- Cart persistence between pages
- Dynamic cart-count updates
- Quantity tracking
- Product removal
- Automatic price calculations
- Checkout order-summary generation

After a successful order is stored through the backend API, the customer's cart is automatically cleared.

---

## 👩‍💼 Administrative Order Management

Orders submitted through checkout are stored in MongoDB Atlas.

The admin dashboard retrieves these records through:

```http
GET /api/orders
```

Each administrative order card can display:

- Order ID
- Order date and time
- Customer name
- Customer email
- Customer phone
- Delivery address
- Payment method
- Order status
- Products ordered
- Quantity
- Individual item values
- Total order value

Administrators can remove an order through:

```http
DELETE /api/orders/:id
```

The dashboard refreshes after a successful deletion.

---

## 📅 Administrative Booking Management

Table reservations submitted by customers are retrieved by the admin dashboard.

Administrators can view reservation information such as:

- Customer name
- Phone number
- Reservation date
- Reservation time
- Number of guests

Reservations can also be removed from the system through the booking DELETE endpoint.

---

## 📸 Project Screenshots

### 🏠 Home Page

![Swa Cafe Home Page](docs/screenshots/home-hero.png)

### ✨ Home Features

![Swa Cafe Home Features](docs/screenshots/home-features.png)

### ☕ About Swa Cafe

![About Swa Cafe](docs/screenshots/about-section.png)

### 📋 Coffee Menu

![Coffee Menu](docs/screenshots/menu-products.png)

### 🚚 Services

![Services](docs/screenshots/services.png)

### 📅 Table Booking

![Table Booking](docs/screenshots/booking.png)

### 📩 Contact Page

![Contact Page](docs/screenshots/contact.png)

### 👩‍💼 Admin Dashboard

![Swa Cafe Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 📁 Project Structure

```text
Coffee-commerce-fullstack/
│
├── assets/
│   └── images/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── docs/
│   └── screenshots/
│
├── index.html
├── about.html
├── menu.html
├── services.html
├── booking.html
├── cart.html
├── contact.html
├── admin.html
├── style.css
├── main.js
└── README.md
```

---

## 🚀 Deployment Architecture

The project uses separate frontend and backend deployments.

### Frontend

The static frontend is deployed on **Netlify**.

It contains:

- HTML pages
- CSS styling
- JavaScript application logic
- Product images and visual assets

### Backend

The Node.js and Express REST API is deployed on **Render**.

The frontend communicates with the deployed API to perform operations including:

```text
Create Order
Retrieve Orders
Delete Order
Create Booking
Retrieve Bookings
Delete Booking
Add Product
Submit Contact Request
```

### Database

The backend communicates with **MongoDB Atlas** for persistent cloud data storage.

---

## 🔐 Environment Configuration

Sensitive backend configuration is managed through environment variables rather than being hard-coded into the application.

Typical backend configuration includes:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
```

Real credentials and database secrets should never be committed to the public repository.

---

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Coffee-commerce-fullstack
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
```

Add the required MongoDB connection configuration.

### 4. Start the Backend

Development mode:

```bash
npm run dev
```

or:

```bash
npm start
```

The backend uses port `5000` by default when no deployment port is provided.

### 5. Open the Frontend

Open the frontend using a local development server or deploy the static application to a hosting provider such as Netlify.

---

## 🎨 UI / UX Highlights

The application focuses on creating a visually engaging café experience through:

- Coffee-inspired visual design
- Glass-style cards
- Animated backgrounds
- Interactive product cards
- Scroll-based animations
- Responsive navigation
- 3D-inspired presentation
- Mobile-friendly layouts
- Dynamic cart notifications
- Smooth checkout flow

---

## 🎯 Skills Demonstrated

This project demonstrates practical experience with:

- Full-stack web development
- JavaScript application development
- REST API design
- Node.js
- Express.js
- MongoDB
- Mongoose
- CRUD operations
- Asynchronous JavaScript
- Fetch API
- JSON data exchange
- Browser LocalStorage
- Responsive UI development
- Form handling
- Client/server integration
- Cloud database integration
- Frontend deployment
- Backend deployment
- Git and GitHub version control
- Debugging deployed full-stack applications

---

## 🔮 Future Improvements

Potential future development includes:

- 🔐 Secure administrator authentication
- 👥 Role-based access control
- 💳 Stripe or another production payment gateway
- 📦 Inventory management
- 🔄 Admin order-status updates
- 🟡 Pending orders
- 🔵 Preparing orders
- 🟢 Completed orders
- 🚚 Delivery-status tracking
- 👤 Customer accounts
- 📧 Automated order-confirmation emails
- 📊 Admin analytics dashboard
- 🔎 Order search and filtering
- 🧾 Digital receipts
- 🧪 Automated frontend and backend testing
- ⚙️ CI/CD pipeline
- 🐳 Docker containerisation
- ☁️ Expanded cloud deployment

---

## 📌 Project Status

**Current Status: Functional Full-Stack Application**

The current deployed application supports the complete core workflow:

```text
Product Selection
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Customer Order
      ↓
REST API
      ↓
MongoDB Persistence
      ↓
Admin Order Management
```

Table reservations and administrative booking management are also integrated into the application.

---

## 👩‍💻 Developer

Developed as a full-stack portfolio project demonstrating frontend development, backend API engineering, database integration, deployment, and practical e-commerce workflow implementation.

---

## 📄 License

This project is intended for educational and portfolio purposes.