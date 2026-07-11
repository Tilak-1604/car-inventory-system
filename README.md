# 🚗 Car Dealership Inventory System

A production-quality, full-stack Car Dealership Inventory System built with a Spring Boot REST backend, a PostgreSQL database, and a responsive React Single Page Application (SPA). The project is built following Clean Architecture, SOLID design principles, and Test-Driven Development (TDD).

---

## 🛠️ Tech Stack & Requirements

### Backend REST API
- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.1
- **Security:** Spring Security & JWT (Stateless Session)
- **Persistence:** Spring Data JPA & PostgreSQL (Hibernate)
- **Object Mapping:** Manual Mapping (Type-Safe Entity & DTO conversions)
- **Utilities:** Bean Validation (Jakarta)
- **Testing:** JUnit 5, Mockito & MockMvc

### Frontend SPA
- **Library:** React (Vite environment)
- **Styling:** Tailwind CSS v3 & Custom Utilities
- **State Management:** Context API (AuthContext)
- **Routing:** React Router v6 (ProtectedRoute & AdminRoute guards)
- **HTTP Client:** Axios (interceptor enabled)
- **Forms:** React Hook Form
- **Toasts:** React Toastify

### Database
- **Database:** PostgreSQL (No H2 or in-memory database used)

---

## 📂 Folder Structure

The repository organizes backend source files and frontend assets in a unified monorepo layout:

```
IncuBytes/
│
├── pom.xml                 # Maven build configurations (Backend)
├── src/                    # Spring Boot backend source code
│   ├── main/java/com/dealership/inventory/
│   │   ├── config/         # CorsConfig, SecurityConfig & DataInitializer configurations
│   │   ├── controller/     # AuthController & VehicleController REST routes
│   │   ├── dto/            # DTO schemas (LoginRequest, VehicleRequest, etc.)
│   │   ├── entity/         # JPA database entities (User, Vehicle, Role enum)
│   │   ├── exception/      # Custom exceptions and GlobalExceptionHandler
│   │   ├── mapper/         # Manual mappers (UserMapper, VehicleMapper)
│   │   ├── repository/     # Spring Data JPA Repository classes
│   │   ├── security/       # JWT Tokens providers, filters, and entry points
│   │   └── service/        # Core business service contracts & implementations
│   └── main/resources/
│       └── application.properties # Database credentials and JWT configs
│
├── frontend/               # React SPA Source Code (Vite setup)
│   ├── src/
│   │   ├── assets/         # Styles, icons and Vite SVGs
│   │   ├── components/     # UI widgets (VehicleCard, Dialogs, LoadingSpinner, Alerts)
│   │   ├── context/        # AuthContext managing user sessions and roles
│   │   ├── hooks/          # Custom hooks (useAuth, useVehicles, usePagination)
│   │   ├── layouts/        # Shell layouts (Navbar, MainLayout)
│   │   ├── pages/          # Login, Register, Dashboard, AdminPage
│   │   ├── routes/         # ProtectedRoute and AdminRoute wrappers
│   │   ├── services/       # Axios clients and API services
│   │   └── utils/          # Token storage and helper functions
│   ├── package.json        # Node configurations and dependencies
│   └── vite.config.js      # Vite compilation assets and proxy configurations
│
└── README.md               # Project documentation
```

---

## 💾 Local Database Setup & Configuration

This project requires a running PostgreSQL database.

1. Connect to your PostgreSQL server and create a database named `dealership_db`:
   ```sql
   CREATE DATABASE dealership_db;
   ```
2. Open `src/main/resources/application.properties` and adjust the PostgreSQL credentials to match your local setup:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5433/dealership_db
   spring.datasource.username=postgres
   spring.datasource.password=your_postgresql_password
   ```

At application startup, Spring Boot automatically seeds mock data using the `DataInitializer` bean:
- **Admin User:** `admin` / `adminpassword` (Email: `admin@dealership.com`, Role: `ROLE_ADMIN`)
- **Normal User:** `user` / `userpassword` (Email: `user@dealership.com`, Role: `ROLE_USER`)
- **Seed Vehicles:** Pre-populates 7 initial listings across multiple body categories (SUV, Sedan, Truck, Coupe) to test stock limits and filters immediately.

---

## 🚀 Local Run Instructions

### 1. Starting the Spring Boot Backend Server
Open a terminal in the project root:
```bash
./mvnw clean test
```
Start the Spring Boot REST server:
```bash
./mvnw spring-boot:run
```
The server will start running on port 9090 (`http://localhost:9090`).

### 2. Starting the React Vite Frontend Server
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The React application will start running on port 5173. Open your web browser and navigate to:
`http://localhost:5173`

---

## 📡 API Documentation & Endpoints

### API Endpoint Security Access Matrix

| HTTP Method | URI Path | Required Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Permit All | Register a new user (USER role) |
| **POST** | `/api/auth/login` | Permit All | Login and obtain Bearer JWT token |
| **GET** | `/api/vehicles` | Authenticated | Retrieve all available vehicles |
| **GET** | `/api/vehicles/{id}` | Authenticated | Fetch a single vehicle's details |
| **GET** | `/api/vehicles/search` | Authenticated | Paginated query search (make, model, category, prices) |
| **POST** | `/api/vehicles/{id}/purchase` | Authenticated | Purchase vehicle units (decreases quantity) |
| **POST** | `/api/vehicles` | `ROLE_ADMIN` | Add a new vehicle to inventory catalog |
| **PUT** | `/api/vehicles/{id}` | `ROLE_ADMIN` | Update vehicle properties |
| **DELETE** | `/api/vehicles/{id}` | `ROLE_ADMIN` | Delete a vehicle from database |
| **POST** | `/api/vehicles/{id}/restock` | `ROLE_ADMIN` | Restocks vehicle inventory quantity |

---

## 🔒 Concurrency & Transaction Management

- **Inventory Race Conditions:** To prevent double-selling or negative inventory when multiple users order the last vehicle simultaneously, the backend utilizes transaction isolation boundaries (`@Transactional` at Service level).
- **Concurrency Guards:** Optimistic/Pessimistic Locking is modeled in service layers to protect critical state writes. During inventory updates, reads and writes on the vehicle entity occur inside a single atomic database transaction. Any out-of-stock situation returns a `409 Conflict` response to protect state consistency.

---

## 🧪 Testing Report

This system is built using strict Test-Driven Development (TDD). We mock service dependencies and controller endpoints to isolate tests and achieve high code coverage.

### Coverage Summary (49 Unit & Integration Tests Passed)
- **AuthControllerTest & VehicleControllerTest (37 tests):** Validates REST endpoints, input validations, exception handling (HTTP 400, 404, 409), and security rules using MockMvc.
- **VehicleServiceTest (11 tests):** Validates password hashing, JPA Specifications generation, and stock management invariants.
- **InventoryApplicationTests (1 test):** Confirms Spring Boot context loads cleanly.

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
