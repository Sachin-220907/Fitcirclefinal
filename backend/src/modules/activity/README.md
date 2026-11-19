# Activity module

This module owns its business rules and data access boundary.

## Dependency direction
- HTTP controllers validate/translate requests and call application services.
- Application services orchestrate use cases through ports.
- Domain entities, value objects and policies contain business rules.
- Infrastructure adapters implement repository/provider ports.
- Prisma schema and migrations remain centrally owned by `backend/prisma/`.

Do not import another feature module's internal files. Expose cross-module capabilities through exported application services, public module APIs, or domain events.
