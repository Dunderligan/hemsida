# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### pnpm not found

**Problem:** `command not found: pnpm`

**Solution:**
```bash
npm install -g pnpm
# or
corepack enable
```

#### PostgreSQL connection failed

**Problem:** `Error: connect ECONNREFUSED`

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows
   # Use PostgreSQL service manager
   ```

2. Check DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dunderligan"
   ```

3. Create database if it doesn't exist:
   ```bash
   createdb dunderligan
   ```

#### Permission denied on database

**Problem:** `permission denied for schema public`

**Solution:**
```sql
GRANT ALL ON SCHEMA public TO your_user;
```

### Development Server Issues

#### Port 5173 already in use

**Problem:** `Port 5173 is already in use`

**Solution:**
1. Kill the process using the port:
   ```bash
   # Find process
   lsof -i :5173
   
   # Kill process
   kill -9 <PID>
   ```

2. Or use a different port:
   ```bash
   pnpm dev -- --port 5174
   ```

#### Hot reload not working

**Problem:** Changes don't appear without refresh

**Solution:**
1. Restart dev server
2. Clear browser cache
3. Check file watchers aren't at limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

### Database Issues

#### Schema out of sync

**Problem:** `table "xyz" does not exist`

**Solution:**
```bash
pnpm db:push
```

This forces the schema to sync with database.

#### Migration conflicts

**Problem:** Migration files conflict or fail

**Solution:**
1. Delete migration files in `drizzle/`
2. Regenerate:
   ```bash
   pnpm db:generate
   ```
3. Review generated SQL
4. Apply manually if needed

#### Seeding fails

**Problem:** `--seed` flag causes errors

**Solution:**
1. Ensure database is empty or backup first
2. Check all foreign key constraints
3. Run with fresh database:
   ```bash
   dropdb dunderligan
   createdb dunderligan
   pnpm db:push
   pnpm dev -- -- --seed
   ```

### Build Issues

#### Type errors

**Problem:** TypeScript compilation errors

**Solution:**
1. Run type check:
   ```bash
   pnpm check
   ```
2. Fix reported type errors
3. Restart TypeScript server in IDE

#### Out of memory during build

**Problem:** `JavaScript heap out of memory`

**Solution:**
```bash
NODE_OPTIONS=--max_old_space_size=4096 pnpm build
```

#### Missing dependencies

**Problem:** `Cannot find module 'xyz'`

**Solution:**
```bash
pnpm install
```

If persists, try:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Runtime Issues

#### 404 on all routes

**Problem:** All pages return 404

**Solution:**
1. Check if dev server is running
2. Verify you're accessing correct port (5173)
3. Check SvelteKit adapter configuration

#### Session not persisting

**Problem:** User logged out after refresh

**Solution:**
1. Check cookie settings in browser
2. Verify session secret is set
3. Check cookie domain settings
4. Ensure HTTPS in production

#### Images not loading

**Problem:** Images show broken/404

**Solution:**
1. Check Cloudflare R2 credentials in `.env`
2. Verify image URLs are correct
3. Check CORS settings on R2
4. For development, images may not load without R2 setup

### Performance Issues

#### Slow page loads

**Diagnosis:**
1. Check browser DevTools Network tab
2. Look for slow database queries in logs
3. Check database connection count

**Solutions:**
- Add database indexes
- Optimize queries (use relations API)
- Enable caching
- Use pagination

#### High memory usage

**Diagnosis:**
```bash
docker stats dunderligan
```

**Solutions:**
- Restart container
- Check for memory leaks
- Reduce connection pool size
- Scale horizontally

### Docker Issues

#### Container won't start

**Problem:** Container exits immediately

**Solution:**
1. Check logs:
   ```bash
   docker logs dunderligan
   ```
2. Verify environment variables
3. Check database connectivity
4. Ensure port isn't in use

#### Can't connect to container

**Problem:** Cannot access application

**Solution:**
1. Verify port mapping:
   ```bash
   docker ps
   ```
2. Check if container is running:
   ```bash
   docker ps -a
   ```
3. Restart container:
   ```bash
   docker restart dunderligan
   ```

### Authentication Issues

#### OAuth redirect fails

**Problem:** Battle.net login doesn't redirect back

**Solution:**
1. Verify `BATTLENET_REDIRECT_URI` matches registered URI
2. Check OAuth client credentials
3. Ensure callback URL is accessible
4. Check browser console for errors

#### Unauthorized errors

**Problem:** `403 Unauthorized` on admin actions

**Solution:**
1. Verify user has admin role in database:
   ```sql
   SELECT * FROM "user" WHERE battletag = 'YourTag#1234';
   UPDATE "user" SET role = 'admin' WHERE battletag = 'YourTag#1234';
   ```
2. Clear cookies and re-login
3. Check session validity

### Debugging Tips

#### Enable verbose logging

Add to your code:
```typescript
console.log('Debug:', variable);
```

Check server logs:
```bash
docker logs -f dunderligan
```

#### Database debugging

Use Drizzle Studio:
```bash
pnpm db:studio
```

Or connect directly:
```bash
psql -h localhost -U user dunderligan
```

#### Network debugging

Check browser DevTools:
1. Network tab for failed requests
2. Console for JavaScript errors
3. Application tab for cookies/storage

### Getting Help

If you're still stuck:

1. **Check existing issues** on GitHub
2. **Search Discord** for similar problems
3. **Create detailed issue** with:
   - Description of problem
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)
   - What you've tried

4. **Contact maintainer**: Discord (kesomannen)

### Useful Commands

```bash
# View logs
docker logs dunderligan
docker logs -f dunderligan  # Follow

# Restart services
docker restart dunderligan

# Check database
pnpm db:studio

# Type check
pnpm check

# Format code
pnpm format

# Check formatting
pnpm lint

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reset database
dropdb dunderligan
createdb dunderligan
pnpm db:push
```

### Prevention

- **Commit often** to avoid losing work
- **Test locally** before deploying
- **Keep dependencies updated**
- **Monitor logs** regularly
- **Backup database** before migrations
- **Use version control** for config files

---

Still having issues? Don't hesitate to ask for help! 🤝
