# Project Status and Tasks

## ✅ Recently Completed

### Tasks (Create & Visibility)
- [x] **My Tasks Visibility**: Ensure tasks created via UI display in "My Tasks" (added default assignment logic).
- [x] **Global Task Creation**: Implemented global creation flow from "My Tasks" page.
- [x] **Unified Task Form**: Refactored `GlobalTaskForm` to `TaskForm` for reuse in both Global and Project contexts.
- [x] **Project Selection Logic**: Auto-select project if only one exists; ensure dropdown visibility in global context.
- [x] **Validation Fixes**: Fixed `status: null` error by handling disabled/readOnly inputs correctly.
- [x] **Async Params Fix**: Fixed runtime error in `NewProjectTaskPage` by awaiting `params`.

## 🚧 In Progress / Known Issues

### Clean Code / Maintenance
- [ ] Address lingering ESLint warnings (verify if they are real or cache issues)
- [ ] Verify `Delete` and `Update` operations for Projects and Tasks fully work from UI

## 📝 Planned
- [ ] Add more comprehensive error handling to UI (Toasts/Alerts)
- [ ] Implement Drag-and-Drop persistence (verify `moveTask` action matches UI payload)

### Clean Code / Maintenance
- [ ] Address lingering ESLint warnings (verify if they are real or cache issues)
- [ ] Verify `Delete` and `Update` operations for Projects and Tasks fully work from UI

## 📝 Planned
- [ ] Add more comprehensive error handling to UI (Toasts/Alerts)
- [ ] Implement Drag-and-Drop persistence (verify `moveTask` action matches UI payload)
