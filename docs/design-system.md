# AWS Student Builder Group (AWS SBG) — Design System Specification
**Sathyabama Institute of Science and Technology**  
**Lead Architecture:** Member 01 (Design System, Shared UI Primitives & Motion Language)  
**Target Environment:** Next.js / React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons

---

## 1. Purpose & Scope

This design system serves as the foundational presentation layer for the official AWS Student Builder Group website. It establishes a unified visual and interactive standard across all 11 development modules:
- **Member 01**: Design System & Shared Primitives *(This Module)*
- **Member 02**: Home Experience
- **Member 03**: About & Chapter Mission
- **Member 04**: Core Team & Leadership
- **Member 05**: Member Directory & Profiles
- **Member 06**: Events, Hackathons & Workshops
- **Member 07**: Content Hub & Technical Articles
- **Member 08**: Projects & Student Legacy Builds
- **Member 09**: Gallery, Contact, Join & FAQ
- **Member 10**: Chapter Admin Dashboard
- **Member 11**: Quality Engineering & Integration Testing

**Rule of Isolation:** Member 01 primitives are strictly presentation-focused. They contain no domain business logic, API calls, or route couplings. Other members consume these components directly without modifying them or creating duplicated variants.

---

## 2. Design Philosophy

- **Technical Precision:** Crisp geometry, restrained surfaces, and clear visual hierarchy mirroring AWS console and cloud architecture aesthetics.
- **Single Accent Discipline:** The palette is anchored by a single signature accent color (**AWS Builder Orange `#FF9900`**) against deep slate neutrals (Squid Ink `#0B0F17`).
- **Anti-Slop Restraint:** Strict ban on glowing cyan drop-shadows, arbitrary purple-to-blue gradients, cards-nested-inside-cards, and over-animated page elements.
- **Accessibility-First:** Guaranteed contrast ratios exceeding WCAG AA (minimum 4.5:1 for body copy; 14.2:1 achieved for primary text), full keyboard operability, and strict adherence to `prefers-reduced-motion`.

---

## 3. Design Tokens

Centralized tokens reside in `src/modules/design-system/tokens/`.

### 3.1 Color Palette
| Token Path | Hex / Value | WCAG Contrast | Semantic Role |
| :--- | :--- | :--- | :--- |
| `colors.background.DEFAULT` | `#0B0F17` | Base | Canvas deep slate |
| `colors.surface.DEFAULT` | `#121826` | 1.3:1 vs bg | Primary card & surface |
| `colors.surface.elevated` | `#1A2337` | 1.8:1 vs bg | Floating modals, elevated cards |
| `colors.surface.sunken` | `#080C14` | Recessed | Code blocks, input wells |
| `colors.border.default` | `#2B384E` | High visibility | Container & card borders |
| `colors.text.DEFAULT` | `#F8FAFC` | 14.2:1 (AAA) | Primary headings & body |
| `colors.text.secondary` | `#94A3B8` | 7.1:1 (AA) | Supporting text & metadata |
| `colors.text.muted` | `#64748B` | 4.6:1 (AA) | Tertiary descriptions, placeholders |
| `colors.accent.DEFAULT` | `#FF9900` | 10.4:1 vs bg | AWS Signature Accent |
| `colors.accent.foreground` | `#0B0F17` | 11.2:1 | High-contrast text on accent |
| `colors.success.DEFAULT` | `#10B981` | 6.8:1 (AA) | Success confirmations |
| `colors.warning.DEFAULT` | `#F59E0B` | 8.9:1 (AA) | Warnings & upcoming alerts |
| `colors.error.DEFAULT` | `#EF4444` | 5.2:1 (AA) | Form errors & critical states |
| `colors.info.DEFAULT` | `#38BDF8` | 8.8:1 (AA) | Informational tags & badges |

