## Environment Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file:

```env
DATABASE_URL="YOUR_NEON_DATABASE_URL_HERE"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Setup Database

**Connect to your Neon Database:**

1. Get your Neon connection string from your Neon dashboard
2. Replace `DATABASE_URL` in `.env` with your connection string

**Generate Prisma Client and Push Schema:**

```bash
npx prisma generate
npx prisma db push
```

**Seed Default Roles:**

```bash
npx prisma studio
```

In Prisma Studio, manually create two roles:
- Role: `Admin`
- Role: `User`

### Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Create Your Account

1. Go to `/auth/signup`
2. Register with username, email, and password
3. Sign in at `/auth/signin`

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure you set:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` 
- `NEXTAUTH_URL` (your production domain)

Run build command: `npm run build`

Start command: `npm start`
