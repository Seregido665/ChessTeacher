# ChessTeacher

Monorepo con backend (Node.js/Express) y frontend (React + Vite).

## Estructura

```
ChessTeacherFull/
├── backend/   # API REST - Node.js, Express, MongoDB
└── frontend/  # Interfaz - React 19, Vite
```

## Levantar en local

### Backend

```bash
cd backend
cp .env.example .env   # Rellena las variables
npm install
npm start
```

El servidor arranca en `http://localhost:3000`.

### Frontend

```bash
cd frontend
cp .env.example .env   # Ajusta VITE_API_URL si es necesario
npm install
npm run dev
```

La app arranca en `http://localhost:5173`.

## Variables de entorno

| Carpeta  | Archivo       | Variables                              |
|----------|---------------|----------------------------------------|
| backend  | `.env`        | `PORT`, `MONGODB_URI`, `JWT_SECRET`    |
| frontend | `.env`        | `VITE_API_URL`                         |

Copia cada `.env.example` a `.env` y rellena los valores reales.
