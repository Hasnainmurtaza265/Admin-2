# NexusAdmin — Shop.Co Admin Dashboard

This is the existing NexusAdmin React + Vite dashboard connected to the **already deployed Shop.Co backend**. It does not create a second backend or a second database.

## Connected backend

`https://shop-cobackend.vercel.app/api`

The dashboard uses the existing Shop.Co API and MongoDB database:
- `POST /api/auth/login` and `GET /api/auth/me` for admin authentication
- `GET /api/products` and admin `POST`, `PUT`, `DELETE /api/products` for the product catalogue and stock
- Admin `GET /api/orders` and `PATCH /api/orders/:id/status` for order management

The UI maps the Shop.Co product/order schema into the dashboard's existing table format. Product IDs are MongoDB IDs; the visible SKU is generated for display only. Product create/edit requires an image path or URL because the Shop.Co Product model requires `image`. Existing backend image paths such as `/images/black-t-shirt.png` can be used.

## Run locally

1. Install Node.js 18+ (or newer).
2. In this project root run:

   ```bash
   npm install
   ```

3. The frontend defaults to the deployed Shop.Co backend. If you want to override it locally, create `.env.local` with:

   ```env
   VITE_API_URL=https://shop-cobackend.vercel.app/api
   ```

4. Start the dashboard:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`. Sign in with a Shop.Co account whose MongoDB `users` document has `role: "admin"`. A normal customer account cannot access the admin dashboard.

## Admin account requirement

The Shop.Co backend intentionally does not allow public registration to assign the admin role. If an admin account has not already been created, register a user through the Shop.Co auth API, then in MongoDB Atlas open the `users` collection and change that user's `role` from `customer` to `admin`. Log in again to receive an admin JWT. Do not share the password or JWT.

## Deploy frontend to Vercel

1. Import this frontend repository into Vercel.
2. Set the environment variable `VITE_API_URL` to:

   ```env
   https://shop-cobackend.vercel.app/api
   ```

3. Redeploy the frontend after saving the environment variable.
4. In the **existing Shop.Co backend Vercel project**, update `CLIENT_URL` to include the exact deployed admin frontend origin. For local development it should also include `http://localhost:3000`. The backend accepts comma-separated origins, for example:

   ```env
   CLIENT_URL=http://localhost:3000,https://YOUR-ADMIN-PANEL.vercel.app
   ```

   Keep any other frontend origin already in use, separated by commas, so the Shop.Co storefront is not blocked. After changing the backend environment variable, redeploy the backend.

## Current API limitations

- Products: live read, create, edit, delete, and stock adjustment are connected.
- Orders: live list, details, export, and status updates are connected.
- Customers: the directory is derived from customers attached to orders and is read-only because the existing Shop.Co API does not expose an admin users-list or user-edit endpoint.
- Dashboard revenue/order/customer totals are calculated from actual order records. Visitor analytics and revenue time-series are not provided by the existing backend, so those chart panels are intentionally left without fabricated data.

Never put MongoDB credentials or JWT secrets in this frontend project.
