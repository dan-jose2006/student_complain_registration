# Software Testing & Quality Assurance Report
## CampusCare – Smart Campus Issue & Service Management System
**Course:** Software Engineering and Project Management (SEPM)  
**Document Ref:** QA-TEST-01  

---

## 1. Testing Strategy and Methodology

In accordance with Phase 4 of the Waterfall SDLC, CampusCare underwent comprehensive verification and validation:

1. **Unit Testing:** Individual services, utility methods, and authentication routines tested in isolation.
2. **Integration Testing:** End-to-end HTTP request/response validation utilizing Vitest and Supertest across API routers, controllers, and database handlers.
3. **Security / RBAC Testing:** Verification of JWT claim verification and role boundary integrity.
4. **Resilience Testing:** Verification of fallback behavior when external dependencies (PostgreSQL, Groq API) are unreachable.

---

## 2. Automated Test Execution Results (Vitest + Supertest)

```
✓ tests/auth.test.ts (7 tests)
  ✓ GET /api/health returns 200 OK and healthy status
  ✓ POST /api/auth/register successfully registers a new student
  ✓ POST /api/auth/register fails on duplicate email registration
  ✓ POST /api/auth/login succeeds with valid student credentials
  ✓ POST /api/auth/login succeeds with valid admin credentials
  ✓ POST /api/auth/login fails on invalid password
  ✓ GET /api/auth/me returns 401 Unauthorized without token

✓ tests/complaint.test.ts (5 tests)
  ✓ POST /api/complaints creates a new complaint ticket with PENDING status
  ✓ POST /api/complaints fails on validation when description is too short
  ✓ GET /api/complaints/my returns student complaints list
  ✓ GET /api/complaints/:id returns full complaint details
  ✓ POST /api/complaints/:id/feedback fails if ticket is not yet RESOLVED

✓ tests/admin.test.ts (4 tests)
  ✓ GET /api/admin/dashboard returns telemetry and chart breakdowns
  ✓ GET /api/admin/dashboard returns 403 Forbidden for student tokens
  ✓ GET /api/admin/complaints returns all campus complaints with filters
  ✓ PATCH /api/admin/complaints/:id updates complaint status and priority

✓ tests/ai.test.ts (3 tests)
  ✓ POST /api/ai/analyze-complaint returns structured suggestion for plumbing issue
  ✓ POST /api/ai/admin-insights returns executive trends and recommended actions for admin
  ✓ POST /api/ai/admin-insights is restricted to admins only

Test Files: 4 passed (4)
Tests:      19 passed (19)
Exit Code:  0 (ALL TESTS GREEN)
```

---

## 3. Comprehensive Test Cases (25 Test Scenarios)

