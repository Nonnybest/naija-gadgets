# Naija Gadgets
Next.js 14 + Supabase + Paystack store for phone, laptop and smart-device accessories.

## Setup
1. `npm install`
2. Open Supabase Studio on your Oracle VPS, go to the SQL editor and run `supabase/schema.sql` (first replace `you@example.com` with your admin email). It only creates ng_products and ng_orders, so your other sites are untouched.
3. In Studio, Authentication, add a user with that admin email and a password.
4. `cp .env.example .env.local` and fill in the keys (Supabase, Paystack, admin email).
5. `npm run dev`, open http://localhost:3000. Admin lives at /admin.

## Notes
- Prices are in naira. Paystack amounts are sent in kobo.
- Orders are verified server-side with Paystack before stock is reduced (app/api/orders/route.js).
- Delivery zones and rates: lib/supabase.js and app/api/orders/route.js (keep both in sync).
- Deploy on Vercel, add the same env vars there.

## Vercel + Oracle VPS
- Frontend runs on Vercel. All data stays in your self-hosted Supabase.
- In Vercel, Project Settings, Environment Variables: add every key from .env.example. The URL is your VPS Supabase API address, the keys come from the .env file in your Supabase docker folder (ANON_KEY and SERVICE_ROLE_KEY).
- SUPABASE_SERVICE_ROLE_KEY is used only by the server route app/api/orders. Never prefix it with NEXT_PUBLIC.
