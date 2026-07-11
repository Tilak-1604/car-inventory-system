# 🚗 Car Dealership Inventory System

A production-grade RESTful API for managing a car dealership's vehicle inventory, built with **Java 21 + Spring Boot 3.3.1** following strict **Test-Driven Development (TDD)** practices.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Setup & Run Locally](#setup--run-locally)
- [Running Tests](#running-tests)
- [Test Report](#test-report)
- [My AI Usage](#my-ai-usage)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.1 |
| Database | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| Password Hashing | BCrypt |
| Validation | Jakarta Bean Validation |
| Query Building | JPA Specification API |
| Pagination | Spring Data Pageable |
| Testing | JUnit 5 + Mockito + MockMvc |
| Build Tool | Maven |

---

## 🏗 Architecture

```
com.dealership.inventory
├── config/          # SecurityConfig, CorsConfig
├── controller/      # AuthController, VehicleController
├── dto/
│   ├── request/     # LoginRequest, UserRegistrationRequest, VehicleRequest,
│   │                #   VehicleSearchRequest, PurchaseRequest, RestockRequest
│   └── response/    # LoginResponse, UserResponse, VehicleResponse
├── entity/          # User, Vehicle, Role (enum)
├── exception/       # GlobalExceptionHandler + custom exceptions
├── mapper/          # VehicleMapper
├── repository/      # UserRepository, VehicleRepository (+ JpaSpecificationExecutor)
├── security/        # JwtService, JwtAuthenticationFilter,
│                    #   JwtAuthenticationEntryPoint, CustomUserDetailsService
└── service/         # AuthService/Impl, UserService/Impl, VehicleService/Impl
```

**Request Flow:**
```
Client → JwtAuthenticationFilter → Controller → Service → Repository → PostgreSQL
                                                    ↓
                                             GlobalExceptionHandler
```

---

## 📡 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

**Register request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

**Login request:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "username": "john_doe",
  "role": "USER"
}
```

### Vehicles (Protected — Bearer Token Required)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/vehicles` | USER / ADMIN | Add a new vehicle |
| `GET` | `/api/vehicles` | USER / ADMIN | List all vehicles |
| `GET` | `/api/vehicles/{id}` | USER / ADMIN | Get a single vehicle |
| `GET` | `/api/vehicles/search` | USER / ADMIN | Search and filter vehicles |
| `PUT` | `/api/vehicles/{id}` | USER / ADMIN | Update a vehicle |
| `DELETE` | `/api/vehicles/{id}` | **ADMIN only** | Delete a vehicle |

### Inventory (Protected — Bearer Token Required)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/vehicles/{id}/purchase` | USER / ADMIN | Purchase — decreases quantity |
| `POST` | `/api/vehicles/{id}/restock` | **ADMIN only** | Restock — increases quantity |

**Search query parameters (all optional):**
```
GET /api/vehicles/search?make=Toyota&category=Sedan&minPrice=20000&maxPrice=40000&page=0&size=10&sort=id
```

**HTTP Status Codes:**

| Status | Meaning |
|---|---|
| `200 OK` | Success |
| `201 Created` | Resource created |
| `204 No Content` | Successful deletion |
| `400 Bad Request` | Validation error |
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Insufficient role (e.g. USER trying ADMIN action) |
| `404 Not Found` | Vehicle/User not found |
| `409 Conflict` | Duplicate username/email OR out-of-stock |

---

## ⚙️ Setup & Run Locally

### Prerequisites

- Java 21+
- PostgreSQL (running on port 5432 or 5433)
- Maven (or use the included `mvnw` wrapper)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/car-dealership-inventory.git
cd car-dealership-inventory
```

### 2. Create the PostgreSQL database

```sql
CREATE DATABASE dealership_db;
```

### 3. Configure environment variables (or update application.properties)

```bash
# Option A: Environment variables (recommended)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dealership_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
export APP_JWT_SECRET=your_256bit_hex_secret

# Option B: Edit src/main/resources/application.properties directly
```

### 4. Run the application

```bash
./mvnw spring-boot:run
```

The API will be available at: `http://localhost:9090`

---

## 🧪 Running Tests

```bash
# Run all tests
./mvnw test

# Run a specific test class
./mvnw test -Dtest=VehicleControllerTest

# Generate test report (HTML)
./mvnw surefire-report:report
```

---

## 📊 Test Report

```
Tests run: 49, Failures: 0, Errors: 0, Skipped: 0

Test Suites:
├── VehicleControllerTest   31 tests  (HTTP layer — MockMvc + @WebMvcTest)
├── VehicleServiceTest      11 tests  (Business logic — Mockito unit tests)
├── AuthControllerTest       6 tests  (Auth HTTP layer)
└── InventoryApplicationTests 1 test  (Spring context load)
```

**Coverage areas:**
- ✅ User registration and login (success + validation failures)
- ✅ JWT authentication (401 for missing token, valid token flow)
- ✅ Role-based authorization (403 for USER trying ADMIN endpoints)
- ✅ Vehicle CRUD (create, list, update, delete)
- ✅ Dynamic search with multiple filter combinations
- ✅ Pagination
- ✅ Purchase: success, out-of-stock (409), insufficient stock (409), not found (404)
- ✅ Restock: success (ADMIN), forbidden (USER), not found (404)
- ✅ JPA Specification building (unit-tested with mocked CriteriaBuilder)

---

## 🤖 My AI Usage

### Tools Used

- **Antigravity (Google DeepMind)** — AI coding assistant embedded in the IDE

### How I Used AI

This project was built in a **collaborative pair-programming session** with an AI assistant over multiple phases:

| Phase | AI Contribution | My Contribution |
|---|---|---|
| Phase 1 — Setup | Scaffolded project structure, pom.xml dependencies | Verified dependencies, adjusted for local PostgreSQL setup |
| Phase 2 — Auth & JWT | Generated JWT filter, security config boilerplate | Reviewed security decisions, adjusted token validation logic |
| Phase 3 — Vehicle CRUD | Generated entity, repository, service, controller with TDD cycle | Drove TDD cycle decisions, reviewed each RED→GREEN→REFACTOR step |
| Phase 4 — Search | Suggested Specification API approach, generated VehicleSpecification | Evaluated alternatives (QueryDSL, JPQL), chose Specification |
| Phase 5 — Inventory | Generated purchase/restock business logic | Reviewed concurrency edge cases, decided on exception types |

### Specific AI Interactions

1. **Test design**: Asked AI to explain why `@WebMvcTest` requires `@Import(SecurityConfig.class)` to properly test JWT 401 responses. AI explained the filter chain mechanics.

2. **Exception design**: AI suggested `OutOfStockException → 409 Conflict` vs `400 Bad Request`. I asked it to justify the choice; it explained the "well-formed request vs. server state conflict" distinction — which I agreed with.

3. **JPA Specifications**: AI generated `VehicleSpecification.filterBy()` and explained why `Specification` is superior to multiple `findByXxx` methods for dynamic queries.

4. **Concurrency edge cases**: I asked the AI to explain optimistic vs. pessimistic locking for the purchase endpoint. I made the conscious decision NOT to implement locking for this kata but documented the concept.

5. **CORS configuration**: I asked AI to generate CORS config that allows typical React/Vue dev server ports. I reviewed and understood each allowed origin.

### Reflection on AI Impact

Using AI as a pair programmer **significantly accelerated** the boilerplate-heavy parts (JWT filter, Spring Security config, Hibernate entity setup) — work that is correct-by-formula but time-consuming. 

However, every AI-generated piece of code was:
- **Read and understood** before being accepted
- **Modified** to fit our specific domain (e.g., our Role enum, our exception hierarchy)
- **Tested** with tests I designed with the AI's guidance

The TDD cycle was driven interactively — the AI would write failing tests, explain why they fail, then implement the minimum code to pass them. This kept the development honest and prevented over-engineering.

**Key learning**: AI is most valuable for "what should this look like?" questions on established patterns (JWT, Spring Security, REST conventions). It's less reliable for novel domain logic decisions, which I made myself.

---

## 📝 Conventional Commit History (Summary)

```
feat: initialize spring boot project with postgresql, jpa, security
test: add auth controller tests (RED phase)
feat: implement user registration and login with jwt
test: add vehicle controller tests (RED phase)
feat: implement vehicle crud endpoints
test: add vehicle search controller tests
feat: implement dynamic vehicle search with jpa specifications and pageable
test: add purchase and restock controller and service tests
feat: implement vehicle purchase and restock inventory management
feat: add cors configuration for frontend spa integration
feat: add get vehicle by id endpoint
chore: change ddl-auto from create to update, add environment variable support
docs: add comprehensive readme with api documentation and ai usage section
```

*All commits where AI was used include `Co-authored-by: Antigravity <antigravity@google.com>` trailer.*
