# FitCircle comprehensive architecture scaffold

This is the reviewed architecture baseline for FitCircle.

## Technology
- Frontend: React + TypeScript + Vite + React Router
- Backend: Node.js + NestJS + TypeScript
- Architecture: feature-first frontend + NestJS modular monolith
- Database: PostgreSQL + Prisma
- Realtime: Socket.IO
- Offline: IndexedDB + service worker + sync outbox
- Validation: Zod on frontend, class-validator on backend
- Tests: Vitest, Jest, Supertest and end-to-end tests
- Workspace: npm workspaces monorepo

## Structure principles
- Frontend features own pages, components, hooks, services, schemas and types.
- Backend modules own controllers, DTOs, application services, domain rules, repository ports, Prisma adapters and tests.
- Shared UI primitives live in `frontend/src/shared`.
- Browser and external integrations live behind `platform` adapters.
- Common backend HTTP mechanics live in `backend/src/common`.
- Database schema and migrations live only in `backend/prisma`.
- Cross-feature internals are not imported directly.

## Chat feature
The chat feature includes the requested core components and supporting UI:
ConversationList, ChatWindow, MessageInput, MessageBubble, ConversationHeader, TypingIndicator, MessageStatus, AttachmentUploader, plus message lists, reactions, attachments, receipts, search, pinning, reply previews, voice and file message renderers.

## Important
This ZIP is an architecture scaffold, not a runnable product. Most source files are intentionally empty placeholders. Dependencies, implementations, environment secrets, Prisma models/migrations, provider adapters and tests must be completed during development. The structure is comprehensive, but future requirements may still justify a new module or a focused refactor.
