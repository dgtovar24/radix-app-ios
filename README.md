# Radix iOS

React Native / Expo app for the Radix medical dashboard.

## Tech Stack

- Expo SDK 52 with expo-router
- React Native 0.76 (New Architecture)
- TypeScript

## API Integration

- Base URL: `http://localhost:8080/v2` (local dev) or `https://api.raddix.pro/v2` (production)
- Auth: Bearer token stored in `expo-secure-store`
- Endpoints: Login (`POST /api/auth/login`), Patients (`GET /api/patients`), Users (`GET /api/users`)

## Scripts

```bash
cd radix-ios
npm install
npx expo start
```

## Routes

| Screen | Route | Description |
|--------|-------|-------------|
| Splash | `/` | Auth check redirect |
| Login | `/login` | Email/password login |
| Dashboard | `/dashboard` | Patient overview (health, treatment, alerts) |
| Profile | `/profile` | Patient info |
| Treatment | `/treatment` | Treatment details |
| Health | `/health` | Health metrics |
| Alerts | `/alerts` | Recent notifications |
| Settings | `/settings` | Preferences |

## Data Flow

1. User logs in via `/api/auth/login`
2. Token stored in `expo-secure-store`
3. Dashboard loads patient data from `/api/patients`
4. Role-based view (Doctor vs Patient) determined by stored `user_role`

## Architecture

- `src/app/` — Expo Router screens (file-based routing)
- `src/services/api.ts` — API client with auth token injection
- `src/types/index.ts` — TypeScript interfaces mirroring backend models
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom hooks (auth, data fetching)