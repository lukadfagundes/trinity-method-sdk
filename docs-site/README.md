# Trinity Method SDK - Documentation Site

Professional Next.js 14 documentation site for Trinity Method SDK.

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm run start
```

### Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/trinity-method/trinity-method-sdk/tree/main/docs-site)

## 📁 Structure

```
docs-site/
├── app/                        # Next.js 14 app directory
│   ├── getting-started/       # Getting started guides
│   ├── guides/                # Investigation guides
│   │   ├── security/         # Security audit guide
│   │   ├── performance/      # Performance review guide
│   │   ├── architecture/     # Architecture analysis guide
│   │   └── quality/          # Code quality guide
│   ├── agents/               # AI agent reference
│   ├── api/                  # API documentation
│   ├── trinity-method/       # Trinity Method philosophy
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/               # Shared components
│   ├── Navigation.tsx        # Top navigation
│   ├── Sidebar.tsx           # Sidebar navigation
│   ├── Footer.tsx            # Footer
│   └── ThemeProvider.tsx     # Dark mode provider
├── public/                   # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 📝 Content Structure

### Getting Started
- Installation and setup
- Quick start guide
- Your first investigation
- Configuration

### Investigation Guides
- **Security Audits** - Comprehensive security review
- **Performance Reviews** - Performance optimization
- **Architecture Analysis** - System design documentation
- **Code Quality** - Maintainability assessment

### Agent Reference
- TAN (Technical Analysis Navigator)
- ZEN (Pattern Recognition Expert)
- INO (Investigation & Research)
- JUNO (Quality Assurance Officer)

### API Documentation
- Core SDK APIs
- Investigation Wizard
- Planning System
- Analytics Engine
- Hook Library

### Trinity Method
- Philosophy and principles
- Workflow guide
- Best practices
- Case studies

## 🎨 Features

### Design
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Fast page loads (<2s)
- ✅ SEO optimized

### Content
- ✅ MDX support (Markdown + JSX)
- ✅ Syntax highlighting
- ✅ Code examples
- ✅ Interactive components
- ✅ Mermaid diagrams

### Navigation
- ✅ Collapsible sidebar
- ✅ Breadcrumbs
- ✅ Table of contents
- ✅ Search (coming soon)
- ✅ Previous/Next links

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Icons**: React Icons
- **Syntax Highlighting**: Prism
- **Hosting**: Vercel

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Export
npm run export       # Export static site
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Static Export

```bash
npm run build
npm run export
```

Output in `out/` directory. Upload to any static host.

### Environment Variables

No environment variables required for basic deployment.

Optional:

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Search (Algolia)
NEXT_PUBLIC_ALGOLIA_APP_ID=XXX
NEXT_PUBLIC_ALGOLIA_API_KEY=XXX
NEXT_PUBLIC_ALGOLIA_INDEX=trinity-docs
```

## 📊 Success Metrics

### Performance Targets (WO-009)
- ✅ User satisfaction: ≥90% (4.5/5 rating)
- ✅ Support reduction: ≥40%
- ✅ Page load time: <2s
- ✅ SEO: Top 5 for "investigation framework"

### Monitoring

```bash
# Lighthouse audit
npm run lighthouse

# Bundle analysis
npm run analyze
```

## 🤝 Contributing

### Adding Content

1. Create MDX file in appropriate directory
2. Add to sidebar navigation (`components/Sidebar.tsx`)
3. Test locally
4. Submit PR

### Content Guidelines

- Use clear, concise language
- Include code examples
- Add visual aids (diagrams, screenshots)
- Link to related content
- Follow existing structure

### Style Guide

- **Headings**: Start with H1, use hierarchy
- **Code blocks**: Include language identifier
- **Lists**: Use bullets for items, numbers for steps
- **Links**: Use descriptive text, not "click here"

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### MDX Issues

Ensure:
- Valid JSX in MDX files
- Proper component exports
- No syntax errors in code blocks

### Styling Issues

```bash
# Rebuild Tailwind
npm run dev
```

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- 📖 [Documentation](https://docs.trinity-method.dev)
- 💬 [Discussions](https://github.com/trinity-method/trinity-method-sdk/discussions)
- 🐛 [Issues](https://github.com/trinity-method/trinity-method-sdk/issues)
- 📧 [Email](mailto:support@trinity-method.dev)

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**Trinity Method SDK** - Investigation-first development methodology
