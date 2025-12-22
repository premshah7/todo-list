# Project Status and Tasks

## ✅ Completed Tasks

### Authentication (Unified with NextAuth v5)
- [x] Upgrade `next-auth` to beta and configure `auth.config.ts`
- [x] Fix `proxy.ts` and `lib/next-auth.ts` types
- [x] Implement Register Server Action and connect to UI
- [x] Standardize Login/Register pages
- [x] Fix redirects and protected routes (`middleware.ts`)

### Projects
- [x] Fix `getProjects` data mapping (PascalCase -> camelCase) for `ProjectsPage`
- [x] Implement redirect from `/projects/[projectId]` to `/projects/[projectId]/board`
- [x] Fix `asChild` prop usage in project buttons
- [x] Update `ProjectBoardPage` to handle `params` as Promise (Next.js 15)

### Tasks (Read)
- [x] Fix `TaskDetailPage` data mapping and `params` handling
- [x] Ensure `ProjectBoard` correctly displays task lists and tasks
- [x] Fix API route `/api/projects/[projectId]/data` for proper data fetching

### UI/UX Fixes
- [x] Resolve `asChild` runtime errors in `KanbanColumn`, `ProjectsPage`, etc.
- [x] Fix Status Dropdown visibility in `NewTaskPage` (async params, controlled input)
- [x] Fix React "value vs selected" warning for select inputs

### Backend/Database
- [x] Add missing fields to Prisma Schema (`TaskHistory` Old/NewValue, `Tasks` Position)
- [x] Regenerate Prisma Client to fix Type Errors
- [x] Fix variable naming typos in `actions/tasks.ts` (`createtasks` -> `createTask`, etc.)

## 🚧 In Progress / Known Issues

### Tasks (Create/Update)
- [ ] **Fix Task Creation**: User reports failure to create tasks.
    - *Status*: Attempted mapping fix (CamelCase -> PascalCase) in `actions/tasks.ts`. User reported continued failure.
    - *Next Step*: Debug server-side logs to identify specific Prisma error or validation failure.

### Clean Code / Maintenance
- [ ] Address lingering ESLint warnings (verify if they are real or cache issues)
- [ ] Verify `Delete` and `Update` operations for Projects and Tasks fully work from UI

## 📝 Planned
- [ ] Add more comprehensive error handling to UI (Toasts/Alerts)
- [ ] Implement Drag-and-Drop persistence (verify `moveTask` action matches UI payload)
