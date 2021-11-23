This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Build db by npx prisma db push

After db has been stable

Run

```bash
npx prisma migrate dev
```

Need to create a shadow url for npx prisma migrate dev

### Add data proxy

Add MIGRATE_DATABASE_URL as real postgresURL
Add DATABASE_URL as data proxy url

```bash
    "vercel-build": "npm run prisma:generate && npm run prisma:migrate && next build",
    "prisma:generate": "PRISMA_CLIENT_ENGINE_TYPE='dataproxy' prisma generate",
    "prisma:migrate": "DATABASE_URL=\"$MIGRATE_DATABASE_URL\" prisma migrate deploy",
```
