# Change isolation and maintainability

FitCircle is organized as a feature-first React frontend and a NestJS modular monolith backend.

## Frontend
A feature owns its route pages, components, hooks, services, validation schemas and types. Components call hooks; hooks coordinate state and call feature services; services use the shared platform API client. Reusable design-system primitives belong in `frontend/src/shared`.

## Backend
A feature owns its HTTP controllers, DTOs, application use cases, domain rules, repository ports and Prisma adapters. Controllers call application services. Application services depend on repository ports. Infrastructure implements those ports. The Prisma schema and migrations are centralized and shared by all modules.

## External integrations
Email, SMS, object storage, AI providers, cache, event bus, clock and ID generation are represented as platform ports/adapters. Replacing a provider should normally affect its adapter and configuration, not every feature.

## Realtime and offline
Socket gateways and event contracts are kept in dedicated realtime infrastructure. Frontend offline persistence and synchronization are isolated under `frontend/src/platform/offline`.

## Avoiding widespread code changes
- Keep API request/response contracts explicit and versionable.
- Do not import feature internals across feature boundaries.
- Keep provider-specific SDKs behind adapters.
- Use domain events for side effects such as notifications.
- Use a single database schema/migration owner.
- Add integration tests around cross-feature workflows.

This is a blueprint. Empty scaffold files do not implement behavior, guarantee correctness, or remove the need to update consumers when a public contract genuinely changes.
