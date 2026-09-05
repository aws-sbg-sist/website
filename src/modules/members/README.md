# Members Directory Module

## Purpose

The Members Directory module provides a scaffolded component to display AWS Student Builders Group team members. This module will eventually showcase member profiles with their roles, teams, departments, and other relevant information.

## Current Status

**Phase:** Scaffolding / Checkpoint Completion

- ✅ Basic component skeleton created
- ✅ Type definitions established
- ✅ Mock member data integrated
- ⚠️ **Currently using mock data only** — no backend integration or dynamic data loading
- ⏳ UI is minimal and unstyled — design polish and component composition pending

## Module Structure

```
src/modules/members/
├── types/
│   └── index.ts          # TypeScript interfaces (Member, MembersDirectoryContent)
├── data/
│   └── mockData.ts       # Mock member dataset (6 sample members)
├── components/
│   ├── MembersDirectory.tsx   # Main component (displays members list)
│   └── index.ts               # Component exports
└── README.md             # This file
```

## Expected Future Functionality

### Phase 2: Design & UI Polish

- Integration with design system components (Card, Badge, Container, etc.)
- Responsive layout and typography alignment
- Visual hierarchy and spacing refinement

### Phase 3: Data & Filtering

- Search functionality to find members by name
- Filter options by team, department, or year
- Sort capabilities

### Phase 4: Advanced Features

- Individual member profile pages (if required)
- Modal or detail view for expanded member information
- Connection to backend/database for dynamic member data
- Member roles and permissions integration

## Technical Notes

- Component assumes mock data structure; ready for API integration
- No authentication or admin functionality present
- Built with React 19 + TypeScript following module conventions
- Aligns with existing `about` module pattern for consistency

## How to Use

```typescript
import { MembersDirectory } from "@/modules/members/components";

export default function Page() {
  return <MembersDirectory />;
}
```

## Dependencies

- React 19
- TypeScript
- Mock data in `data/mockData.ts` (replace with API calls in future phases)

---

**Last Updated:** 2026-09-05  
**Status:** Ready for Phase 2 (Design Integration)
