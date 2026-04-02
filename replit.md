# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Blinkee.com LED Toys Store (`artifacts/blinkee-store`)
- Full-stack e-commerce store at `/` (root path)
- Cyberpunk Dark Mode theme with neon cyan, hot pink, and electric yellow-green accents
- Orbitron font for headings, Rajdhani for body
- Pages: Home (`/`), Shop (`/shop`), Product Detail (`/product/:id`), Cart (`/cart`)
- 24 seeded LED toy products across 8 categories
- Functional shopping cart with session-based persistence

### API Server (`artifacts/api-server`)
- REST API at `/api`
- Routes: `/api/products`, `/api/products/featured`, `/api/products/categories`, `/api/products/:id`, `/api/cart`, `/api/store/stats`

## Database Schema

### `products`
- id, name, description, price, original_price, category, image_url, stock, rating, review_count, is_featured, tags[], badge

### `cart_items`
- id, session_id, product_id (FK → products), quantity, created_at, updated_at
