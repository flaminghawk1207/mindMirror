# MindMirror

MindMirror is a mood-aware AI coaching app. It helps users reflect on how they feel, gently improves mood with short, actionable suggestions, and visualizes trends over time. The app consists of:

- Frontend: Expo (React Native) mobile app in `frontend/`
- Backend: Express server in `backend/` that calls Google Gemini

Important features:
- Mood/intensity selector and per-turn mood inference from user messages
- AI chat that empathizes, asks one question, and suggests up to 3 low-effort actions (<120 words)
- Trends screen that visualizes the last 7 days of average mood intensity and shows summary stats
- Journal screen to write, list, and delete personal notes

Note: This app is for wellness support only and is not a medical device. If you are in crisis or considering self-harm, contact local emergency services or a crisis hotline immediately.


## Quick start

Prerequisites:
- Node.js 18+ (Node 20+ recommended)
- npm (or yarn/pnpm)
- Expo CLI (installed by running `npm i -g expo`), and optionally Xcode/Android Studio for simulators
- A Google Gemini API key

1) Backend setup
- Create `backend/.env` with:
  - `GEMINI_API_KEY=YOUR_KEY_HERE`
  - Optionally set `PORT=3001`
- Install deps and start the server:
  - `cd backend`
  - `npm install`
  - `npm start`
- You should see: `Server running on port 3001`

2) Frontend setup
- Install deps:
  - `cd frontend`
  - `npm install`
- Start the app:
  - `npm run start`
  - Open iOS Simulator, Android Emulator, or Expo Go on device
- Backend URL:
  - The chat screen uses `http://localhost:3001/api/chat` by default.
  - If you run the app on a physical device, change the URL to your machine's local IP (e.g., `http://192.168.1.10:3001/api/chat`) in `frontend/app/(tabs)/ai.tsx`.


## Project structure

```
mindMirror/
  backend/             # Express server
    index.js
    package.json
  frontend/            # Expo app
    app/
      (tabs)/
        ai.tsx         # AI chat (mood-aware)
        explore.tsx    # Trends screen
        journal.tsx    # Journal screen
        settings.tsx
      _layout.tsx
      index.tsx
    storage/
      moodHistory.ts   # AsyncStorage helpers for trends
      journal.ts       # AsyncStorage helpers for journal
    contexts/
      ThemeContext.tsx
    firebase.ts        # Firebase auth bootstrap (optional)
  README.md
```


## How it works

- The frontend sends each user message to the backend along with conversation `history`, and any known `mood`/`intensity`.
- The backend instructs Gemini to infer the user's current mood and intensity from the latest message and to produce a brief, supportive reply aimed at improving mood by 1–2 points.
- The backend expects the model to output a first line containing JSON like `{ "mood": "Sad", "intensity": 7 }`, followed by the coaching reply text. It parses and returns these fields alongside the reply.
- The frontend updates the mood summary automatically, stores a mood entry for Trends, and renders the AI response.


## Backend (Express + Gemini)

Environment
- `backend/.env`
  - `GEMINI_API_KEY=...` (required)
  - `PORT=3001` (optional)

Run
- `cd backend && npm install && npm start`

Endpoint
- POST `/api/chat`
  - Request JSON:
    ```json
    {
      "message": "string",
      "history": [{"role":"user|ai","text":"..."}],
      "mood": "string|null",
      "intensity": 1
    }
    ```
  - Response JSON:
    ```json
    {
      "reply": "string",
      "inferredMood": "string|null",
      "inferredIntensity": 1
    }
    ```


## Frontend (Expo)

Run
- `cd frontend && npm install && npm start`
- Use Expo to run on iOS/Android/Web

Screens
- AI Chat (`app/(tabs)/ai.tsx`)
  - Mood selector and intensity slider
  - Sends chat to backend; displays AI reply
  - Auto-updates mood summary from backend inference
  - Logs each turn to `AsyncStorage` for trends
- Trends (`app/(tabs)/explore.tsx`)
  - Visualizes average intensity for the last 7 days and summary stats
  - Buttons to Refresh and Clear local history
- Journal (`app/(tabs)/journal.tsx`)
  - Write a note and save
  - List entries reverse-chronologically
  - Delete entries

Local data
- Mood history: `frontend/storage/moodHistory.ts` (AsyncStorage)
- Journal entries: `frontend/storage/journal.ts` (AsyncStorage)


## Troubleshooting

- Port already in use (EADDRINUSE: :::3001)
  - Another process is running on port 3001. Kill it:
    - macOS/Linux: `lsof -nP -iTCP:3001 -sTCP:LISTEN -t | xargs kill -9`
    - Or change the backend `PORT` in `.env` and update the frontend URL accordingly.

- Gemini API key not set
  - Ensure `backend/.env` exists and contains `GEMINI_API_KEY=...`
  - The backend loads `backend/.env` first, then falls back to repo-root `.env` if present.
  - Restart the backend after editing `.env`.

- Mobile device cannot connect to backend
  - Replace `localhost` with your development machine's LAN IP in the frontend fetch URL.
  - Ensure both devices are on the same network.
  - CORS is enabled on the backend by default.

- Node ESM issues
  - Backend uses ESM (`"type": "module"`). Use Node 18+.


## Roadmap ideas
- Sync mood history and journals to Firestore per user
- Rich charts (streaks, moving averages, per-mood breakdowns)
- Export journal to file
- Reminders and daily check-ins


## License
MIT (add your preferred license here) 