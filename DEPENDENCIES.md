# GreenPlate Frontend - Dependencies Reference

This document lists all dependencies used in the GreenPlate frontend project.

## 📦 Production Dependencies

These packages are required for the application to run:

### React & Core
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | Core React library for building UI |
| `react-dom` | ^18.2.0 | React renderer for web applications |

### UI & Animation
| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | ^11.0.0 | Animation library for smooth transitions and interactions |
| `lucide-react` | ^0.300.0 | Beautiful, consistent icon library |

### AI Integration
| Package | Version | Purpose |
|---------|---------|---------|
| `@google/generative-ai` | ^0.21.0 | Google Gemini AI SDK for food image analysis |

## 🛠️ Development Dependencies

These packages are only needed during development:

### Build Tools
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.0.8 | Fast build tool and development server |
| `@vitejs/plugin-react` | ^4.2.1 | Vite plugin for React support |

### TypeScript
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.2.2 | TypeScript compiler |
| `@types/react` | ^18.2.43 | Type definitions for React |
| `@types/react-dom` | ^18.2.17 | Type definitions for React DOM |

### CSS & Styling
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.0 | Utility-first CSS framework |
| `autoprefixer` | ^10.4.16 | Adds vendor prefixes to CSS |
| `postcss` | ^8.4.32 | CSS transformation tool |

### Code Quality
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^8.55.0 | JavaScript/TypeScript linter |
| `@typescript-eslint/eslint-plugin` | ^6.14.0 | TypeScript rules for ESLint |
| `@typescript-eslint/parser` | ^6.14.0 | TypeScript parser for ESLint |
| `eslint-plugin-react-hooks` | ^4.6.0 | React Hooks rules for ESLint |
| `eslint-plugin-react-refresh` | ^0.4.5 | React Fast Refresh rules for ESLint |

## 📊 Total Package Count

- **Production Dependencies:** 5 packages
- **Development Dependencies:** 14 packages
- **Total:** 19 direct dependencies
- **All Packages (including transitive):** 254+ packages

## 🔄 Updating Dependencies

### Check for outdated packages
```bash
npm outdated
```

### Update all packages to latest versions (within semver range)
```bash
npm update
```

### Update a specific package
```bash
npm update <package-name>
```

### Update to latest versions (potentially breaking)
```bash
npm install <package-name>@latest
```

## 🔒 Security

### Check for vulnerabilities
```bash
npm audit
```

### Fix vulnerabilities automatically
```bash
npm audit fix
```

### Fix with breaking changes (use with caution)
```bash
npm audit fix --force
```

## 📝 Notes

### Why these dependencies?

1. **React** - The core UI library, chosen for its component-based architecture and large ecosystem
2. **Vite** - Modern build tool that's faster than traditional bundlers like Webpack
3. **TypeScript** - Adds type safety to catch errors during development
4. **Tailwind CSS** - Utility-first CSS framework for rapid UI development
5. **Framer Motion** - Industry-standard animation library with declarative API
6. **Lucide React** - Modern icon library with tree-shaking support
7. **Google Generative AI** - Official Google SDK for AI features

### Version Strategy

We use **caret (^)** version ranges, which means:
- `^18.2.0` allows updates to `18.x.x` but not `19.0.0`
- This provides a good balance between stability and getting bug fixes

### Peer Dependencies

Some packages have peer dependencies that are automatically installed:
- React plugins require React and React DOM
- ESLint plugins require ESLint

## 🎯 Key Features Enabled

- ✅ React 18 with Concurrent Features
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for utility-first styling
- ✅ Smooth animations with Framer Motion
- ✅ Modern icons with Lucide
- ✅ AI-powered food analysis with Google Gemini
- ✅ Fast development server with HMR
- ✅ Code quality checks with ESLint

## 📚 Documentation Links

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Google Generative AI](https://ai.google.dev/)

## ⚠️ Known Issues

Currently there are **2 moderate severity vulnerabilities** reported by npm audit. These are in development dependencies and do not affect the production build. We're monitoring these and will update when patches are available.

To view details:
```bash
npm audit
```
