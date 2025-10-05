# Trinity Method Documentation Site - Deployment Guide

Complete guide for deploying the Trinity Method documentation site to production.

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: Vercel Button (Fastest)

Click the button in README.md or visit:

```
https://vercel.com/new/clone?repository-url=https://github.com/trinity-method/trinity-method-sdk/tree/main/docs-site
```

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to docs-site
cd docs-site

# Deploy
vercel

# Follow prompts:
? Set up and deploy? Yes
? Which scope? Your account
? Link to existing project? No
? What's your project's name? trinity-method-docs
? In which directory is your code located? ./
? Want to override settings? No

# Deploy to production
vercel --prod
```

### Option 3: GitHub Integration (Continuous Deployment)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Trinity Method documentation site"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `docs-site` as the root directory
   - Click "Deploy"

3. **Configure Domain** (Optional):
   - Go to Project Settings → Domains
   - Add custom domain: `docs.trinity-method.dev`
   - Configure DNS as instructed

## 🌐 Deploy to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the site
npm run build

# Deploy
netlify deploy

# Follow prompts, then deploy to production
netlify deploy --prod
```

**netlify.toml** (optional):

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/docs"
  to = "/getting-started"
  status = 301

[[redirects]]
  from = "/documentation"
  to = "/getting-started"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### GitHub Pages (Static Export)

```bash
# Build and export static site
npm run build
npm run export

# Output is in 'out/' directory
# Configure GitHub Pages to serve from 'out' directory
```

**Important**: Update `next.config.js` for static export:

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/trinity-method-sdk', // If deploying to subdirectory
  images: {
    unoptimized: true, // Required for static export
  },
}
```

### AWS S3 + CloudFront

```bash
# Build static export
npm run build
npm run export

# Install AWS CLI
# Configure credentials: aws configure

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Docker Container

**Dockerfile**:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and run**:

```bash
docker build -t trinity-docs .
docker run -p 3000:3000 trinity-docs
```

## 🔧 Environment Configuration

### Required Environment Variables

None! The documentation site works without any environment variables.

### Optional Environment Variables

Create `.env.local` for optional features:

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Algolia Search
NEXT_PUBLIC_ALGOLIA_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_ALGOLIA_API_KEY=YOUR_SEARCH_API_KEY
NEXT_PUBLIC_ALGOLIA_INDEX=trinity-docs

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://docs.trinity-method.dev
NEXT_PUBLIC_REPO_URL=https://github.com/trinity-method/trinity-method-sdk
```

### Vercel Environment Variables

Add in Vercel Dashboard → Project Settings → Environment Variables:

1. **Google Analytics** (Optional):
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`
   - Environments: Production, Preview

2. **Algolia Search** (Optional):
   - Name: `NEXT_PUBLIC_ALGOLIA_APP_ID`
   - Value: Your Algolia App ID
   - Environments: Production, Preview

## 🔒 Security Configuration

### Content Security Policy (CSP)

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' *.algolia.net *.algolianet.com;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 📊 Analytics Setup

### Google Analytics

1. **Create GA4 Property**:
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new GA4 property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to Site**:

Create `components/GoogleAnalytics.tsx`:

```typescript
'use client'

import Script from 'next/script'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
```

Update `app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
```

## 🔍 Search Integration

### Algolia DocSearch

1. **Apply for DocSearch**:
   - Go to [docsearch.algolia.com](https://docsearch.algolia.com)
   - Apply with your docs URL
   - Wait for approval (~1-2 weeks)

2. **Add to Site**:

```bash
npm install @docsearch/react
```

Create `components/Search.tsx`:

```typescript
'use client'

import { DocSearch } from '@docsearch/react'
import '@docsearch/css'

export function Search() {
  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX!}
    />
  )
}
```

Add to `components/Navigation.tsx`:

```typescript
import { Search } from './Search'

export function Navigation() {
  return (
    <nav>
      {/* ... */}
      <Search />
      {/* ... */}
    </nav>
  )
}
```

## 🚦 Performance Optimization

### Image Optimization

Update `next.config.js`:

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Static Caching

Vercel automatically handles caching. For other platforms:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

### Bundle Size Analysis

```bash
# Install analyzer
npm install -D @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Analyze bundle
ANALYZE=true npm run build
```

## 🧪 Pre-Deployment Checklist

### Local Testing

```bash
# Run production build locally
npm run build
npm run start

# Open http://localhost:3000
# Test all pages, navigation, dark mode, mobile responsiveness
```

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

### Checklist

- [ ] All pages load without errors
- [ ] Navigation works (desktop + mobile)
- [ ] Dark mode toggle works
- [ ] All links are valid (no 404s)
- [ ] Images load properly
- [ ] Code syntax highlighting works
- [ ] Search works (if implemented)
- [ ] Mobile responsive design
- [ ] Meta tags and SEO
- [ ] Analytics tracking (if implemented)
- [ ] Performance: Lighthouse score 90+
- [ ] Security headers configured

## 📝 Post-Deployment

### DNS Configuration

For custom domain `docs.trinity-method.dev`:

1. **Add CNAME Record**:
   ```
   Type: CNAME
   Name: docs
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

2. **Verify in Vercel**:
   - Project Settings → Domains
   - Add `docs.trinity-method.dev`
   - Wait for SSL certificate provisioning

### Monitoring

1. **Vercel Analytics** (Built-in):
   - Project → Analytics
   - Monitor page views, performance, errors

2. **Google Search Console**:
   - Add property: `https://docs.trinity-method.dev`
   - Submit sitemap: `https://docs.trinity-method.dev/sitemap.xml`

3. **Uptime Monitoring** (Optional):
   - UptimeRobot, Pingdom, or StatusCake
   - Monitor https://docs.trinity-method.dev

### SEO

1. **Submit Sitemap**:
   ```bash
   # Auto-generated by Next.js at build time
   # Accessible at: /sitemap.xml
   ```

2. **robots.txt**:

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://docs.trinity-method.dev/sitemap.xml
```

## 🐛 Troubleshooting

### Build Failures

**Error**: `Module not found`

```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

**Error**: `MDX parsing failed`

Check MDX syntax:
- All JSX must be valid
- Components must be properly exported
- No syntax errors in code blocks

### Deployment Issues

**Vercel deployment fails**:

1. Check build logs in Vercel dashboard
2. Ensure `package.json` has correct `build` script
3. Verify Next.js version compatibility

**404 on routes**:

Ensure `app/` directory structure matches URLs:
- `/getting-started` → `app/getting-started/page.mdx`
- `/guides/security` → `app/guides/security/page.mdx`

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎯 Success Metrics (WO-009)

Track these metrics post-deployment:

- **User Satisfaction**: ≥90% (4.5/5 rating via feedback widget)
- **Support Reduction**: ≥40% (track support ticket volume)
- **Page Load Time**: <2s (Lighthouse / Vercel Analytics)
- **SEO Ranking**: Top 5 for "investigation framework" (Google Search Console)

---

**Deployed!** 🚀

Your Trinity Method documentation site is now live and ready to help developers adopt investigation-first development.
