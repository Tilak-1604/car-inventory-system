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

### AI Tools Used
- **ChatGPT**
- **Gemini 3.5 Flash**
- **Antigravity (Google DeepMind)**

### How I Used AI
I used AI as a developer assistant throughout this project rather than as a replacement for my own engineering judgment. It helped me brainstorm the monorepo architecture, generate the initial Spring Boot and React Vite boilerplates, and suggest DTO and entity structures for the backend database mapper. 

I also used it to:
- Configure CorsConfig filters and Spring Security filter chains.
- Scaffolding custom routing guards (`ProtectedRoute`, `AdminRoute`) on React Router v6.
- Streamlining React Hook Form input validation checks to prevent unnecessary re-renders.
- Troubleshooting compilation errors and styling responsive grids in Tailwind CSS v3.
- Creating RTL-based unit tests for React components.

However, I reviewed every suggestion carefully, adapted it to the project's needs, and tested and integrated the final implementation myself.

### My Reflection
Using AI increased my development speed and reduced repetitive coding work, especially during the early scaffolding and debugging phases. It also helped me compare alternative implementations before choosing a direction, which made the solution design more thoughtful. That said, the final design decisions, integration work, testing, and validation were completed by me. Understanding the generated code was essential before I could safely merge it into the project, and that process strengthened my confidence in the final result. In short, AI was a helpful assistant that accelerated the workflow without replacing the responsibility of building and verifying the application myself.

### AI Co-authorship
For commits where AI significantly contributed to the implementation, I added Git co-author trailers in line with the assignment requirements. Examples included:

```
Co-authored-by: Gemini 3.5 Flash gemini-flash@users.noreply.github.com
Co-authored-by: Antigravity antigravity@google.com
```

These trailers were added only when AI meaningfully assisted with code generation, debugging, or design support.
