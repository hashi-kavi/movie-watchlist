# Movie Watchlist

A full-stack MERN app to search movies (via TMDb), save to a personal watchlist, and manage items with JWT auth.

Stack
- MongoDB (official Docker image)
- Express (Node 20)
- React (with Tailwind CSS)
- Docker + docker-compose

Quick start (WSL2 with Docker)
1. Copy repository to WSL mount, e.g. (on Windows path to repo):
   cd /mnt/d/movie-watchlist
2. Create a TMDb API key and set it in `frontend/.env` (REACT_APP_TMDB_API_KEY).
3. Build and run with Docker Compose:

```bash
docker compose up --build
```

Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: internal service `mongo:27017`

Environment (defaults provided in service env files):
- Backend: `backend/.env` (PORT, MONGO_URI, JWT_SECRET)
- Frontend: `frontend/.env` (REACT_APP_BACKEND_URL, REACT_APP_TMDB_API_KEY)

Notes & Next steps
- Add validation and better error handling.
- Add refresh tokens and token expiry UI handling.
- Improve UI/UX.
- Add tests for backend routes.



