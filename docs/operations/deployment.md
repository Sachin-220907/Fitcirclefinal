# Deployment

## Vercel frontend

Create a Vercel project from this repository and set its **Root Directory** to
`frontend`. Use the Vite defaults (`npm run build`, output directory `dist`).
`frontend/vercel.json` sends browser routes to the SPA entry point.

Set these project environment variables for Production (and Preview if used):

| Variable | Value |
| --- | --- |
| `VITE_API_BASE_URL` | Render API origin, e.g. `https://fitcircle-api.onrender.com` (no `/api` suffix) |
| `VITE_SOCKET_URL` | Same Render API origin |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth web client ID |

Vite embeds `VITE_*` values into the frontend at build time. Redeploy after
changing them. Add the Vercel production URL to the Google OAuth client's
authorized JavaScript origins.

## Render backend

Create a Render Blueprint using the repository's `render.yaml`, or create a
Node web service with the repository root as its root directory. The blueprint
builds and starts the backend workspace.

Set these backend environment variables in Render:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, preferably Render PostgreSQL's internal URL |
| `FRONTEND_ORIGIN` | Exact Vercel origin, including `https://`; comma-separate additional trusted origins |
| `GOOGLE_CLIENT_ID` | The same Google OAuth web client ID used by the frontend |
| `NODE_ENV` | Set to `production` by the blueprint |

The service listens on Render's `PORT`. Apply Prisma migrations before serving
the first release with `npm run prisma:deploy --workspace backend` from the
repository root. Add the Render API origin to the Google OAuth client's
authorized redirect URIs only if using an OAuth redirect flow.

For local development, copy the root `.env.example` to the repository-root
`.env`, `backend/.env.example` to `backend/.env`, and `frontend/.env.example`
to `frontend/.env.local`.
