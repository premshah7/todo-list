# Project Manager - Production-Ready Task Management Application

A modern, full-stack project and task management application built with Next.js 15, TypeScript, Prisma, and NextAuth.

## 🚀 Features

- **Authentication**: Secure login/registration with NextAuth and bcrypt password hashing
- **Project Management**: Create, edit, and manage projects with team members
- **Kanban Board**: Drag-and-drop task management with @dnd-kit
- **Task Management**: Comprehensive CRUD operations with priorities, due dates, and assignments
- **Collaboration**: Task comments and activity history tracking
- **Analytics**: Visual reports with Recharts showing task distribution and team workload
- **User Management**: Role-based access control (Admin/User)
- **Responsive Design**: Modern UI with Tailwind CSS and dark mode support

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (beta)
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Validation**: Zod + React Hook Form
- **Password Hashing**: bcryptjs

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (or any PostgreSQL database)
- npm or yarn package manager

### 1. Clone and Install

```bash
cd project-manager
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Replace the `DATABASE_URL` with your Neon database connection string.

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 3. Initialize Database

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Default Roles

Create default roles in your database (you can use Prisma Studio or run this SQL):

```sql
INSERT INTO roles (id, "roleName") VALUES 
  (gen_random_uuid(), 'Admin'),
  (gen_random_uuid(), 'User');
```

Or use Prisma Studio:
```bash
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Create Your First User

1. Navigate to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Register a new account
3. Sign in at [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)

## 📁 Project Structure

```
project-manager/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── projects/      # Project management
│   │   ├── my-tasks/      # Personal tasks
│   │   ├── tasks/         # Task details
│   │   ├── users/         # User management
│   │   └── reports/       # Analytics & reports
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Root redirect
├── actions/               # Server actions
│   ├── auth.ts           # Authentication actions
│   ├── projects.ts       # Project CRUD
│   └── tasks.ts          # Task CRUD
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── kanban-board.tsx  # Kanban implementation
│   ├── sidebar.tsx       # Navigation sidebar
│   └── ...
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client singleton
│   ├── next-auth.ts      # NextAuth configuration
│   ├── auth.ts           # Password hashing
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
├── types/                 # TypeScript types
└── ...
```

## 🎯 Key Features Guide

### Kanban Board

- Navigate to any project and click "View Board"
- Drag tasks between columns (Pending, In Progress, Completed)
- Tasks automatically update their status when moved
- Click any task card to view details

### Task Management

- Create tasks with title, description, priority, assignee, and due date
- View task details with full history and comments
- Add comments to collaborate with team members
- Track all changes through the activity timeline

### Analytics

- View comprehensive reports in the Reports section
- See task distribution by status and priority
- Monitor team workload across members
- Track project progress with visual charts

## 🔐 User Roles

- **Admin**: Full access to all features
- **User**: Can create projects, manage tasks, and collaborate

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `DATABASE_URL`: Your production Neon database
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: Your production domain

### Recommended Platforms

- **Vercel** (recommended for Next.js)
- **Railway**
- **Render**
- **AWS/GCP/Azure**

## 📝 Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Role**: User roles (Admin, User)
- **UserRole**: Many-to-many relationship for user roles
- **Project**: Project containers for tasks
- **ProjectMember**: Project team members
- **TaskList**: Kanban columns within projects
- **Task**: Individual tasks with assignments
- **TaskComment**: Comments on tasks
- **TaskHistory**: Audit trail for task changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is MIT licensed.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Check SSL mode is set to `require`

### Authentication Not Working

- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check `NEXTAUTH_URL` matches your domain

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Ensure Node.js version is 18+

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
