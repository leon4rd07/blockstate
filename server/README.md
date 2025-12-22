Setup (development)

1. Copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`.

2. Install and run server:

   cd server
   npm install
   npm run dev

3. Set the frontend env variable to point to the server (example in project root `.env.example`):

   VITE_API_URL=http://localhost:4000

4. Run the frontend (from project root):

   npm install
   npm run dev

Notes
- The server exposes: `/api/auth/login`, `/api/auth/register`, `/api/auth/wallet-connect` and `/api/auth/me`.
- DAO proposal endpoints: `POST /api/proposals` (create), `GET /api/proposals/:propertyId` (list), `POST /api/proposals/:id/vote` (vote), `POST /api/proposals/:id/close` (proposer only).
- This is a minimal development setup. For production, ensure proper secrets management and HTTPS.
