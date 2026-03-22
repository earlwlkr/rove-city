<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

# Production Deployment

## Convex Production
- **Production URL**: `https://descriptive-panther-929.convex.cloud`
- **Deployment ID**: `prod:descriptive-panther-929`
- **Environment file**: `.env.production.local`

## Commands
- Deploy to production: `npx convex deploy -y`
- Check production env vars: `npx convex env list --prod`
- View production dashboard: `npx convex dashboard --prod`
