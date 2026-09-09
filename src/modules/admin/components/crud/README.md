# Admin CRUD Components Architecture

This directory houses the dedicated Content Management interfaces for all 10 domain entities in the AWS Student Builder Group portal.

## Scaffolding Status

In this initial scaffold phase, the domain types (`../types/index.ts`), mock fixtures (`../data/mockAdminData.ts`), async repository layer (`../services/adminRepository.ts`), and validation rules (`../schemas/index.ts`) have been established.

During the full CRUD implementation phase, the following entity managers will be implemented here:

1. **`MembersManager.tsx`** — Roster list, role filter (`member`, `lead`, `co-lead`, `mentor`), active/inactive toggle, and member detail modal.
2. **`CoreTeamManager.tsx`** — Batch-oriented management by `academicYear` (e.g. `2025-2026`), ordering, designation editing, and alumni promotion.
3. **`EventsManager.tsx`** — Event calendar scheduling, virtual link / venue management, registration capacity trackers, and soft archival (`archiveEvent()`).
4. **`ArticlesManager.tsx`** — Technical article manager, slug generation, draft/published workflow, tag assignment, and cover image media hand-off.
5. **`AnnouncementsManager.tsx`** — Broadcast banner editor, priority badges (`low`, `medium`, `high`, `urgent`), audience targeting (`all`, `members`, `core_team`), and expiration scheduling.
6. **`ResourcesManager.tsx`** — Learning resource repository, category filters (`cloud_architecture`, `devops`, `serverless`, etc.), and resource type flags (`pdf`, `repo`, `link`, `video`).
7. **`ProjectsManager.tsx`** — Student project showcase manager, team member tagging, GitHub repo & live demo link management, and progress states (`in_progress`, `completed`, `archived`).
8. **`AchievementsManager.tsx`** — Certification clearance logs, hackathon accolades, verification URLs, and academic year grouping.
9. **`AlumniTeamsManager.tsx`** — Historical core team retrospective records, alumni member rosters, and milestone highlights.
10. **`GalleryManager.tsx`** — Visual media asset catalog, category categorization, and Cloudinary upload placeholder integration.

---

## Architectural Principles for CRUD Views

- **Decoupled State Machine**: Each CRUD view interacts strictly with `adminRepository` methods via typed async calls (`get*`, `create*`, `update*`, `archive*`, `delete*`).
- **Destructive Action Safety**: Every delete and archive action MUST trigger a confirmation dialog identifying the specific entity title before proceeding.
- **Visual Feedback**:
  - `isLoading`: Centered spinner / table row skeletons during initial fetch.
  - `isSaving`: Button spinner and disabled state during create/update mutations.
  - `successMessage`: Auto-dismissing success toast alert upon operation resolution.
  - `error`: Inline alert banner displaying descriptive error feedback on validation or repository rejections.
- **Media / Cloudinary Hand-off**:
  - Media input fields accept direct image URLs and include an interactive **Cloudinary Upload Placeholder widget** for future client-side direct upload widget integration.
