# HR management agent instructions

## Current scope

This repository is a frontend learning demo using Astro, React 19, TypeScript, and Chakra UI 3. The Next.js migration is planned in `README.md`; it has not been implemented. Keep current implementation details separate from planned behavior in documentation.

The current login selects one of ten fictional users without a password. Fixed credentials per role are part of the planned migration. Role checks are client-side demo behavior; there is no backend or database.

## Development

Use Node.js 24 from `.nvmrc` and npm. Keep `package-lock.json`.

```sh
npm ci
npm run dev -- --background
npm run format:check
npm run build
npm run preview
```

`build` currently runs `astro build`, without a separate type-check step. There are no configured `test` or `lint` scripts. Do not document them as available commands.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

The equivalent npm commands are `npm run astro -- dev stop`, `npm run astro -- dev status`, and `npm run astro -- dev logs`. The site base is `/hr-management/`.

## Code map and state

- `src/pages/index.astro` mounts `src/App.tsx` with `client:load`; Astro owns the document in `src/layouts/Layout.astro`.
- `src/App.tsx` currently owns provider composition, the selected module path, and History API navigation. Module URLs are not separate Astro routes.
- `src/contexts/AuthContext.tsx` owns the demo session and permission map. The current `hr_auth_user` storage value is the selected user object.
- `src/data/hr-users.ts` contains the fictional users; role types and other shared models live in `src/types/index.ts`.
- `src/utils/navigation.ts` defines sidebar items by role. Keep it aligned with available modules and the permission map.
- `src/contexts/ChakraProvider.tsx` owns theming. Layout components are in `src/components/layout/`; feature screens are in `src/features/`.
- `src/data/` supplies mock business data. Feature mutations generally use component state; settings use the `hr_settings` localStorage key. Do not describe these as server-backed or generally persistent.

## Planned migration constraints

Use the plan in `README.md` when implementing the requested Next.js migration:

- Keep the app static and use App Router with `output: 'export'`, the existing `/hr-management` base path, and trailing slashes.
- Preserve the four roles: `head_of_hr`, `hr`, `hr_recruiter`, and `hr_accounting`. Replace the account picker with one fixed credential pair per role, checked locally.
- Keep session restoration and Chakra in client providers. Persist a user ID and resolve it through the local catalog; handle loading before redirecting or rendering role-specific content.
- Centralize client-side route permissions, including direct URL entry. Replace manual `pushState`/`popstate` navigation with Next.js navigation APIs.
- Reuse the existing modules and mock records. Pre-generate employee detail routes for the seeded IDs with `generateStaticParams()`.
- Do not add a backend, database, Auth.js, server sessions, API routes, or Server Actions for this demo plan. Do not read browser storage during prerendering; restore it after the client mounts.
- Update package scripts, routing documentation, and the deployment artifact from `dist/` to `out/` when the migration actually lands.

## Verification

For current code changes, run `npm run format:check` and `npm run build`, then exercise affected screens and roles. Documentation-only edits need a diff check rather than a full build.

For the migration, also verify invalid credentials, login and logout for every role, session restoration after reload, denied routes entered directly, browser history, and direct loading of exported routes under the deployment base path.

The current workflow publishes the Astro build in `dist/` on pushes to `main`. Do not commit generated build files.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
