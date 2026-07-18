# Velocity — Car Dealership Inventory System

A full-stack car dealership inventory platform: browse, search, and purchase vehicles as a
customer, or manage inventory, restocks, and sales as an admin.

**Stack**
- Frontend: React (Vite) + Tailwind CSS + React Router + Axios + Framer Motion
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT auth
- Tests: Jest + Supertest + mongodb-memory-server (backend)

Theme: dark blue / black / light-blue "sporty" design with a light-blue (`#38BDF8`) performance
accent, `Rajdhani` display type, animated cards, and stock car photography pulled from Unsplash.

---

## Project structure

```
car-dealership/
├── backend/          Express API + MongoDB models + Jest tests
│   ├── src/
│   │   ├── config/       database connection
│   │   ├── models/       User, Vehicle, Purchase, Restock, InventoryLog
│   │   ├── middleware/    auth (JWT), admin guard, error handler
│   │   ├── controllers/   auth, vehicle, inventory (purchase/restock), purchases/stats
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── tests/         auth.test.js, vehicle.test.js (TDD-style, in-memory Mongo)
└── frontend/          Vite + React SPA
    └── src/
        ├── api/axios.js       Axios instance w/ JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/        Navbar, Footer, VehicleCard, ProtectedRoute
        └── pages/
            ├── Home, Login, Register, About, Contact
            ├── Inventory, VehicleDetails, PurchaseSuccess
            ├── Dashboard (customer)
            └── admin/  AdminLayout, AdminDashboard, AdminVehicles, AddEditVehicle, AdminUsers, AdminSettings
```

## 1. Backend setup

```bash
cd backend
cp .env.example .env     # fill in MONGO_URI (MongoDB Atlas) and JWT_SECRET
npm install
npm run dev               # starts on http://localhost:5000
```

Run the test suite (uses an in-memory MongoDB, no real database needed):

```bash
npm test
```

### API endpoints

| Method | Endpoint                        | Auth        | Description                          |
|--------|----------------------------------|-------------|---------------------------------------|
| POST   | /api/auth/register               | Public      | Register a user or admin              |
| POST   | /api/auth/login                  | Public      | Login, returns JWT                    |
| GET    | /api/auth/me                     | Token       | Current user profile                  |
| GET    | /api/vehicles                    | Token       | List vehicles (paginated)             |
| GET    | /api/vehicles/search              | Token       | Filter by make/model/category/price   |
| GET    | /api/vehicles/:id                | Token       | Single vehicle                        |
| POST   | /api/vehicles                    | Admin       | Add vehicle                           |
| PUT    | /api/vehicles/:id                | Admin       | Update vehicle                        |
| DELETE | /api/vehicles/:id                | Admin       | Delete vehicle                        |
| POST   | /api/vehicles/:id/purchase        | Token       | Purchase, decreases quantity          |
| POST   | /api/vehicles/:id/restock          | Admin       | Restock, increases quantity           |
| GET    | /api/purchases/my                 | Token       | Current user's purchase history       |
| GET    | /api/purchases                    | Admin       | All purchases                         |
| GET    | /api/purchases/admin/stats         | Admin       | Dashboard aggregate stats             |

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env      # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev                # starts on http://localhost:5173
```

Register a user with role **admin** from the Register page (a "Register As" toggle is on the
form) to unlock `/admin`.

## Notes

- Vehicle photography is pulled live from Unsplash by category (SUV, Sedan, Luxury, etc.) as a
  placeholder image source — swap the URLs in `VehicleCard.jsx` / `AddEditVehicle.jsx` for your
  own CDN in production.
- The register form's admin/customer toggle is for demo convenience; in production, gate admin
  account creation behind an invite flow instead of a public toggle.
- `AdminUsers.jsx` currently derives its customer list from purchase history since no dedicated
  `/api/users` listing endpoint was in the spec — add one if you need a full user directory.
- For TDD commit history: the `backend/tests` suite is written test-first per endpoint
  (register → login → protected routes → vehicle CRUD → purchase/restock). Commit each test
  file before its corresponding controller to preserve a red-green-refactor history, and add
  `Co-authored-by:` trailers per the assignment's AI usage policy for any AI-assisted commits.
