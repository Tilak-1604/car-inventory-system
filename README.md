# 🚗 AutoInventory — Car Dealership Inventory System

A production-grade, full-stack vehicle inventory and catalog management system. It comprises a **Java 21 + Spring Boot 3.3.1 REST API** backed by a **PostgreSQL** database, and a modern single-page application (SPA) built with **React 19, Vite, and Tailwind CSS v3**. The entire codebase was constructed following strict **Test-Driven Development (TDD)** practices.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [API Endpoints](#api-endpoints)
- [Setup & Run Locally](#setup--run-locally)
- [Running Tests](#running-tests)
- [Test Report](#test-report)
- [My AI Usage](#my-ai-usage)

---

## 🛠 Tech Stack

### Backend API
- **Language:** Java 21
- **Framework:** Spring Boot 3.3.1
- **Database:** PostgreSQL
- **Security:** Spring Security + JWT (JJWT 0.11.5) + BCrypt hashing
- **Validation:** Jakarta Bean Validation
- **ORM & Queries:** Spring Data JPA + JPA Specification API
- **Testing:** JUnit 5 + Mockito + MockMvc

### Frontend SPA
- **Framework:** React 19 + Vite (JavaScript)
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **State Management:** Context API (AuthContext)
- **API Client:** Axios (with request/response interceptors)
- **Notifications:** React Toastify
- **Testing:** Vitest + React Testing Library + jsdom

---

## 🏗 Architecture & Folder Structure

### Monorepo Layout
```
IncuBytes/
├── src/                  # Spring Boot Backend Source
│   └── main/java/com/dealership/inventory/
│       ├── config/       # SecurityConfig, CorsConfig
│       ├── controller/   # Auth controllers and REST endpoints
│       ├── dto/          # Input/Output DTO records
│       ├── entity/       # User & Vehicle JPA entities
│       ├── exception/    # Custom exceptions & GlobalExceptionHandler
│       ├── mapper/       # MapStruct-like manual mappers
│       ├── repository/   # JPA & Specification repositories
│       ├── security/     # JwtService, JwtAuthenticationFilter
│       └── service/      # Business logic service layer
├── frontend/             # React Frontend SPA
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Shared image, icon and style assets
│   │   ├── components/   # Reusable UI components (Cards, Dialogs, Filters)
│   │   ├── context/      # Global state providers (AuthContext)
│   │   ├── hooks/        # Custom hooks (useAuth, useVehicles, usePagination)
│   │   ├── layouts/      # Shell layouts (Navbar, MainLayout)
│   │   ├── pages/        # Route pages (LoginPage, RegisterPage, Dashboard, AdminPage)
│   │   ├── routes/       # Auth guarding (ProtectedRoute, AdminRoute)
│   │   ├── services/     # Axios client and API wrappers
│   │   ├── utils/        # Pure utilities (formatters, localStorage wrappers)
│   │   ├── test/         # Vitest unit & component test cases
│   │   ├── App.jsx       # Routing configurations
│   │   └── main.jsx      # React mounting entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

### Request Lifecycle
```
[Client SPA]
     │ (Axios with JWT interceptor)
     ▼
[Spring Security Filter Chain]
     │ (JwtAuthenticationFilter validates bearer token)
     ▼
[VehicleController]
     │ (Validates input request payloads)
     ▼
[VehicleServiceImpl]
     │ (Manages transactional database boundaries & business invariants)
     ▼
[PostgreSQL Database]
```

---

## 📡 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user with USER/ADMIN role |
| `POST` | `/api/auth/login` | Login and receive JWT access token |

### Vehicles (Protected — JWT Bearer Required)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/vehicles` | USER / ADMIN | Add a new vehicle to catalog |
| `GET` | `/api/vehicles` | USER / ADMIN | List all available vehicles |
| `GET` | `/api/vehicles/{id}` | USER / ADMIN | Fetch detailed vehicle info |
| `GET` | `/api/vehicles/search` | USER / ADMIN | Dynamic vehicle search & filtering |
| `PUT` | `/api/vehicles/{id}` | USER / ADMIN | Update a vehicle's specifications |
| `DELETE` | `/api/vehicles/{id}` | **ADMIN only** | Remove vehicle from system |

### Inventory (Protected — JWT Bearer Required)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/vehicles/{id}/purchase` | USER / ADMIN | Purchase units (decreases quantity, 409 if out-of-stock) |
| `POST` | `/api/vehicles/{id}/restock` | **ADMIN only** | Restocks vehicle inventory quantity |

---

## ⚙️ Setup & Run Locally

### Backend Setup

1. **Prerequisites:** Java 21+ and a running PostgreSQL database instance (configured on port `5433` by default).
2. **Create Database:**
   ```sql
   CREATE DATABASE dealership_db;
   ```
3. **Run Backend:**
   From the repository root folder, run:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will boot up on `http://localhost:9090`.

### Frontend Setup

1. **Prerequisites:** Node.js (v18+) and npm.
2. **Install Dependencies:**
   Navigate into the `frontend/` folder:
   ```bash
   cd frontend
   npm install
   ```
3. **Configure Environment:**
   Vite is configured to automatically proxy `/api` calls to the Spring Boot instance on port `9090` during development. You can also specify an `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:9090/api
   ```
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The React SPA will be available locally at `http://localhost:5173`.

---

## 🧪 Running Tests

### Backend Tests
From the root folder:
```bash
./mvnw test
```

### Frontend Tests
From the `frontend/` folder:
```bash
npm run test
```

---

## 📊 Test Report

Both backend and frontend test suites pass successfully.

### Backend Test Summary
- **Total Tests:** 49
- **Failures:** 0 | Errors: 0
- **Suites:**
  - `VehicleControllerTest` (31 tests) — Validates REST controllers, input validations, and role permissions.
  - `VehicleServiceTest` (11 tests) — Validates JPA specifications, purchase/restock invariants, and database updates.
  - `AuthControllerTest` (6 tests) — Checks registration and login credentials authentication flow.
  - `InventoryApplicationTests` (1 test) — Confirms Spring Boot context loads.

### Frontend Test Summary
- **Total Tests:** 7
- **Failures:** 0
- **Suites:**
  - `helpers.test.js` (4 tests) — Verifies currency formats, category badge classes, and role checking helper functions.
  - `LoginPage.test.jsx` (3 tests) — Uses React Testing Library to test form inputs rendering, input validation checks, and submission callback invocations.

---

## 🤖 My AI Usage

### AI Tools Utilized
- **Antigravity (Google DeepMind)** — Embedded IDE Coding Assistant

### How AI was Integrated
The full-stack application was built collaboratively using AI in a structured TDD process:
1. **Scaffolding and Configuration:** Scaffolded Vite directory layouts, configured PostCSS, Tailwind config extensions (custom palette, gradients, animations), and vitest options.
2. **Axios Client & Interceptors:** Generated the base Axios instance (`api.js`) and interceptors to attach bearer tokens automatically, and redirect to `/login` upon receiving `401 Unauthorized` responses.
3. **Protected Guard Routing:** Created declarative router wrappers (`ProtectedRoute.jsx`, `AdminRoute.jsx`) to enforce login states before mounting children.
4. **Validations & Custom Forms:** Implemented registration and vehicle forms with React Hook Form to prevent redundant React renders.
5. **Aesthetics & Skeletons:** Assisted in writing fluid responsive Tailwind CSS v3 utility classes for custom card-based lists, dark-theme panels, table layouts, and skeleton screens.
6. **Front-End Unit Testing:** Created React Testing Library simulation tests to trigger form events, fill inputs, and verify form validation errors.

### Reflections on AI Impact
AI pair programming was extremely helpful for scaffolding boilerplate (PostCSS files, Tailwind configs, setup configurations, React context scaffolding) and generating styling structures. 
The TDD rhythm was strictly adhered to by having the assistant author failing assertions first, followed by the minimal code required to pass, preventing scope creep. The resulting code compiles cleanly, has 100% test success, and builds without warnings in a production distribution.
