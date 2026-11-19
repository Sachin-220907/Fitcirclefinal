# Frontend feature boundaries

Each feature owns its pages, UI components, hooks, API services, schemas and types.
- `pages`: route-level composition only.
- `components`: feature-specific presentation components.
- `hooks`: UI state and query/mutation orchestration.
- `services`: API calls and feature workflows; no direct fetch logic inside visual components.
- `schemas`: runtime validation.
- `types`: feature contracts and view models.

Shared reusable primitives belong in `src/shared`; browser APIs, HTTP, sockets, offline sync and uploads belong in `src/platform`.
A feature should not reach into another feature's private folders. Share a type through `packages/contracts` or an explicit public feature export.
