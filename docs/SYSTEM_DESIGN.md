# System Architecture & Technical Design Specification
## CampusCare – Smart Campus Issue & Service Management System
**Course:** Software Engineering and Project Management (SEPM)  
**Document Ref:** ARCH-DES-01  

---

## 1. System Architecture (Three-Tier Enterprise Model)

CampusCare is architected around a strict separation of concerns into three decoupled tiers:

```mermaid
graph TD
    subgraph Presentation Tier (Client)
        UI[React 18 + TypeScript SPA]
        Tailwind[Tailwind CSS Design System]
        Recharts[Recharts Analytics Dashboards]
        Framer[Framer Motion Animations]
    end

    subgraph Application Tier (API Server)
        Router[Express.js Router & Middleware]
        AuthGuard[JWT Auth & RBAC Guard]
        Validator[Zod Schema Validator]
        Services[Business Logic Services]
        AIService[Groq LLaMA 3.3 Engine + Heuristic Fallback]
    end

    subgraph Data Tier (Persistence & Cloud)
        Prisma[Prisma ORM Client]
        DB[(PostgreSQL Relational Database)]
        GroqCloud[Groq Cloud AI API]
    end

    UI -->|HTTPS / JSON REST API| Router
    Router --> AuthGuard
    AuthGuard --> Validator
    Validator --> Services
    Services --> AIService
    Services --> Prisma
    Prisma --> DB
    AIService -->|Inference Query| GroqCloud
```

---

## 2. Data Flow Diagrams (DFD)

### 2.1 DFD Level 0 (Context Level Diagram)

```mermaid
graph LR
    Student((Student)) -->|1. Submit Complaint Details| CampusCareSystem[CampusCare System]
    CampusCareSystem -->|2. Complaint Status & AI Analysis| Student
    Student -->|3. Submit Post-Resolution Feedback| CampusCareSystem
    
    Admin((Admin / Facility Staff)) -->|4. Update Status & Priority| CampusCareSystem
    CampusCareSystem -->|5. Analytics, Telemetry & AI Insights| Admin
```

### 2.2 DFD Level 1 (Decomposition Diagram)

```mermaid
graph TD
    Student((Student)) -->|User Credentials| P1[1.0 Authentication Subsystem]
    P1 -->|JWT Bearer Token| Student
    
    Student -->|Complaint Title, Desc, Location| P2[2.0 AI Triaging Engine]
    P2 -->|Suggested Category, Priority, Dept| Student
    
    Student -->|Confirmed Complaint Data| P3[3.0 Complaint Lifecycle Service]
    P3 -->|Store Ticket Record| D1[(Complaints Store)]
    
    Admin((Admin Staff)) -->|Query Filter Parameters| P4[4.0 Admin Operations & Analytics]
    D1 -->|Read Tickets & Feedback| P4
    P4 -->|Dashboard Telemetry & Chart Metrics| Admin
    
    Admin -->|Status Update: PENDING -> RESOLVED| P3
    
    Student -->|1-5 Star Rating & Comment| P5[5.0 Feedback Management]
    P5 -->|Store Resolution Feedback| D2[(Feedback Store)]
```

---