### 3.2 Typography Scale
Step ratio: 1.25 (Major Third) for balanced product and technical documentation density.
- `display`: 40px / line-height 1.2 / Bold (`text-4xl sm:text-5xl font-bold`)
- `h1`: 32px / line-height 1.25 / Bold (`text-3xl sm:text-4xl font-bold`)
- `h2`: 24px / line-height 1.3 / SemiBold (`text-2xl sm:text-3xl font-semibold`)
- `h3`: 20px / line-height 1.4 / SemiBold (`text-xl sm:text-2xl font-semibold`)
- `h4`: 18px / line-height 1.4 / SemiBold (`text-lg font-semibold`)
- `body-large`: 18px / line-height 1.6 / Regular (`text-lg`)
- `body`: 16px / line-height 1.6 / Regular (`text-base`)
- `body-small`: 14px / line-height 1.5 / Regular (`text-sm`)
- `caption`: 12px / line-height 1.4 / Regular (`text-xs`)
- `label`: 14px / line-height 1.0 / Medium (`text-sm font-medium`)

### 3.3 Spacing, Radius & Elevation
- **Spacing Grid:** `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px), `4xl` (96px).
- **Border Radius:** `none` (0px), `sm` (4px), `md` (6px), `lg` (8px), `xl` (12px), `full` (9999px).
- **Elevation Shadows:** `sm` (ambient subtle), `md` (cards & dropdowns), `lg` (floating dialogs & modals).

---

## 4. UI Primitives Overview

All components are imported via `@/components/ui`:

```typescript
import {
  Button,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  SectionHeader,
  Container,
  Divider,
  Skeleton,
  EmptyState,
  ErrorState,
  Modal,
  Input,
} from "@/components/ui";
```

### 4.1 Button
- **Variants:** `primary` (AWS Orange), `secondary` (Slate panel), `outline` (Subtle border), `ghost` (Transparent), `danger` (Red).
- **Sizes:** `sm` (32px), `md` (40px), `lg` (48px).
- **Props:** `variant`, `size`, `loading`, `disabled`, `fullWidth`, `iconLeft`, `iconRight`, `type`, standard HTML button props.
```tsx
<Button variant="primary" size="md" iconRight={<ArrowRight />}>
  Register for Hackathon
</Button>
```

### 4.2 IconButton
- Accessible icon trigger requiring an `aria-label`.
- Supported variants: `default`, `primary`, `outline`, `ghost`, `danger`.
```tsx
<IconButton
  icon={<Menu />}
  aria-label="Toggle navigation drawer"
  variant="ghost"
  size="md"
/>
```

### 4.3 Badge
- Single-line chips for status and category tags.
- **Variants:** `default`, `accent`, `success`, `warning`, `danger`, `info`.
- **Sizes:** `sm`, `md`, `lg`.
```tsx
<Badge variant="accent" size="sm" icon={<Sparkles />}>
  AWS Certified
</Badge>
```

### 4.4 Card
- Composable slot architecture.
- **Variants:** `default`, `interactive` (with hover & focus ring), `elevated`, `bordered`.
```tsx
<Card variant="interactive">
  <CardHeader action={<Badge variant="success">Active</Badge>}>
    <h3 className="font-semibold text-white">Serverless Compute Lab</h3>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-slate-400">Deep-dive into AWS Lambda and EventBridge patterns.</p>
  </CardContent>
  <CardFooter>
    <span className="text-xs text-slate-500">Duration: 2 Hours</span>
  </CardFooter>
</Card>
```

### 4.5 SectionHeader
- Eliminates inconsistent page headings and descriptions across team members.
- Supports `eyebrow`, `title`, `description`, `action`, and `alignment` (`left` | `center` | `right`).
```tsx
<SectionHeader
  eyebrow="EVENTS"
  title="Upcoming AWS Community Sessions"
  description="Hands-on cloud workshops, hackathons, and certifications."
  action={<Button size="sm">Explore All</Button>}
  alignment="left"
/>
```

### 4.6 Container
- Enforces standardized max-widths and responsive horizontal padding.
- **Sizes:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `full` (100%).
```tsx
<Container size="xl">
  {/* Module content */}
