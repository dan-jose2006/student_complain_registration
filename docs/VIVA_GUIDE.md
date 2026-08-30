# CampusCare – Comprehensive Viva Voce Examination Guide
## 60+ Essential Questions & In-Depth Answers for Course Defense
**Course:** Software Engineering and Project Management (SEPM)  
**Project:** CampusCare – Smart Campus Issue & Service Management System  

---

## Section 1: Software Engineering Principles & SDLC (Waterfall Model)

#### Q1: What software process model was used for CampusCare, and why?
**Answer:** The **Classical Waterfall SDLC Model** was used. It was chosen because campus complaint handling workflows are well-understood, standard operating procedures (SOPs) are clearly defined, and requirements (user roles, complaint categories, status transitions) could be thoroughly specified and frozen during the initial Requirements phase before design and coding commenced.

#### Q2: What are the distinct phases of the Waterfall Model in this project?
**Answer:**
1. **Feasibility Study & Requirement Analysis** (Produced IEEE 830 SRS)
2. **System & Software Design** (Produced Architecture, DFD, ER diagrams)
3. **Implementation & Unit Testing** (Backend Express & Frontend React coding)
4. **Integration & System Testing** (Vitest/Supertest test suites with 19 automated tests)
5. **Deployment & Release** (Vite production bundling and Vercel hosting configuration)
6. **Operation & Maintenance** (Feedback collection and health check monitoring)

#### Q3: What is a major limitation of the Waterfall model, and how did your team address it?
**Answer:** The primary limitation is its rigidity to requirement changes once subsequent phases have begun. We mitigated this by conducting rigorous stakeholder analysis with facility wardens and students during Phase 1 to freeze the domain requirements (such as the 10 complaint categories and 3-step status progression), ensuring no mid-development architectural pivots were necessary.

#### Q4: What is the difference between Functional and Non-Functional Requirements?
**Answer:** 
- **Functional Requirements (FRs):** Define specific behaviors, features, and calculations the system must perform (e.g., FR-01: Student Registration, FR-06: AI Triaging).
- **Non-Functional Requirements (NFRs):** Define quality attributes, performance constraints, and security standards (e.g., NFR-P1: Sub-200ms API response time, NFR-S1: Bcrypt password hashing).

#### Q5: What is the IEEE 830 standard?
**Answer:** IEEE Std 830-1998 is the international standard for formulating Software Requirements Specifications (SRS). It mandates clear organization including Introduction, Overall Description, Specific Requirements, and external interface specifications.

#### Q6: What is a Phase Gate in the Waterfall model?
**Answer:** A Phase Gate is a formal review point at the end of each SDLC phase where deliverables must be validated against entry criteria before the project is permitted to advance to the next stage.

---

## Section 2: Software Project Management & Metrics

#### Q7: What is a Work Breakdown Structure (WBS)?
**Answer:** A WBS is a hierarchical decomposition of the total scope of work to be carried out by the project team to accomplish project objectives and create required deliverables.

#### Q8: How was project risk assessed and managed in CampusCare?
**Answer:** We maintained a **Risk Register** using a $5 \times 5$ Risk Matrix ($\text{Risk Score} = \text{Probability} \times \text{Impact}$). For example, the risk of external AI API failure (Risk R-01) had a score of 15 (High) and was mitigated by engineering an offline deterministic heuristic fallback engine.

#### Q9: What is COCOMO, and how was it applied?
**Answer:** The **Constructive Cost Model (COCOMO)** is an algorithmic cost estimation model developed by Barry Boehm. In our project (Organic Mode, ~4.2 KLOC), it estimated the effort as $E = 2.4 \times (4.2)^{1.05} \approx 10.9 \text{ Person-Months}$.

#### Q10: What is a RACI Matrix?
**Answer:** A RACI Matrix identifies roles and responsibilities across milestones: **R**esponsible (does the work), **A**ccountable (approves/owns the result), **C**onsulted (provides input), and **I**nformed (kept updated).

#### Q11: What is a Gantt Chart?
**Answer:** A horizontal bar chart depicting the project schedule, task durations, start/end dates, dependencies, and critical milestones across the 12-week Waterfall lifecycle.

#### Q12: What is the difference between Verification and Validation?
**Answer:**
- **Verification:** "Are we building the product right?" (Checking code against design and SRS specifications).
- **Validation:** "Are we building the right product?" (Ensuring the system satisfies user and campus facility needs).

---

## Section 3: System Architecture & Technical Design

#### Q13: Explain the 3-Tier Architecture of CampusCare.
**Answer:**
1. **Presentation Tier (Client):** React 18 + Vite SPA styled with Tailwind CSS, delivering responsive student and admin dashboards.
2. **Application Tier (Server):** Node.js and Express.js REST API enforcing authentication, Zod input validation, AI routing, and business logic.
3. **Data Tier (Persistence):** PostgreSQL database accessed via Prisma ORM for type-safe relational data management.

#### Q14: What is a Data Flow Diagram (DFD)?
**Answer:** A graphical representation of the flow of data through an information system. DFD Level 0 (Context Diagram) shows overall system boundaries and external entities (Student, Admin). DFD Level 1 decomposes the system into core functional processes (Authentication, Complaint Lifecycle, AI Triaging, Admin Analytics, Feedback).

#### Q15: What is the purpose of an Entity-Relationship (ER) Diagram?
**Answer:** An ER diagram visualizes database entities (`User`, `Complaint`, `Feedback`), their attributes, primary keys, and relationships (e.g., One User has Many Complaints; One Complaint has One optional Feedback).

