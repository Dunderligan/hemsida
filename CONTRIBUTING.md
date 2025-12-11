# Contributing Guidelines

## Welcome!

Thank you for your interest in contributing to Dunderligan! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/Dunderligan/hemsida.git
cd hemsida
```

### 2. Set Up Development Environment

Follow the instructions in the README.md:

1. Install Node.js and pnpm
2. Install PostgreSQL
3. Copy `.env.example` to `.env` and configure
4. Run `pnpm install`
5. Run `pnpm db:push`
6. Run `pnpm dev`

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-player-stats`
- `fix/match-display-bug`
- `docs/update-readme`

## Development Workflow

### 1. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Keep commits focused and atomic

### 2. Test Your Changes

- Test functionality manually
- Run `pnpm check` for type checking
- Run `pnpm lint` to check formatting
- Test in different browsers if UI changes

### 3. Format Code

```bash
pnpm format
```

This runs Prettier to format all code consistently.

### 4. Commit Changes

Write clear, descriptive commit messages:

```bash
git commit -m "Add player statistics page"
```

**Good commit messages:**
- "Fix match score display on mobile"
- "Add pagination to match history"
- "Update database schema for player stats"

**Bad commit messages:**
- "fix bug"
- "update"
- "changes"

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Any relevant issue numbers
- Screenshots for UI changes

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes
- Document complex types

```typescript
// Good
interface Player {
  id: string;
  battletag: string;
  rank: Rank;
}

// Avoid
const player: any = { ... };
```

### Svelte Components

- Use Svelte 5 runes (`$props`, `$state`, `$derived`)
- Keep components focused and reusable
- Use TypeScript for props
- Document complex components

```svelte
<script lang="ts">
let { title, subtitle = "Default" } = $props<{
  title: string;
  subtitle?: string;
}>();
</script>
```

### Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Keep styles consistent with existing design
- Use component scoped styles sparingly

### Naming Conventions

- **Components**: PascalCase (`PlayerCard.svelte`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PLAYERS`)
- **Files**: kebab-case for utilities (`user-utils.ts`)

## Database Changes

### Schema Modifications

1. Edit schema in `src/lib/server/db/schema/`
2. Test with `pnpm db:push` locally
3. Generate migration with `pnpm db:generate`
4. Commit both schema and migration files
5. Document breaking changes

### Migrations

- Always test migrations locally first
- Consider data migration needs
- Document migration purpose
- Test rollback if possible

## What to Contribute

### Good First Issues

Look for issues labeled `good first issue`:
- Documentation improvements
- UI tweaks
- Bug fixes
- Adding tests

### Feature Requests

Before implementing a new feature:
1. Check if issue exists
2. Discuss in issue comments
3. Wait for maintainer approval
4. Then start implementation

### Bug Fixes

1. Create issue describing bug
2. Include reproduction steps
3. Link PR to issue
4. Add tests if applicable

## Pull Request Process

### PR Checklist

Before submitting:
- [ ] Code follows style guidelines
- [ ] All checks pass (`pnpm check`, `pnpm lint`)
- [ ] Changes are tested manually
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear
- [ ] PR description is complete

### Review Process

1. Maintainer reviews PR
2. Address feedback if requested
3. Make changes and push updates
4. Once approved, PR will be merged
5. Celebrate! 🎉

### After Merge

- Delete your branch
- Pull latest main
- Continue with next contribution!

## Areas Needing Help

### High Priority

- **Documentation**: Improve and expand docs
- **Testing**: Add automated tests
- **Accessibility**: Improve a11y compliance
- **Performance**: Optimize slow queries
- **Mobile UX**: Improve mobile experience

### Feature Ideas

- Player statistics and analytics
- Match scheduling interface
- Real-time match updates
- Mobile app
- Public API
- Advanced search and filtering

## Questions?

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Open a GitHub Issue
- **Feature requests**: Open a GitHub Issue
- **Direct contact**: Discord (kesomannen)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in Discord announcements

## License

By contributing, you agree that your contributions will be licensed under the GNU GPLv3 license.

---

Thank you for contributing to Dunderligan! Every contribution, no matter how small, helps make the project better. 🎮
