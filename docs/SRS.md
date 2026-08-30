# Software Requirements Specification (SRS)
## CampusCare – Smart Campus Issue & Service Management System
**Document Version:** 1.0.0  
**Standard:** IEEE Std 830-1998  
**Course:** Software Engineering and Project Management (SEPM)  
**Methodology:** Classical Waterfall Software Development Life Cycle  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **CampusCare**, an enterprise-grade web application designed to modernize, centralize, and streamline issue reporting and facility service resolution across university campuses. CampusCare integrates artificial intelligence (Groq LLaMA 3.3) for automated ticket triaging, department routing, and operational intelligence.

### 1.2 Scope
CampusCare provides a dual-portal interface:
- **Student Portal:** Enables authenticated students to raise facility complaints, preview AI categorization and urgency assessments, track ticket resolution through visual status timelines, and submit verified satisfaction feedback.
- **Administrative Portal:** Empowers facility managers, wardens, and IT staff with real-time operational telemetry, multi-dimensional filtering, batch triage, status workflow transitions, and executive AI summary insights.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **SDLC:** Software Development Life Cycle
- **FR:** Functional Requirement
- **NFR:** Non-Functional Requirement
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control
- **LLM:** Large Language Model
- **ORM:** Object-Relational Mapping (Prisma)
- **SLA:** Service Level Agreement

---

## 2. Overall Description

### 2.1 Product Perspective
CampusCare is a self-contained, three-tier web application consisting of a React Single Page Application (Client Tier), an Express.js REST API (Application Tier), and a PostgreSQL database with Prisma ORM (Data Tier), supplemented by Groq Cloud AI inference services.

```mermaid
graph TD
    Client[React + Vite Frontend (SPA)] -->|HTTPS / JSON REST API| Server[Node.js + Express + TypeScript Backend]
    Server -->|Prisma Client| DB[(PostgreSQL Database)]
    Server -->|OpenAI-Compatible API (groq-sdk)| AI[Groq Cloud LLaMA 3.3 70B Engine]
```

### 2.2 User Classes and Characteristics
1. **Student (`ROLE: STUDENT`):**
   - General campus residents, day scholars, and faculty requesting facility assistance.
   - Requires an intuitive, friction-free UI with responsive mobile accessibility.
2. **Administrator (`ROLE: ADMIN`):**
   - Department supervisors, estate managers, and facility maintenance dispatchers.
   - Requires macro-level analytics, operational dashboards, and ticket status transition controls.

### 2.3 Operating Environment
- **Client Platforms:** Modern web browsers (Google Chrome 90+, Mozilla Firefox 88+, Apple Safari 14+, Microsoft Edge).
- **Backend Runtime:** Node.js v18.0.0+ LTS or v20.0.0+ LTS.
- **Database Engine:** PostgreSQL 14+ / 16+.
- **Hosting Targets:** Vercel (Frontend & Serverless API) / Docker containerized instances.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

| Req ID | Module | Title | Description | Priority |
|---|---|---|---|---|
| **FR-01** | Auth | User Registration | System shall allow new students to register with name, email, and strong password (min 6 characters). | HIGH |
| **FR-02** | Auth | User Login & JWT | System shall authenticate users via bcrypt hashed credentials and return signed JWT tokens (24h expiry). | HIGH |
| **FR-03** | Auth | Role Enforcement | System shall enforce RBAC middleware restricting `/api/admin/*` endpoints strictly to `ADMIN` tokens. | HIGH |
| **FR-04** | Complaint | Ticket Creation | Students shall be able to file complaints with title, description, location, category, and priority. | HIGH |
| **FR-05** | Complaint | Data Validation | Backend shall validate all request payloads using Zod schemas, rejecting titles < 5 chars and descriptions < 10 chars. | HIGH |
| **FR-06** | AI Engine | Real-time Triaging | System shall provide an endpoint `/api/ai/analyze-complaint` that parses description text and suggests category, priority, reason, and handling department. | MEDIUM |
| **FR-07** | AI Engine | Heuristic Fallback | If Groq API key is omitted or rate-limited, system shall transparently switch to local deterministic keyword analysis without throwing errors. | HIGH |
| **FR-08** | Complaint | Student Complaints View | Students shall view all previously submitted complaints along with real-time status badges. | HIGH |
| **FR-09** | Complaint | Lifecycle Timeline | Students and Admins shall inspect ticket details showing a 3-step visual progression (`PENDING` → `IN_PROGRESS` → `RESOLVED`). | MEDIUM |
| **FR-10** | Admin | Executive Dashboard | Admins shall access macro metrics: total tickets, active pending, in-progress count, resolution rate, and category distribution charts. | HIGH |
| **FR-11** | Admin | Search & Filter | Admins shall filter complaints by status, category, priority, and text search across title, description, and submitter name. | HIGH |
| **FR-12** | Admin | Status & Priority Updates | Admins shall update a complaint's status (`PENDING` → `IN_PROGRESS` → `RESOLVED`) and re-assign priority level. | HIGH |
| **FR-13** | Feedback | Resolution Rating | Students shall submit a 1 to 5 star rating and optional feedback comment exclusively after the ticket status reaches `RESOLVED`. | MEDIUM |
| **FR-14** | AI Engine | Executive Insights | Admins shall view AI-generated operational summaries, risk hotspots, and recommended maintenance actions. | MEDIUM |
| **FR-15** | UI/UX | Dark/Light Theming | Frontend shall provide persistent Dark and Light mode toggle with smooth Tailwind CSS color transitions. | LOW |

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance Requirements (NFR-P)
- **NFR-P1:** API endpoints shall respond within < 200ms for standard CRUD operations under normal load.
- **NFR-P2:** AI triaging analysis via Groq LLaMA 3.3 shall return inference results within < 1.5 seconds.
- **NFR-P3:** Database queries shall utilize foreign key indexes on `userId` and `complaintId` for $O(\log n)$ retrieval.

### 4.2 Security Requirements (NFR-S)
- **NFR-S1:** Passwords must be hashed using `bcryptjs` with a minimum salt factor of 10.
- **NFR-S2:** All API endpoints processing sensitive operations must mandate valid Bearer JWT in the `Authorization` header.
- **NFR-S3:** AI API keys (`GROQ_API_KEY`) must remain strictly server-side and never exposed to the client bundle.
- **NFR-S4:** The application must implement Helmet HTTP security headers and sanitized CORS configuration.

### 4.3 Reliability & Fault Tolerance (NFR-R)
- **NFR-R1 (Zero-Failure AI Policy):** Core complaint workflows must never fail due to external AI downtime. If Groq API fails, the heuristic engine must fulfill the request.
- **NFR-R2 (Database Resilience):** The application database adapter must gracefully handle transient network disconnections with auto-reconnect logic.

### 4.4 Usability & Maintainability (NFR-U)
- **NFR-U1:** The web interface must achieve responsive rendering across desktop (1920x1080), tablet (768x1024), and mobile (375x667) viewports.
- **NFR-U2:** Both backend and frontend codebases must be strictly typed in TypeScript with zero unhandled compiler errors.
