# Core Team Module

## Purpose

Member 04 provides the functional Core Team landing section, member cards, and reusable individual profile presentation. It groups members by team and exposes selection callbacks for application-level navigation.

## CoreMember contract

```ts
export interface CoreMember {
  id: string;
  name: string;
  year: string;
  department: string;
  teamName: string;
  teamAbout?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  about?: string;
}
```

The stable public module API is available from `src/modules/core-team`:

```tsx
import {
  CoreMemberProfile,
  CoreTeam,
  getCoreMemberById,
} from "./src/modules/core-team";
import type { CoreMember } from "./src/modules/core-team";
```

## Data source

The current implementation uses safe mocked records in `data/mockData.ts`. Presentation components consume `CoreMember` objects and do not import the mock array directly.

## Data adapter

The data boundary is `data/index.ts`:

- `getCoreMembers()` returns the current `CoreMember[]` source.
- `getCoreMemberById(id)` accepts a string and returns `CoreMember | undefined`.

The adapter can later be backed by another data source without changing the profile or card contracts.

## Landing integration

`CoreTeam` accepts the application-owned callback:

```tsx
<CoreTeam onMemberSelect={(member) => navigate(`/core-team/${member.id}`)} />
```

The callback receives the selected `CoreMember`; the module does not assume a routing library.

## Profile route

The intended route is:

```text
/core-team/<id>
```

The future application layer should:

1. Extract `<id>` from the route.
2. Pass it to `getCoreMemberById(id)`.
3. Render `CoreMemberProfile` with the returned `CoreMember` when one exists.
4. Render the application's not-found state when the result is `undefined`.

`CoreMemberProfile` receives a resolved `CoreMember` and an optional `onBack` callback. The module does not own the application router or global 404 behavior.

## Missing member

An unknown ID produces `undefined` from `getCoreMemberById`. The application or router integration layer is responsible for the final not-found experience.

## Accessibility and edge cases

Member cards and profiles display essential information without hover. Missing or failed profile images use initials with an accessible fallback label. Missing team or member descriptions use plain fallback text. LinkedIn is rendered only for a provided non-empty URL, opens in a new tab with `rel="noreferrer"`, and is labeled as an external destination.

## Historical archive

Previous core-team history is not owned by this module. The legacy module or application integration layer should supply the natural archive entry point when that feature is available.

## Styling

This implementation intentionally focuses on structure, data contracts, accessibility, and integration boundaries. Visual styling is handled separately.

## Backend

The module is currently backend-independent and uses mocked data. Its components consume `CoreMember` objects rather than API, MongoDB, Cloudinary, environment-variable, or request-specific response shapes.

The repository currently has no application entry point or router, so route registration is intentionally not implemented here.
