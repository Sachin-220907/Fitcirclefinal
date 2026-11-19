# Backend feature modules

FitCircle uses a **NestJS modular monolith** with feature-owned boundaries.

Each feature follows the same pattern:
- `presentation/http/controllers`: HTTP endpoints only.
- `presentation/http/dto`: request validation and response DTOs.
- `application/services`: use cases and orchestration.
- `application/ports`: repository/provider interfaces owned by the application layer.
- `domain`: entities, value objects, policies, enums and domain events.
- `infrastructure/persistence/prisma`: Prisma implementations of repository ports.
- `infrastructure/providers`: external adapters used only by that feature.
- `tests/unit` and `tests/integration`: isolated and database-backed tests.

## Change isolation rules
1. Controllers never query Prisma directly.
2. Application services depend on ports, not Prisma implementations.
3. Prisma implementation details stay inside infrastructure.
4. A feature must not import another feature's internal repository or entity.
5. Cross-feature workflows use exported module APIs/application services or events.
6. Shared technical integrations live in `src/platform`; shared HTTP mechanics live in `src/common`.
7. Database schema and migrations have one owner: `backend/prisma/`.
8. Do not split this into microservices unless scale and operational needs justify it.
