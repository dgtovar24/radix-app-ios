# AGENTS.md

## Tech Stack

- **Expo SDK 52** with Expo Router (file-based routing)
- **React Native 0.76** (New Architecture enabled)
- **TypeScript** strict mode

## Commands

```bash
cd radix-ios
npm install
npx expo start        # dev server
npx expo run:ios      # run on iOS simulator
npx expo run:android  # run on Android emulator
npm run typecheck     # TypeScript check
```

## Architecture

- `src/app/` — Expo Router screens (file-based routing under `app/` directory)
- `src/types/` — TypeScript interfaces matching backend JPA entities
- `src/services/api.ts` — API client; base URL defaults to `http://localhost:8080/v2`
- `src/components/` — Shared UI components
- `src/hooks/` — Custom hooks (auth, API, etc.)
- `src/utils/` — Helpers (date formatting, validators)

## API Integration

All API calls go to `/v2` context path. Auth token stored via `expo-secure-store`.

Key endpoints consumed:
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `POST /api/patients/register` — Register patient
- `GET /api/patients` — List patients
- `GET /api/patients/{id}` — Get patient
- `GET /api/users` — List users

## Entity Mapping

iOS screens use types from `src/types/index.ts` which mirror backend JPA entities:
`User`, `Patient`, `HealthMetrics`, `Treatment`, `Smartwatch`, `DoctorAlert`, `HealthLog`, `RadiationLog`, `GameSession`, `MotivationalMessage`, `Settings`.

## Environment Variables

- `EXPO_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:8080/v2`)