# 📊 Project Manager - Dashboard Documentation

This document provides an overview of the various dashboard pages available in the Project Manager application, categorized by user role and functionality.

## 🔐 Role-Based Dashboards

### 1. Admin Dashboard
- **Route:** `/dashboard/admin`
- **Access:** `ADMIN` only
- **Key Features:**
  - **System Overview:** View total users, active projects, and task stats.
  - **Approval Workflow:** Manage pending user registration requests.
    - **Actions:** unified consolidated view to Approve (assign Role/Dept) or Reject requests directly from the table.
    - **Analytics:** View "Approvals Today" and "Pending Count".
  - **User Management:** Link to full user management table.

### 2. Manager Dashboard
- **Route:** `/dashboard/manager`
- **Access:** `MANAGER` or `ADMIN`
- **Key Features:**
  - **Team Overview:** View team members and their workload.
  - **Project Oversight:** High-level view of all projects managed by the user.
  - **Performance Metrics:** Track team task completion rates.

### 3. Personal Dashboard (My Dashboard)
- **Route:** `/dashboard/me`
- **Access:** All Authenticated Users
- **Key Features:**
  - **Command Center:** Central hub for personal work.
  - **My Projects:** Quick access to projects where the user is a member.
  - **Recent Activity:** Feed of recent updates on assigned tasks.

---

## 🚀 Feature Pages

### 4. Projects Hub
- **Route:** `/projects`
- **Features:**
  - **Kanban / List View:** Toggle between board and list layouts.
  - **Create Project:** Managers/Admins can initiate new projects.
  - **Filtering:** Filter projects by status, priority, or owner.

### 5. My Tasks
- **Route:** `/my-tasks`
- **Features:**
  - **Personalized List:** Aggregated view of ALL tasks assigned to the current user across all projects.
  - **Quick Actions:** Mark complete, update priority, or add subtasks.
  - **Grouping:** Group by Due Date, Project, or Priority.

### 6. Reports & Analytics
- **Route:** `/reports`
- **Features:**
  - **Visualizations:** Charts and graphs showing project velocity and task distribution.
  - **Export:** Ability to export data for external reporting.

### 7. Todo List
- **Route:** `/todos`
- **Features:**
  - **Private List:** Personal scratchpad for quick, non-project related tasks.
  - **Simple Interface:** Fast add/remove functionality.

---

## ⚙️ Utility Pages

### 8. User Profile
- **Route:** `/dashboard/profile`
- **Features:**
  - **Role Awareness:** UI adapts based on user role (e.g., Technicians see workload, Managers see team health).
  - **Settings:** Update personal information and preferences.

### 9. Queue Status
- **Route:** `/auth/queue`
- **Features:**
  - **Real-time Status:** Live inspection of approval process.
  - **Cyberpunk UI:** Gamified "Tech" aesthetic with animated progress.
  - **Stats:** Shows "Users Ahead" and "Estimated Wait Time".
