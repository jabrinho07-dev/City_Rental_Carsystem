# City Rental Car

Car rental site and API in one Next.js app. PostgreSQL is hosted on Neon so the same project can deploy on Vercel.

The screens keep the existing layout and booking flow. Sign-in uses Neon when `DATABASE_URL` is set. Until that variable exists, the demo accounts below still sign in from the app itself.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Database

Do not commit the Neon connection string. `.env` is ignored by Git. The schema that creates the tables is already in `prisma/schema.prisma`, and that file is safe to push.

1. In the Neon dashboard, open the project and copy the **pooled** connection string.
2. In this folder, create a file named `.env` (copy `.env.example`) and set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

3. Create the tables in Neon:

```powershell
npm run db:push
```

4. Add the demo users and a short vehicle list:

```powershell
npm run db:seed
```

Tables: User, Vehicle, Booking, Payment, Invoice, Notification, MaintenanceRecord, Expense.

## Vercel

In the Vercel project, open **Settings → Environment Variables** and add the same `DATABASE_URL`. Vercel’s Neon integration can fill this in for you. Paste it there. Do not put it in the repository.

After the variable is saved, redeploy. The build runs `prisma generate` and does not need the database password inside the code.

If the tables are not in Neon yet, run `npm run db:push` once from your computer while `.env` points at that database.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@cityrentalcar.com | Customer123! |
| Staff | staff@cityrentalcar.com | Staff123! |
| Admin | admin@cityrentalcar.com | Admin123! |
| Super admin | superadmin@cityrentalcar.com | SuperAdmin123! |

Customer home is `/customer`. Staff, admin, and super admin use `/admin`.
