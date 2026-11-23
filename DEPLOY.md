# Naija Gadgets: update guide

This folder holds only the files that changed. Copy them over your project (same folder names, replace when asked).

## What changed
- 500 generated products removed. Two verified products added (Raspberry Pi 5, Tapo C200), each with a photo gallery.
- New product page: big photo on pure white, small photos underneath, arrows to flip through.
- Fake discounts, star ratings and review counts removed from the product cards.
- Checkout now uses Flutterwave. The order is saved first as "pending", then marked "paid" only after Flutterwave confirms it (browser check plus a webhook), so a paid order is never lost.
- Signup works without email. Google sign-in and email password reset stay on screen but say "coming soon".
- Admin: upload several photos per product, and a new Customers page with "Reset password".
- Admin email moved out of the database rules into a table (`ng_admins`).

## Step 1: update the database (on the VPS)
On your laptop (PowerShell), from this folder:
```
scp -i "C:\Users\Ajali Chinonso\Desktop\Nee\ssh-key-2026-11-05.key" supabase\01_reset_catalog.sql opc@84.8.149.230:~/
ssh -i "C:\Users\Ajali Chinonso\Desktop\Nee\ssh-key-2026-11-05.key" opc@84.8.149.230
```
On the server:
```
sudo docker exec -i supabase-db psql -U postgres -d postgres < ~/01_reset_catalog.sql
sudo docker exec supabase-db psql -U postgres -c "select name, price, array_length(images,1) as photos from ng_products;"
```
You should see 2 products with 3 photos each. This deletes all 500 old products.
If your admin email is not ajalijohn102@gmail.com, open the SQL file first and change it on the `ng_admins` line.

## Step 2: update the code
Copy these files into your project folder, then:
```
git add .
git commit -m "Rebuild: gallery, Flutterwave, admin tools"
git push
```
Vercel rebuilds by itself. Open the build log in Vercel. If it shows red, send me the log.

## Step 3: Vercel environment variables
Vercel project > Settings > Environment Variables. Add or update these, then redeploy:
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (already there)
- NEXT_PUBLIC_ADMIN_EMAIL (your admin email)
- NEXT_PUBLIC_FLW_PUBLIC_KEY, FLW_SECRET_KEY, FLW_SECRET_HASH (from step 4)
- NEXT_PUBLIC_GOOGLE_ENABLED = false
- NEXT_PUBLIC_EMAIL_ENABLED = false
Delete the old PAYSTACK variables.

## Step 4: Flutterwave (test mode first)
1. Create an account at flutterwave.com and stay in Test mode.
2. Settings > API Keys: copy the Public Key into NEXT_PUBLIC_FLW_PUBLIC_KEY and the Secret Key into FLW_SECRET_KEY.
3. Settings > Webhooks: URL = https://YOUR-SITE.vercel.app/api/flutterwave/webhook
   Secret hash = a long random phrase you invent. Put the same phrase in FLW_SECRET_HASH.
4. Redeploy on Vercel, add the Raspberry Pi to the cart, and pay with a test card from Flutterwave's testing documentation.
5. Check: the order shows "paid" in the admin Recent orders, and the stock went down by one.
To go live later, switch Flutterwave to Live mode, finish their business verification, and replace the three values with the live ones.

## Using the admin dashboard
- /admin: sign in, add or edit products. Upload photos with the file button, or paste photo links (one per line). The first photo is the main one.
- /admin/customers: find a customer and press "Reset password". Send them the new password privately.
- The two products carry PLACEHOLDER prices and stock. Change them first.

## Do these now
- Never put `.env.local` in a zip or on GitHub.
- Change the Ollama access token on the VPS and in Vercel. It was visible in PROGRESS.md and the Caddyfile.

## Known limits
- Only 2 products so far. Photos are linked from the makers' own websites, so if they move a file the photo breaks. Download the photos and upload them through the admin to own them.
- The third Raspberry Pi photo is small. Replace it when you have a better one.
- Photos sit on white using a blend effect. It works for white backdrops, not for grey ones.
- I could not run the full build here. The code passed a syntax check, but the first Vercel build is the real test.

## Later, once you own a domain
Point the domain at Vercel. Then send me the name and I'll walk you through Google sign-in and Resend, and we flip the two switches to true.