#### Q16: Why did you use RESTful API architecture?
**Answer:** REST provides a stateless, scalable, client-server architectural style using standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`) with predictable JSON request and response payloads.

#### Q17: What is Role-Based Access Control (RBAC)?
**Answer:** A security mechanism that restricts access to authorized users based on their assigned role (`STUDENT` or `ADMIN`). In CampusCare, Express middleware checks the user's role extracted from the decoded JWT token.

---

## Section 4: Database Engineering & Prisma ORM

#### Q18: What is an Object-Relational Mapper (ORM), and why use Prisma?
**Answer:** An ORM maps database tables to object-oriented code. Prisma provides auto-generated, type-safe TypeScript query builders, automated migrations, and compile-time validation of database schema queries.

#### Q19: Explain the relationship between the `Complaint` and `Feedback` models.
**Answer:** It is a **1-to-1 relationship with a unique constraint**: each `Feedback` record belongs to exactly one `Complaint` (`complaintId` is unique). A student can only submit feedback once per complaint, and only after the status is `RESOLVED`.

#### Q20: What database indexing strategy was implemented?
**Answer:** Foreign key indexes were created on `Complaint.userId`, `Feedback.complaintId`, and `Feedback.userId`, alongside unique indexes on `User.email` and `Feedback.complaintId` for $O(\log n)$ lookup speed.

#### Q21: How does CampusCare handle local execution if PostgreSQL is not installed?
**Answer:** We engineered a resilient dual-mode adapter in `backend/src/config/prisma.ts`. It attempts to connect to live PostgreSQL, but if unavailable, seamlessly falls back to an in-memory mock store implementing Prisma's exact API with 20 pre-seeded complaints.

---

## Section 5: Security & Authentication

#### Q22: How does JSON Web Token (JWT) authentication work in CampusCare?
**Answer:** Upon valid login, the server signs a token containing the user's `userId`, `email`, `role`, and `name` using a secret key and expiration (24h). The frontend stores it in `localStorage` and transmits it in the `Authorization: Bearer <token>` header on subsequent requests.

#### Q23: How are passwords secured?
**Answer:** Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with a cost factor of 10 prior to database insertion.

#### Q24: What is Zod, and how does it improve security?
**Answer:** Zod is a TypeScript-first schema declaration and validation library. It validates and sanitizes incoming HTTP request payloads at runtime, rejecting malformed, truncated, or malicious input before execution.

#### Q25: Why is `GROQ_API_KEY` stored exclusively on the backend?
**Answer:** Storing API keys in frontend client bundles exposes them to unauthorized scraping. Keeping the key in backend environment variables (`.env`) ensures it is never visible to end users.

---

## Section 6: AI Integration & Fallback Engineering

#### Q26: What AI model is integrated into CampusCare?
**Answer:** **Groq Cloud's LLaMA 3.3 70B Versatile** model via the official `groq-sdk`, delivering ultra-fast inference (< 1.5s) for natural language understanding and structured JSON extraction.

#### Q27: How does the AI triaging feature work?
**Answer:** When a student enters a complaint title and description and clicks "Analyze with AI", the backend prompts the LLM with a strict JSON system prompt to evaluate urgency, assign one of the 10 valid categories, suggest priority (`LOW`, `MEDIUM`, `HIGH`), provide an executive summary, and identify the responsible campus department.

#### Q28: How is AI resilience guaranteed (Zero-Failure AI Policy)?
**Answer:** If the Groq API key is missing, network is offline, or rate limits are reached, the system catches the error and transparently invokes a local **deterministic heuristic rule engine** that matches domain keywords (e.g., "leak", "pipe" → `PLUMBING`, High) and returns valid structured output without throwing an unhandled exception.

#### Q29: What are AI Executive Insights in the Admin portal?
**Answer:** An administrative feature that aggregates campus-wide complaint telemetry (totals, pending queues, category frequency, and recent issue samples) and generates high-level trend analysis, infrastructure risk hotspots, and actionable resource allocation recommendations.

---

## Section 7: Frontend Engineering & UI/UX

#### Q30: Why was Vite chosen over Create React App (CRA)?
**Answer:** Vite utilizes native ES modules (ESM) and esbuild for near-instant hot module replacement (HMR), significantly faster development startup times, and optimized Rollup production builds.

#### Q31: How is global state managed in the React frontend?
**Answer:** Using React Context API:
- `AuthContext`: Manages user session, JWT storage, login/logout, and role checks.
- `ThemeContext`: Manages Dark/Light mode persistence in `localStorage`.
- `ToastContext`: Manages non-blocking notification alerts with Framer Motion animations.

#### Q32: What charting library was used, and what metrics are displayed?
**Answer:** **Recharts** is used to render responsive Category Bar Charts, Status Doughnut/Pie Charts, and 7-day Resolution Trends Line Charts.

---

## Section 8: Testing & Quality Assurance

#### Q33: What test framework was used for automated backend testing?
**Answer:** **Vitest** paired with **Supertest** for testing HTTP endpoints, authentication states, validation rules, and status lifecycle flows.

#### Q34: What is the code coverage across test suites?
**Answer:** 19 automated test cases across 4 test suites (`auth.test.ts`, `complaint.test.ts`, `admin.test.ts`, `ai.test.ts`) achieved 100% pass rate.

#### Q35: What is a Requirements Traceability Matrix (RTM)?
**Answer:** A table that maps each functional requirement (FR-01 to FR-15) directly to its corresponding automated and manual test cases, proving full requirement coverage.
