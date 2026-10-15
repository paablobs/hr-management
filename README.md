# HR Management Platform

A frontend demo for Human Resources workflows, built with Astro, React, Chakra UI, and TypeScript. All business data is fictional; there is no backend or database.

The Next.js migration is planned, not implemented. The current app still uses Astro and the demo-account picker. The fixed-credential login described below belongs to the migration plan.

## Features

- **Role-Based Access Control (RBAC)** - 4 roles: Head of HR, HR Manager, HR Recruiter, HR Accounting
- **Employee Management** - 50 employees with search, filter, sort, and detail views
- **Vacation Management** - Approval/rejection workflow with statistics
- **Salary Management** - Overview, distribution charts, and salary history
- **Accounting** - Monthly payroll tracking with paid/pending/failed statuses
- **Recruitment** - Candidate database with Kanban pipeline (drag-and-drop)
- **Organization Chart** - Interactive company hierarchy tree
- **HR Analytics** - KPIs, department distributions, recruitment funnel
- **Notification Center** - Read/unread notifications per user role
- **Settings** - Profile, notification preferences, appearance, demo reset

## Current stack

- [Astro](https://astro.build) - Web framework
- [Chakra UI](https://chakra-ui.com) - Component library
- [TypeScript](https://typescriptlang.org) - Type safety
- [React](https://react.dev) - Interactive components

## Development

Use Node.js 24 from `.nvmrc` and npm.

```bash
npm ci
npm run dev
```

Open `/hr-management/` on the development server. To start Astro in background mode, use `npm run dev -- --background`. Manage it with `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop`.

## Current demo login and state

Select any of the 10 demo accounts on the login screen to explore different role-based experiences.

There is no password field in the current login. The four roles are `head_of_hr`, `hr`, `hr_recruiter`, and `hr_accounting`. `src/contexts/AuthContext.tsx` defines permissions and persists the selected user object under `hr_auth_user` in `localStorage`.

Settings use `hr_settings` in `localStorage`. Feature edits, such as vacation decisions, candidate stages, and payroll status, use component state and can reset when a module is remounted or the page reloads. This is a UI demo, not server-enforced authentication or authorization.

## Code map

```text
astro.config.mjs                 React integration and /hr-management/ base
src/pages/index.astro            mounts the React app with client:load
src/layouts/Layout.astro         HTML document and shared styles
src/App.tsx                      providers and manual client-side navigation
src/contexts/AuthContext.tsx     demo session and role permissions
src/contexts/ChakraProvider.tsx  theme and component provider
src/components/layout/          app shell, sidebar, and top bar
src/features/                   HR screens and local interactions
src/data/                       fictional employees, users, and other records
src/types/index.ts              shared domain types
src/utils/navigation.ts         sidebar destinations by role
```

The current app switches modules with React state and the browser History API. These module paths are not separate Astro pages; do not assume every nested URL supports a direct load on static hosting.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Serve the production build
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

There are no configured test or lint scripts. For code changes, check formatting, build, and manually exercise the affected screens and roles.

## Planned Next.js migration

Keep the project as a learning demo with local data and dummy authentication. No backend is needed for this plan.

1. Replace the Astro entry point with Next.js App Router. Configure `output: 'export'`, `basePath: '/hr-management'`, and `trailingSlash: true` for GitHub Pages.
2. Create `/login` and explicit routes for the existing modules. Put the shared app shell in a `(demo)` route-group layout; the group name will not appear in URLs. Replace manual History API navigation with `Link`, `usePathname`, and `useRouter`.
3. Keep Chakra and session state in client providers. Preserve existing feature modules and mock records. Generate `/employees/[id]` pages at build time with `generateStaticParams()` for the seeded employee IDs.
4. Replace the account picker with four fixed demo credential pairs, one per role. Proposed usernames are `head`, `hr`, `recruiter`, and `accounting`, each with password `demo1234`. These credentials are not implemented in the current app.
5. Persist the selected user ID, restore it against the local account catalog, and distinguish restoring, authenticated, and anonymous states. Centralize route permissions in a client guard, including direct URL entry, and provide logout and a forbidden-route state.
6. Verify invalid credentials, each role's allowed and denied routes, session restoration, logout, browser history, direct loading of exported routes, and the `/hr-management/` base path.

This version would teach App Router, persistent layouts, client providers, and static rendering. Server Components would execute during the build; server sessions, API routes, and Server Actions are outside this plan.

## Deployment

The current GitHub Actions workflow builds the Astro app with Node.js 24 on pushes to `main` and publishes `dist/` to GitHub Pages. The planned Next.js migration must update the artifact path to its static export directory, `out/`.

See `AGENTS.md` for the current development instructions and migration constraints.