</Container>
```

### 4.7 Divider
- Structural horizontal or vertical separator.
- Supports `orientation` (`horizontal` | `vertical`), `spacing` (`none` | `sm` | `md` | `lg`), `variant` (`subtle` | `strong`), and optional middle `label`.
```tsx
<Divider label="OR CONTINUE WITH" spacing="md" />
```

### 4.8 Skeleton
- Async loading state placeholder with `motion-safe:animate-pulse`.
- Shapes: `text`, `title`, `avatar`, `image`, `card`, or custom.
```tsx
<Skeleton shape="title" className="w-48" />
```

### 4.9 EmptyState & ErrorState
- Meaningful empty and error boundaries.
```tsx
<EmptyState
  icon={<Calendar />}
  title="No upcoming events"
  description="Check back soon for new AWS SBG sessions."
  action={<Button size="sm" variant="outline">View Archive</Button>}
/>

<ErrorState
  title="Unable to load cloud metrics"
  description="Please check your connection and retry."
  action={<Button size="sm" variant="primary" onClick={retry}>Try Again</Button>}
/>
```

### 4.10 Modal
- Accessible dialog supporting ARIA modal standards, body scroll lock, Escape key dismissal, and trapped focus cycling.
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Join AWS Student Builder Group"
  description="Complete your student registration for chapter access."
>
  <div className="space-y-4">
    {/* Dialog Content */}
  </div>
</Modal>
```

### 4.11 Input
- Accessible text input with automatic `htmlFor` association, `aria-invalid`, `aria-describedby`, error state text, and icon adornments.
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="student@sathyabama.ac.in"
  error={error}
  helperText="Official university email required"
  leftIcon={<Mail />}
  required
