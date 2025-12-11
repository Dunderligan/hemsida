# API and Remote Functions Documentation

## Overview

Dunderligan uses SvelteKit's experimental **Remote Functions** feature for server-side mutations and queries. This provides a type-safe RPC-style API that's tightly integrated with the frontend.

## Remote Functions

Remote functions are located in `src/lib/remote/` and are organized by domain:

- `auth.remote.ts` - Authentication and authorization
- `season.remote.ts` - Season management
- `division.remote.ts` - Division management
- `group.remote.ts` - Group management
- `roster.remote.ts` - Roster/team management
- `team.remote.ts` - Team operations
- `match.remote.ts` - Match queries and operations
- `misc.remote.ts` - Miscellaneous utilities

## Types of Remote Functions

### Commands (Mutations)

Commands modify data on the server. They use the `command()` wrapper from `$app/server`.

**Example:**
```typescript
export const createSeason = command(
  z.object({
    name: z.string(),
    startedAt: z.date(),
    legacyRanks: z.boolean()
  }),
  async ({ name, startedAt, legacyRanks }) => {
    await adminGuard();
    
    const slug = toSlug(name);
    const [season] = await db
      .insert(schema.season)
      .values({ name, slug, startedAt, legacyRanks })
      .returning();
    
    return { season };
  }
);
```

### Queries

Queries fetch data from the server. They use the `query()` wrapper from `$app/server`.

**Example:**
```typescript
export const queryMatches = query(
  z.object({
    rosterId: z.uuid().optional(),
    seasonId: z.uuid().optional(),
    played: z.boolean().optional(),
    page: z.number().min(0).default(0)
  }),
  async ({ rosterId, seasonId, played, page }) => {
    const results = await db.query.match.findMany({
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      where: { /* ... */ },
      with: { /* ... */ }
    });
    
    return { matches: results };
  }
);
```

## Usage from Frontend

Remote functions are imported and called directly from Svelte components:

```typescript
import { createSeason } from '$lib/remote/season.remote';

// In a component
const result = await createSeason({
  name: "Dunderligan 2025",
  startedAt: new Date("2025-03-01"),
  legacyRanks: false
});
```

## Authentication & Authorization

### Admin Guard

The `adminGuard()` function ensures only admins can execute certain operations:

```typescript
export const adminGuard = async () => {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    error(403, 'Unauthorized');
  }
};
```

Used in commands that require admin privileges:
```typescript
export const updateSeason = command(
  schema,
  async (data) => {
    await adminGuard(); // Throws 403 if not admin
    // ... perform operation
  }
);
```

## API Endpoints

### Authentication Endpoints

**Battle.net OAuth Login:**
- `GET /api/login/battlenet` - Initiates OAuth flow
- `GET /api/login/battlenet/callback` - OAuth callback handler

### How OAuth Works

1. User clicks login button
2. Frontend redirects to `/api/login/battlenet`
3. Server generates OAuth state and redirects to Battle.net
4. User authorizes on Battle.net
5. Battle.net redirects to `/api/login/battlenet/callback?code=...`
6. Server exchanges code for access token
7. Server fetches user profile (Battletag)
8. Server creates/updates user in database
9. Server sets session cookie
10. Server redirects user to homepage

## Validation

All remote functions use **Zod** schemas for input validation:

```typescript
import z from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  startedAt: z.date(),
  legacyRanks: z.boolean()
});

export const createSeason = command(schema, async (data) => {
  // data is typed and validated automatically
});
```

## Error Handling

Remote functions throw errors that are automatically handled by SvelteKit:

```typescript
import { error } from '@sveltejs/kit';

// Throw HTTP error
error(404, 'Season not found');
error(403, 'Unauthorized');
error(400, 'Invalid input');
```

Frontend automatically receives these errors and can handle them:

```typescript
try {
  await createSeason(data);
} catch (err) {
  // Handle error (automatic toast, etc.)
}
```

## Common Remote Functions

### Season Operations

- `createSeason(data)` - Create new season
- `updateSeason(data)` - Update season dates
- `deleteSeason(data)` - Delete season

### Division Operations

- `createDivision(data)` - Create division in season
- `updateDivision(data)` - Update division details
- `deleteDivision(data)` - Delete division

### Match Operations

- `queryMatches(filters)` - Query matches with filters
- `updateMatch(data)` - Update match results
- `scheduleMatch(data)` - Set match schedule

### Roster Operations

- `createRoster(data)` - Create team roster
- `updateRoster(data)` - Update roster details
- `addMember(data)` - Add player to roster
- `removeMember(data)` - Remove player from roster

## Best Practices

1. **Always validate input** - Use Zod schemas for all remote functions
2. **Guard sensitive operations** - Use `adminGuard()` for admin-only operations
3. **Return typed data** - Ensure return types are properly typed
4. **Handle errors gracefully** - Use appropriate HTTP status codes
5. **Keep functions focused** - Each function should do one thing well
6. **Use transactions** - For operations that modify multiple tables
7. **Document side effects** - Comment any non-obvious behavior

## Security Considerations

1. **Authorization checks** - Always verify user permissions
2. **Input validation** - Never trust client input
3. **SQL injection prevention** - Use Drizzle ORM (parameterized queries)
4. **Rate limiting** - Consider adding rate limiting for expensive operations
5. **Session security** - HTTP-only, secure cookies for sessions

## Performance Tips

1. **Pagination** - Always paginate large result sets
2. **Use Relations API** - Avoid N+1 queries with proper includes
3. **Select only needed columns** - Don't fetch unnecessary data
4. **Cache when appropriate** - Cache frequently accessed, rarely changed data
5. **Batch operations** - Use transactions for multiple related operations

## Testing Remote Functions

Currently, testing is done manually. Future improvements could include:

1. Unit tests for individual remote functions
2. Integration tests with test database
3. Mock authentication for testing
4. Automated API testing

## Migration from Traditional API

Remote functions replace traditional REST APIs with advantages:

- **Type safety** - Shared types between client and server
- **Automatic validation** - Zod schemas validate input
- **Better DX** - Call like regular functions, no manual fetch
- **Less boilerplate** - No need for separate API routes
- **Integrated errors** - Errors handled automatically by SvelteKit
