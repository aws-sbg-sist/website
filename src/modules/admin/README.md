# Admin Dashboard Frontend & Content-Management UI

**Module Owner:** Member 10  
**Domain Area:** `src/modules/admin/`  
**Target Application:** AWS Student Builder Group Website  

---

## 1. Module Purpose

The Admin Dashboard provides a centralized administrative control room and content-management interface for the AWS Student Builder Group portal. It enables authorized student leads to manage all public-facing content, community rosters, leadership batches, event schedules, learning resources, and media assets.

---

## 2. Current Scaffold Status

This module is currently in **Phase 1 (Scaffold Phase)**.
- **Strict Domain Types:** Defined in `types/index.ts` covering all 10 domain entities and operational state wrappers.
- **Typed Mock Data Fixtures:** Defined in `data/mockAdminData.ts` with internally consistent demo records.
- **Decoupled Data Access Layer:** Implemented in `services/adminRepository.ts` as an asynchronous in-memory CRUD repository.
- **Validation Schemas:** Defined in `schemas/index.ts` with field-level rules and validation contracts matching future Zod schemas.
- **Admin Shell & Navigation:** Implemented in `components/layout/` (`AdminShell`, `AdminSidebar`, `AdminHeader`).
- **Dashboard Overview:** Implemented in `components/overview/DashboardOverview.tsx` deriving live metrics dynamically from the repository.

---

## 3. Directory Structure

```
src/modules/admin/
├── components/
│   ├── layout/
│   │   ├── AdminShell.tsx          # Responsive layout (Sidebar + Header + Main container)
│   │   ├── AdminSidebar.tsx        # Navigation menu for 11 admin sections
│   │   └── AdminHeader.tsx         # Section title, status indicators, and mobile trigger
│   ├── overview/
│   │   └── DashboardOverview.tsx   # Dynamic metric cards, quick actions, and recent activity
│   ├── crud/
│   │   └── README.md               # Architecture documentation for 10 entity managers
│   ├── AdminDashboard.tsx          # Top-level container component
│   └── index.ts                    # Component barrel export
├── data/
│   └── mockAdminData.ts            # Realistic, typed demo fixtures
├── types/
│   └── index.ts                    # Strict TypeScript interfaces for all 10 entities
├── services/
│   └── adminRepository.ts          # Asynchronous mock data-access repository
├── schemas/
│   └── index.ts                    # Validation rules and Zod-compatible schema contracts
├── index.ts                        # Module entry point
└── README.md                       # Comprehensive documentation
```

---

## 4. Managed Domain Entities (10 Entities)

1. **Members (`Member`)**: Community member directory, roles (`member`, `lead`, `co-lead`, `mentor`), department, and active status.
2. **Core Team (`CoreTeamMember`)**: Leadership assignments organized dynamically by `academicYear` (e.g. `"2025-2026"`), order, bio, and social links.
3. **Events (`Event`)**: Technical workshops, hackathons, and webinars with dates, virtual/physical venue links, capacity tracking, and soft archival support.
4. **Articles (`Article`)**: Technical blogs and guides with slug management, summary, markdown payload, tag taxonomy, and draft/published workflow.
5. **Announcements (`Announcement`)**: High/urgent priority broadcast alerts with target audience filters and expiration dates.
6. **Resources (`Resource`)**: Curated AWS architecture guides, study cheat sheets, and starter repositories.
7. **Projects (`Project`)**: Student cloud projects, team roster, tech stack tags, and repository links.
8. **Achievements (`Achievement`)**: Student AWS certification logs, hackathon awards, and credential proof links.
9. **Alumni Teams (`AlumniTeam`)**: Retrospective records and past core team leadership compositions.
10. **Gallery (`GalleryItem`)**: Community event photography and media assets.

---

## 5. Mock Repository Architecture

The architecture enforces strict separation between visual components and storage mechanisms:

```
[ UI Layer: AdminDashboard / CRUD Views ]
                    ↓
[ Service Layer: adminRepository (IAdminRepository) ]
                    ↓
[ Simulated In-Memory Async Adapter (Now) ]  -->  [ Real Authenticated API Endpoints (Later) ]
```

- **Zero Direct Array Mutation:** UI components never manipulate raw mock arrays directly; all operations execute through typed async methods (e.g., `adminRepository.createEvent(payload)`).
- **Simulated Network Latency:** Calls simulate 150–200ms latency to verify loading spinners and async state transitions in the UI.
- **Audit Logging:** Mutations automatically log to an in-memory activity trail accessible via `getRecentActivities()`.

---

## 6. Validation Approach

Form validation contracts are defined in `src/modules/admin/schemas/index.ts`.
- **Pre-submission Client Validation:** Forms validate required fields, email formats, URL schemes, character length constraints, and academic year formats (`YYYY-YYYY`) before dispatching repository mutations.
- **Zod Compatibility:** Schema functions are designed to cleanly transition to `z.object({ ... })` and `@hookform/resolvers/zod` once the technical lead initializes `package.json`.
- **Server Validation Mandate:** Client-side validation is solely for user feedback; the future backend must perform independent server-side validation.

