# Deployment Guide

## Overview

Dunderligan is deployed using Docker containers on Lysator hardware. This guide covers deployment procedures, configuration, and troubleshooting.

## Prerequisites

- Docker installed on host system
- PostgreSQL database accessible
- Environment variables configured
- Cloudflare R2 and Images accounts (optional for full functionality)

## Build Process

### 1. Build Docker Image

```bash
docker build -t dunderligan:latest .
```

The Dockerfile handles:
- Installing dependencies with pnpm
- Building the SvelteKit application
- Configuring the Node.js adapter
- Setting up the production environment

### 2. Environment Variables

Create a `.env` file with required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dunderligan

# Battle.net OAuth
BATTLENET_CLIENT_ID=your_client_id
BATTLENET_CLIENT_SECRET=your_client_secret
BATTLENET_REDIRECT_URI=https://dunderligan.se/api/login/battlenet/callback

# Cloudflare R2 (optional)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket

# Cloudflare Images (optional)
CLOUDFLARE_IMAGES_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_API_TOKEN=your_api_token
```

### 3. Run Container

```bash
docker run -d \
  --name dunderligan \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  dunderligan:latest
```

## Production Deployment

### Lysator Setup

1. SSH into Lysator server
2. Navigate to deployment directory
3. Pull latest code or upload new Docker image
4. Stop existing container
5. Run new container with updated image
6. Verify deployment

### Domain Configuration

- **Production**: dunderligan.se
- **Staging**: dev.dunderligan.se

Configure reverse proxy (nginx/caddy) to forward requests to Docker container on port 3000.

**Example nginx config:**
```nginx
server {
    listen 443 ssl http2;
    server_name dunderligan.se;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Migrations

Migrations run automatically on application startup. The app checks for pending migrations in the `drizzle/` directory and applies them.

### Manual Migration

If needed, run migrations manually:

```bash
# Inside container or with access to database
pnpm db:migrate
```

## Monitoring

### Health Checks

Check if application is running:

```bash
curl http://localhost:3000
```

Should return the homepage HTML.

### Container Logs

View application logs:

```bash
docker logs dunderligan
docker logs -f dunderligan  # Follow logs
```

### Database Connection

Verify database connectivity:

```bash
docker exec -it dunderligan pnpm db:studio
```

## Backup Strategy

### Database Backups

**Automated daily backups:**
```bash
# Cron job
0 2 * * * pg_dump -h localhost -U user dunderligan > /backup/dunderligan-$(date +\%Y\%m\%d).sql
```

**Manual backup:**
```bash
pg_dump -h localhost -U user dunderligan > backup.sql
```

**Restore from backup:**
```bash
psql -h localhost -U user dunderligan < backup.sql
```

### File Backups

Static files and uploads (if stored locally):
```bash
tar -czf static-backup.tar.gz static/
```

## Rollback Procedure

If deployment fails:

1. Stop new container
   ```bash
   docker stop dunderligan
   docker rm dunderligan
   ```

2. Start previous version
   ```bash
   docker run -d \
     --name dunderligan \
     -p 3000:3000 \
     --env-file .env \
     dunderligan:previous-tag
   ```

3. If database migration issues, restore from backup
   ```bash
   psql -h localhost -U user dunderligan < backup.sql
   ```

## Scaling

### Horizontal Scaling

For increased load, run multiple containers behind a load balancer:

```bash
# Run multiple instances
docker run -d --name dunderligan-1 -p 3001:3000 --env-file .env dunderligan:latest
docker run -d --name dunderligan-2 -p 3002:3000 --env-file .env dunderligan:latest
docker run -d --name dunderligan-3 -p 3003:3000 --env-file .env dunderligan:latest
```

Configure load balancer (nginx, HAProxy, etc.) to distribute traffic.

### Database Scaling

- Consider read replicas for heavy query loads
- Use connection pooling (already implemented)
- Monitor slow queries and add indexes

## Security

### SSL/TLS

Ensure SSL certificates are valid and up to date:
```bash
certbot renew
```

### Secrets Management

- Never commit `.env` files
- Use secure methods to transfer secrets
- Rotate credentials regularly
- Use environment-specific secrets

### Container Security

- Run container as non-root user
- Keep base images updated
- Scan images for vulnerabilities
- Limit container permissions

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs dunderligan
```

Common issues:
- Database connection failure
- Missing environment variables
- Port already in use

### Application errors

1. Check application logs
2. Verify environment variables
3. Test database connection
4. Check disk space

### Performance issues

1. Monitor resource usage:
   ```bash
   docker stats dunderligan
   ```

2. Check database performance
3. Review slow query logs
4. Consider scaling

## CI/CD

Future implementation could include:

1. **GitHub Actions** for automated testing
2. **Automated builds** on push to main
3. **Automated deployment** to staging
4. **Manual approval** for production deployment

**Example workflow:**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t dunderligan:${{ github.sha }} .
      - name: Push to registry
        run: docker push dunderligan:${{ github.sha }}
      - name: Deploy to server
        run: ssh user@lysator "docker pull dunderligan:${{ github.sha }} && docker restart dunderligan"
```

## Maintenance

### Regular Tasks

- **Weekly**: Review logs for errors
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **As needed**: Database optimization

### Updates

1. Update dependencies: `pnpm update`
2. Test locally
3. Build new Docker image
4. Deploy to staging
5. Test staging
6. Deploy to production

## Support

For deployment issues:
- Check logs first
- Review this guide
- Contact Bobbo on Discord (kesomannen)
- Open GitHub issue with details
