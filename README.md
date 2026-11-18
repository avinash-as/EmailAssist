# EmailAssist – AI-Powered Email Management Dashboard (Prototype)

## Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (local)
- AI: Heuristic classification/summarization (pluggable for OpenAI via env)

## Run locally
1. Start MongoDB (port 27017).
2. Backend:
   ```
   cd backend
   npm install
   npm start
   ```
   (http://localhost:5000)
3. Frontend (dev):
   ```
   cd frontend
   npm install
   npm run dev
   ```
   (http://localhost:5173)

Production build: `cd frontend && npm run build` then backend serves `frontend/dist`.

## Demo flow
- Sign up as Assistant (or login asst@test.com / password123 after seeding).
- Connect an email account (simulated) -> loads demo inbox.
- Explore dashboard, inbox segments, thread details, AI classification, reply drafting.
- Client login: client@demo.com / password123 -> minimal client view.

## Simulated parts
- Email provider connection (Gmail/Outlook OAuth) is simulated.
- AI uses deterministic heuristics instead of a live LLM; structure supports swapping in OpenAI via OPENAI_API_KEY.
- Email sending is simulated.
