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
2. Create a TMDb API key and set it in the root `.env` (next to `docker-compose.yml`) as `TMDB_API_KEY`. Also set `JWT_SECRET` in the root `.env`.
3. Build and run with Docker Compose:

```bash
docker compose up --build
```

Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: internal service `mongo:27017`

Environment (Docker Compose):
- Root `.env` (next to `docker-compose.yml`): `TMDB_API_KEY`, `JWT_SECRET`
- `docker-compose.yml` defines `MONGO_URI=mongodb://mongo:27017/moviewatchlist` for the backend service

Notes:
- Docker Compose only loads the root `.env` for variable substitution; per-service `.env` files are not loaded automatically.
- Remove or avoid using `backend/.env` and `frontend/.env` when running via Docker to prevent conflicts.

Notes & Next steps
- Add validation and better error handling.
- Add refresh tokens and token expiry UI handling.
- Improve UI/UX.
- Add tests for backend routes.

**Jenkins Webhook (CI/CD)**
- **Prereqs:** Reachable Jenkins server (public URL), GitHub repo with the [Jenkinsfile](Jenkinsfile) in the root.
- **Jenkins job:**
   - Create a Multibranch Pipeline (recommended) or Pipeline job pointing to your GitHub repo.
   - Add GitHub credentials if private.
   - Enable build triggers: “GitHub hook trigger for GITScm polling”.
- **GitHub webhook:**
   - Repo → Settings → Webhooks → Add webhook.
   - Payload URL: `https://<your-jenkins-host>/github-webhook/`
   - Content type: `application/json`
   - Secret: optional but recommended; if set, configure the same secret in Jenkins (Manage Jenkins → Configure System → GitHub).
- **Test:** Push a commit to `main` and confirm a build starts in Jenkins. Check “Recent deliveries” in GitHub Webhooks and Jenkins job logs for trigger status.



