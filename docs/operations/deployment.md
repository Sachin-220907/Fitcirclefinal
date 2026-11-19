# Deployment

## Vercel frontend

Create a Vercel project from this repository and set its **Root Directory** to
`frontend`. Use the Vite defaults (`npm run build`, output directory `dist`).
`frontend/vercel.json` sends browser routes to the SPA entry point.

Set these project environment variables for Production (and Preview if used):

| Variable | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://fitcirclefinal.onrender.com` (no `/api` suffix) |
| `VITE_SOCKET_URL` | `https://fitcirclefinal.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Configured in `frontend/.env.production` |

Vite embeds `VITE_*` values into the frontend at build time. Redeploy after
changing them. In Google Cloud Console, open the OAuth 2.0 web client used by
the frontend and add `https://fitcirclefinal.vercel.app` to **Authorized
JavaScript origins**. This app sends Google ID tokens from the browser, so it
does not use a Google OAuth redirect URI. The same OAuth client ID must be
allowed for this origin in Google Cloud Console.

## Render backend

Create a Render Blueprint using the repository's `render.yaml`, or create a
Node web service with the repository root as its root directory. The blueprint
builds and starts the backend workspace.

Set these backend environment variables in Render:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, preferably Render PostgreSQL's internal URL |
| `FRONTEND_ORIGIN` | `https://fitcirclefinal.vercel.app` |
| `GOOGLE_CLIENT_ID` | Configured by the Render Blueprint to match the frontend |
| `NODE_ENV` | Set to `production` by the blueprint |

The service listens on Render's `PORT`. Apply Prisma migrations before serving
the first release with `npm run prisma:deploy --workspace backend` from the
repository root. Add the Render API origin to the Google OAuth client's
authorized redirect URIs only if using an OAuth redirect flow.

For local development, copy the root `.env.example` to the repository-root
`.env`, `backend/.env.example` to `backend/.env`, and `frontend/.env.example`
to `frontend/.env.local`.
