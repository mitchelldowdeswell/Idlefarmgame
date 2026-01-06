# Idle Farm Server (login + server saves)

This server provides:
- Register/Login (cookie-based JWT)
- Server-stored save data per user (JSON)
- Endpoints ready to extend for chat, highscores, and an auction house later

## Endpoints
- `POST /auth/register` `{ username, password }`
- `POST /auth/login` `{ username, password }`
- `POST /auth/logout`
- `GET /me`
- `GET /save`
- `PUT /save` `{ version, data }`
- `DELETE /save`

## Quickstart

### 1) Start Postgres (recommended: Docker)
```bash
cd idle-farm-server
docker compose up -d
```

### 2) Configure env
```bash
cp .env.example .env
```
Edit `.env` and set a strong `JWT_SECRET`.

### 3) Install dependencies
```bash
npm install
```

### 4) Create DB tables
```bash
npx prisma migrate dev --name init
```

### 5) Run the API
```bash
npm run dev
```
It will listen on `http://localhost:3001`.

## Production notes
- Set `cors({ origin: "https://your-domain", credentials: true })`
- Set `NODE_ENV=production` and run behind HTTPS