/>
```

---

## 5. Motion Guidelines

Member 01 provides **only three** primary motion primitives, imported from `@/modules/design-system/motion`:

```typescript
import { FadeIn, Reveal, HoverCard } from "@/modules/design-system/motion";
```

### 5.1 Primitives
1. **`FadeIn`**: Page/element entrance with subtle slide (12px) and opacity fade.
   - Props: `direction` ('up' | 'down' | 'left' | 'right' | 'none'), `delay`, `duration`.
2. **`Reveal`**: Viewport-triggered scroll reveal executing once when entering view.
   - Props: `distance`, `duration`, `delay`, `once`.
3. **`HoverCard`**: Controlled interactive card lift (3px) and micro-scale (1.008x) with tap feedback.

### 5.2 Reduced Motion Mandate
All motion primitives wrap Framer Motion's `useReducedMotion()`. When `prefers-reduced-motion: reduce` is enabled:
- All positional translations (`x`, `y`) are forced to `0`.
- Scale transforms are disabled.
- Animation durations drop to near-zero (`0.05s`) for instant accessibility.

### 5.3 When NOT to Use Motion
**Strict Anti-Patterns:**
1. **Never use motion for users with reduced motion preference.**
2. **Never animate large lists:** Do not stagger 50+ item grids; it causes CPU lag and delays scannability.
3. **Never animate repetitive content:** Standard navigation, tabular data, and repeated cards must stay static.
4. **Never delay task completion:** Interactive buttons, modals, and forms must open immediately without sluggish 1-second transitions.
5. **Never use purely decorative excessive effects:** No floating 3D spheres, parallax distortion, or cursor followers.

---

## 6. Accessibility (A11y) Rules

1. **Focus Ring:** Every interactive element has an explicit focus style: `focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2`.
2. **Semantic Buttons:** All clickable items must use the `<Button>` or `<IconButton>` primitives rather than unadorned `div` tags with `onClick`.
3. **Labels on Form Inputs:** Inputs MUST have an associated `label` or `aria-label`.
4. **Icons Need Names:** Any icon-only button MUST provide an explicit `aria-label`.
5. **Error Announcement:** All validation errors render with `role="alert"` and link to the input via `aria-describedby`.

---

## 7. Responsive Rules

All components are responsive out of the box:
- **Mobile (320px–375px):** Minimum touch target of 36px–44px, full-width button actions where appropriate, horizontal overflow prevention (`overflow-hidden`).
- **Tablet (768px):** 2-column card layouts, balanced modal widths.
- **Desktop (1024px–1280px):** 3-column / 4-column grids constrained within `<Container size="xl">`.

---

## 8. Do's and Don'ts for Team Members

| Do | Don't |
| :--- | :--- |
| **Do** import primitives from `@/components/ui`. | **Don't** write custom `<button>` or `<input>` classes with bespoke styling. |
| **Do** use `<Container>` for page layouts. | **Don't** declare custom `max-w-[1340px]` or random padding values in pages. |
| **Do** use `<SectionHeader>` for section titles. | **Don't** create standalone `<h2>` tags with inconsistent font sizes. |
| **Do** use `colors.accent` tokens for highlight elements. | **Don't** introduce neon green, pink, or purple gradients. |
| **Do** use `<FadeIn>` or `<Reveal>` sparingly. | **Don't** wrap entire pages in continuous looping animations. |
| **Do** test your pages with keyboard Tab navigation. | **Don't** remove browser focus rings (`outline-none` without `ring`). |

---

## 9. Integration Instructions for Team Members

### 9.1 Dual-Mode Development & Next.js App Router
This repository is engineered for dual compatibility:
1. **AI Studio / Fast Preview:** Powered by Vite (`npm run dev`) for instantaneous live sandboxing on port 3000.
2. **Next.js App Router:** Native compatibility (`npm run dev:next` or `npm run build:next`). All page routes live in standard Next.js App Router conventions:
   - `src/app/layout.tsx`: Root layout with dark theme, font smoothing, and metadata.
   - `src/app/page.tsx`: Root route mapping.
   - `src/app/design-system/page.tsx`: Design System showcase route.
   - `next.config.mjs`: Transpilation settings for `lucide-react`, `motion`, and `framer-motion`.

### 9.2 Motion Library Compatibility
Both `motion` (`motion/react`) and `framer-motion` are supported and installed. Team members can import motion primitives directly from `@/modules/design-system/motion`:
```typescript
import { FadeIn, Reveal, HoverCard, motion, useReducedMotion } from "@/modules/design-system/motion";
```

### 9.3 Semantic Tailwind Tokens (Avoid Hardcoded Hex Values)
All 11 modules should use semantic utility classes instead of raw hex values:
- Backgrounds: `bg-background` (`#0B0F17`), `bg-surface` (`#121826`), `bg-surface-elevated` (`#1A2337`), `bg-surface-sunken` (`#080C14`)
- Text: `text-primary` (`#F8FAFC`), `text-secondary` (`#94A3B8`), `text-muted` (`#64748B`), `text-accent` (`#FF9900`)
- Borders: `border-default` (`#2B384E`), `border-subtle` (`#1E293B`), `border-accent` (`#FF9900`)
- Accent Fill: `bg-accent` (`#FF9900`), `hover:bg-accent-hover` (`#FFA724`)

---

## 10. Automated Testing & Verification Suite

Member 01 provides an automated test suite verifying all 8 core acceptance criteria:
- **CLI Runner:** Run `npm test` to execute the 11 automated test cases.
- **In-Browser Runner:** Navigate to `/design-system` and select the **Test Suite & A11y** tab to run checks interactively with microsecond timing.
- **Test Criteria Covered:**
  1. Button variants, aliases (`accent`, `error`), disabled state, aria-busy loading state, and polymorphic `as` prop.
  2. IconButton required `aria-label` attribute and composition.
  3. Badge semantic status variants.
  4. Card compound primitives (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
  5. Input accessibility (`htmlFor` binding, `aria-invalid`, `aria-describedby`, and container layout).
  6. Modal WAI-ARIA 1.2 dialog standards, Escape key dismissal, scroll lock, and SSR guards.
  7. Reduced-motion compliance (verifying translation offsets = 0px).
  8. Design token color and grid contracts.

---

## 11. Quickstart Commands

```bash
# Install all dependencies
npm install

# Run Vite dev server (AI Studio preview environment)
npm run dev

# Run automated test suite
npm test

# Run Next.js App Router dev server
npm run dev:next

# Build production bundle
npm run build
```
