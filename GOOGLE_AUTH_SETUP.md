# Google Authentication Setup (DINE-IN)

This project now supports Google OAuth via backend routes:

- Start auth: `GET /api/auth/google`
- Callback: `GET /api/auth/google/callback`

## 1) Google Cloud Console

1. Go to **APIs & Services > Credentials**.
2. Create or open an **OAuth 2.0 Client ID**.
3. Add this origin:
   - `http://localhost:3000`
4. Add this redirect URI:
   - `http://localhost:5000/api/auth/google/callback`

## 2) Backend environment

Set these values in `backend/.env`:

```env
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

## 3) Frontend environment

Set this in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4) Run the app

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## 5) Test sign in

1. Open the frontend URL shown by Vite (example: `http://localhost:3000`).
2. Open the login page.
3. Click **Continue with Google**.
4. After consent, you should return to `/login` and be redirected to `/dashboard`.

## Notes

- If `/api/auth/google` returns `GOOGLE_CLIENT_ID is not configured`, check `backend/.env` and restart backend.
- The redirect URI must match **exactly** in both Google Console and `backend/.env`.
- New Google users are created as `staff` by default in this app.