| Test ID | Module | Test Scenario | Input Data / Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-01** | System | System Health Verification | `GET /api/health` | HTTP 200 `{ status: "healthy" }` | HTTP 200 | **PASS** |
| **TC-02** | Auth | Student Registration (Valid) | Name: "John Doe", Email: valid, Pass: "Password@123" | HTTP 201 with JWT token & `ROLE: STUDENT` | HTTP 201 | **PASS** |
| **TC-03** | Auth | Duplicate Email Registration | Existing email address | HTTP 409 Conflict with error message | HTTP 409 | **PASS** |
| **TC-04** | Auth | Password Length Validation | Password: "123" (< 6 chars) | HTTP 400 Bad Request (Zod error) | HTTP 400 | **PASS** |
| **TC-05** | Auth | Valid Student Login | `student@campuscare.com` / `Student@123` | HTTP 200 with valid JWT payload | HTTP 200 | **PASS** |
| **TC-06** | Auth | Valid Admin Login | `admin@campuscare.com` / `Admin@123` | HTTP 200 with JWT containing `ROLE: ADMIN` | HTTP 200 | **PASS** |
| **TC-07** | Auth | Invalid Password Login | Correct email, incorrect password | HTTP 401 Unauthorized | HTTP 401 | **PASS** |
| **TC-08** | Auth | Unauthenticated Endpoint Access | Access `/api/auth/me` without Bearer token | HTTP 401 Unauthorized | HTTP 401 | **PASS** |
| **TC-09** | Complaint | Valid Complaint Creation | Title: "Broken Chair in Room 201", Category: "INFRASTRUCTURE" | HTTP 201, status defaults to `PENDING` | HTTP 201 | **PASS** |
| **TC-10** | Complaint | Short Description Validation | Description: "Broken" (< 10 chars) | HTTP 400 Bad Request with validation message | HTTP 400 | **PASS** |
| **TC-11** | Complaint | Student Complaints Retrieval | `GET /api/complaints/my` with Student JWT | HTTP 200, returns array of user's complaints | HTTP 200 | **PASS** |
| **TC-12** | Complaint | Complaint Detail Inspection | `GET /api/complaints/:id` | HTTP 200, returns complaint, user, feedback | HTTP 200 | **PASS** |
| **TC-13** | AI | AI Triaging - Plumbing Issue | "Water leaking continuously from hostel ceiling" | Suggested category: `PLUMBING`, Priority: `HIGH` | Match | **PASS** |
| **TC-14** | AI | AI Triaging - Electrical Issue | "Sparking power socket near library computer 4" | Suggested category: `ELECTRICAL`, Priority: `HIGH` | Match | **PASS** |
| **TC-15** | AI | AI Heuristic Fallback Resilience | Analyze complaint with invalid/missing API key | Deterministic heuristic returns structured result | Match | **PASS** |
| **TC-16** | Admin | Admin Dashboard Access (Admin) | `GET /api/admin/dashboard` with Admin JWT | HTTP 200 with summary counts & charts | HTTP 200 | **PASS** |
| **TC-17** | Admin | Admin Dashboard Access (Student) | `GET /api/admin/dashboard` with Student JWT | HTTP 403 Forbidden | HTTP 403 | **PASS** |
| **TC-18** | Admin | Complaint Status: PENDING → IN_PROGRESS | `PATCH /api/admin/complaints/:id` `{ status: "IN_PROGRESS" }` | HTTP 200, status updated to `IN_PROGRESS` | HTTP 200 | **PASS** |
| **TC-19** | Admin | Complaint Status: IN_PROGRESS → RESOLVED | `PATCH /api/admin/complaints/:id` `{ status: "RESOLVED" }` | HTTP 200, status updated to `RESOLVED` | HTTP 200 | **PASS** |
| **TC-20** | Feedback | Feedback on Pending Complaint | Submit rating on complaint with status `PENDING` | HTTP 400 (Feedback allowed only on RESOLVED) | HTTP 400 | **PASS** |
| **TC-21** | Feedback | Feedback on Resolved Complaint | Submit rating: 5, comment: "Fixed fast" on `RESOLVED` | HTTP 201 Feedback saved | HTTP 201 | **PASS** |
| **TC-22** | Admin | AI Executive Insights Generation | `POST /api/ai/admin-insights` with Admin JWT | HTTP 200 with trends, risks, recommended actions | HTTP 200 | **PASS** |
| **TC-23** | Admin | Search Complaints by Keyword | Query `?search=projector` | Returns only matching complaints | Match | **PASS** |
| **TC-24** | UI | Dark/Light Mode Theme Toggle | Click Theme Switcher in Navigation Bar | `dark` class added to `<html>` root, persists | Match | **PASS** |
| **TC-25** | UI | 1-Click Demo Login | Click "Admin Demo" button on Login page | Form autofills and authenticates instantly | Match | **PASS** |

---

## 4. Requirements Traceability Matrix (RTM)

| Functional Req ID | Requirement Description | Test Case Mapping | Verification Status |
|---|---|---|---|
| **FR-01** | Student Registration | TC-02, TC-03, TC-04 | Verified |
| **FR-02** | User Login & JWT | TC-05, TC-06, TC-07 | Verified |
| **FR-03** | RBAC Enforcement | TC-08, TC-17 | Verified |
| **FR-04** | Complaint Ticket Creation | TC-09 | Verified |
| **FR-05** | Request Data Validation | TC-04, TC-10 | Verified |
| **FR-06** | Real-time AI Triaging | TC-13, TC-14 | Verified |
| **FR-07** | AI Heuristic Fallback | TC-15 | Verified |
| **FR-08** | Student Complaints View | TC-11 | Verified |
| **FR-09** | Lifecycle Status Timeline | TC-12 | Verified |
| **FR-10** | Admin Dashboard Analytics | TC-16 | Verified |
| **FR-11** | Search and Multi-Filtering | TC-23 | Verified |
| **FR-12** | Status / Priority Transition | TC-18, TC-19 | Verified |
| **FR-13** | Post-Resolution Feedback | TC-20, TC-21 | Verified |
| **FR-14** | AI Executive Insights | TC-22 | Verified |
| **FR-15** | Dark/Light UI Theming | TC-24 | Verified |