---

## 7. Expected Future API Boundary (For Technical Lead)

When the Technical Lead implements the backend, the following REST or GraphQL endpoints are expected to replace `adminRepository.ts`:

| Domain | Method | Expected Endpoint | Purpose |
|---|---|---|---|
| **Overview** | `GET` | `/api/admin/stats` | Aggregated dashboard metric counts |
| **Audit** | `GET` | `/api/admin/activities` | Recent activity log entries |
| **Members** | `GET, POST` | `/api/admin/members` | List roster / Register new member |
| | `PUT, DELETE` | `/api/admin/members/:id` | Update profile / Remove member |
| **Core Team** | `GET, POST` | `/api/admin/core-team` | List by academic year / Add member |
| | `PUT, DELETE` | `/api/admin/core-team/:id` | Update designation / Remove from batch |
| **Events** | `GET, POST` | `/api/admin/events` | List events / Create event |
| | `PUT, DELETE` | `/api/admin/events/:id` | Update event / Delete event |
| | `PATCH` | `/api/admin/events/:id/archive` | Soft-archive completed event |
| **Articles** | `GET, POST` | `/api/admin/articles` | List articles / Create draft |
| | `PUT, DELETE` | `/api/admin/articles/:id` | Update article / Delete article |
| **Announcements** | `GET, POST` | `/api/admin/announcements` | List / Broadcast announcement |
| | `PUT, DELETE` | `/api/admin/announcements/:id` | Update / Delete announcement |
| **Resources** | `GET, POST` | `/api/admin/resources` | List / Add learning resource |
| | `PUT, DELETE` | `/api/admin/resources/:id` | Update / Delete resource |
| **Projects** | `GET, POST` | `/api/admin/projects` | List / Create project record |
| | `PUT, DELETE` | `/api/admin/projects/:id` | Update / Delete project |
| **Achievements** | `GET, POST` | `/api/admin/achievements` | List / Log student achievement |
| | `PUT, DELETE` | `/api/admin/achievements/:id` | Update / Delete achievement |
| **Alumni Teams** | `GET, POST` | `/api/admin/alumni-teams` | List / Add historical batch |
| | `PUT, DELETE` | `/api/admin/alumni-teams/:id` | Update / Delete alumni batch |
| **Gallery** | `GET, POST` | `/api/admin/gallery` | List / Add photo asset metadata |
| | `PUT, DELETE` | `/api/admin/gallery/:id` | Update / Delete gallery item |

---

## 8. Media & Cloudinary Hand-off Architecture

- **Direct URL Input:** All media fields (e.g. `avatarUrl`, `bannerUrl`, `coverImageUrl`, `thumbnailImageUrl`, `imageUrl`) support direct HTTPS asset URLs.
- **Cloudinary Widget Integration:** During Phase 2, an upload placeholder widget will expose a hand-off signature. Client-side uploads will request a secure signed upload URL from a backend route (`/api/admin/media/sign-upload`) without exposing API secrets on the client.
- **Zero Client Secrets:** Cloudinary API secrets, upload presets with unrestricted signing, and master credentials must NEVER be placed in client-side code.

---

## 9. Authentication & Security Boundary

> [!IMPORTANT]
> **Client-side visual checks do not constitute real security.**
> - The frontend admin shell displays a mock administrator badge for visual layout validation only.
> - The Technical Lead must implement real server-side authentication (e.g., NextAuth.js, AWS Cognito, or JWT HTTP-only cookies) and middleware route guards (`src/middleware.ts`) protecting `/admin/*` routes and API endpoints.
> - The frontend repository never stores tokens, passwords, database URLs, or AWS IAM keys.

---

## 10. Integration Instructions (For Technical Lead)

To mount the Admin Dashboard into the Next.js App Router once the root project is configured:

1. Create `src/app/admin/page.tsx`:
   ```tsx
   import { AdminDashboard } from '@/modules/admin';

   export const metadata = {
     title: 'Admin Dashboard | AWS Student Builder Group',
     robots: 'noindex, nofollow',
   };

   export default function AdminPage() {
     return <AdminDashboard />;
   }
   ```
2. The `AdminDashboard` component is fully self-contained with responsive sidebar, top navigation, metric overview, and section controllers.
3. When ready to connect to real backend APIs, replace the `adminRepository` export in `src/modules/admin/services/adminRepository.ts` with an HTTP/REST adapter targeting `/api/admin/*`.

---

## 11. Known Limitations

- **In-Memory Volatility:** Changes made in the current mock repository persist across view switches within the same browser session, but reset upon hard page reload.
- **No Direct Package Dependencies:** This scaffold was constructed without installing node modules, using standard TypeScript/React interfaces to ensure zero merge conflicts with root project setup.