## 3. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ COMPLAINT : "submits"
    USER ||--o{ FEEDBACK : "authors"
    COMPLAINT ||--o| FEEDBACK : "receives"

    USER {
        string id PK "cuid / uuid"
        string email UK "unique email"
        string password "bcrypt hash (salt 10)"
        string name "full name"
        enum role "STUDENT | ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    COMPLAINT {
        int id PK "auto-incrementing integer"
        string title "max 120 chars"
        string description "detailed issue text"
        enum category "WIFI_IT | ELECTRICAL | PLUMBING..."
        string location "campus zone / room"
        enum priority "LOW | MEDIUM | HIGH"
        enum status "PENDING | IN_PROGRESS | RESOLVED"
        string userId FK "references USER(id)"
        datetime createdAt
        datetime updatedAt
    }

    FEEDBACK {
        int id PK "auto-incrementing integer"
        int rating "1 to 5 stars"
        string comment "optional student comments"
        int complaintId FK "references COMPLAINT(id) (UNIQUE)"
        string userId FK "references USER(id)"
        datetime createdAt
    }
```

---

## 4. Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String password
        +String name
        +Role role
        +DateTime createdAt
    }

    class Complaint {
        +Int id
        +String title
        +String description
        +ComplaintCategory category
        +String location
        +Priority priority
        +ComplaintStatus status
        +String userId
        +DateTime createdAt
        +DateTime updatedAt
        +isResolved() Boolean
    }

    class Feedback {
        +Int id
        +Int rating
        +String comment
        +Int complaintId
        +String userId
        +DateTime createdAt
    }

    class AuthService {
        +register(name, email, password) Object
        +login(email, password) Object
        +getProfile(userId) User
    }

    class ComplaintService {
        +createComplaint(userId, data) Complaint
        +getStudentComplaints(userId) List~Complaint~
        +getComplaintById(id, userId) Complaint
        +submitFeedback(userId, complaintId, data) Feedback
    }

    class AdminService {
        +getDashboardMetrics() DashboardData
        +getAllComplaints(filters) List~Complaint~
        +updateComplaint(id, data) Complaint
    }

    class AIService {
        +analyzeComplaint(title, desc, loc) AIAnalysisResult
        +generateAdminInsights(metrics) AIInsightsResult
        +fallbackAnalyze(title, desc) AIAnalysisResult
    }

    User "1" --> "0..*" Complaint : files
    User "1" --> "0..*" Feedback : writes
    Complaint "1" --> "0..1" Feedback : contains
    AuthService ..> User : manages
    ComplaintService ..> Complaint : manages
    ComplaintService ..> Feedback : manages
    AdminService ..> Complaint : updates
    AIService ..> Complaint : analyzes
```

---

## 5. Sequence Diagrams

### 5.1 User Authentication & JWT Generation
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as React Frontend
    participant Server as Express Backend
    participant Auth as AuthService
    participant DB as PostgreSQL (Prisma)

    Student->>Browser: Enter Email & Password
    Browser->>Server: POST /api/auth/login
    Server->>Auth: login(email, password)
    Auth->>DB: prisma.user.findUnique({ email })
    DB-->>Auth: User Record with Password Hash
    Auth->>Auth: bcrypt.compare(password, user.password)
    Auth->>Auth: jwt.sign({ userId, role, email })
    Auth-->>Server: Token & User Metadata
    Server-->>Browser: HTTP 200 { success: true, token, user }
    Browser->>Browser: Store Token in localStorage
    Browser-->>Student: Redirect to /student/dashboard
```

### 5.2 Complaint Creation with Groq AI Assistance
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as CreateComplaint Page
    participant Server as Express Backend
    participant AI as AIService (Groq SDK)
    participant DB as PostgreSQL (Prisma)

    Student->>UI: Types Complaint Title & Description
    Student->>UI: Clicks "Analyze with AI"
    UI->>Server: POST /api/ai/analyze-complaint (Bearer JWT)
    Server->>AI: analyzeComplaint(title, description, location)
    
    alt Groq Cloud is Reachable
        AI->>AI: Invoke Groq LLaMA-3.3-70B API
        AI-->>Server: Structured JSON (Category, Priority, Reason)
    else Groq Offline or No Key
        AI->>AI: Execute Heuristic Keyword Fallback Engine
        AI-->>Server: Fallback Structured JSON
    end
    
    Server-->>UI: HTTP 200 { suggestedCategory, suggestedPriority, reason }
    UI->>UI: Auto-populates Category and Priority with Animation
    Student->>UI: Clicks "Submit Official Complaint"
    UI->>Server: POST /api/complaints
    Server->>DB: prisma.complaint.create({ data })
    DB-->>Server: Saved Complaint Record
    Server-->>UI: HTTP 201 { success: true, data: complaint }
    UI-->>Student: Show Success Toast & Redirect to Ticket View
```

### 5.3 Administrative Status Transition & Student Feedback
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    actor Student
    participant Server as Express Backend
    participant DB as PostgreSQL (Prisma)

    Admin->>Server: PATCH /api/admin/complaints/:id { status: "IN_PROGRESS" }
    Server->>DB: prisma.complaint.update(...)
    DB-->>Server: Updated Complaint
    Server-->>Admin: HTTP 200 (Status: IN_PROGRESS)

    Admin->>Server: PATCH /api/admin/complaints/:id { status: "RESOLVED" }
    Server->>DB: prisma.complaint.update(...)
    DB-->>Server: Updated Complaint (RESOLVED)
    Server-->>Admin: HTTP 200 (Status: RESOLVED)

    Student->>Server: POST /api/complaints/:id/feedback { rating: 5, comment: "Resolved quickly!" }
    Server->>DB: Verify complaint.status === "RESOLVED"
    Server->>DB: prisma.feedback.create(...)
    DB-->>Server: Saved Feedback Record
    Server-->>Student: HTTP 201 { success: true, feedback }
```
