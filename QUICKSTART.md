# 🚀 Quick Start Guide

Get GreenPlate frontend up and running in 3 minutes!

## Prerequisites Check

```bash
# Check if Node.js is installed (need v18+)
node --version

# Check if npm is installed (need v9+)
npm --version
```

If either command fails, [install Node.js](https://nodejs.org/) first.

## Installation Options

### Option 1: Automated Setup (Easiest) ⚡

**macOS/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup (3 Commands) 📝

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Create environment file
echo "VITE_API_KEY=your_api_key_here" > .env

# 3. Start dev server
npm run dev
```

## Verify Installation

Once the dev server starts, open your browser to:
```
http://localhost:3000
```

You should see the GreenPlate splash screen! 🎉

## Common Commands

```bash
# Development
npm run dev          # Start dev server (hot reload enabled)

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Quality Checks
npm run lint         # Check code quality
npm run type-check   # Check TypeScript types
```

## Project Structure (Key Files)

```
frontend/
├── App.tsx              # Main app entry
├── Index.tsx            # React root
├── Index.html           # HTML template
├── Pages/               # All page components
│   ├── Auth.tsx         # Login/signup
│   ├── UserHome.tsx     # User dashboard
│   └── ...
├── Layouts/             # Layout wrappers
├── context/             # Global state
├── services/            # API services
└── package.json         # Dependencies
```

## Environment Variables (Optional)

For Google Gemini AI features, add to `.env`:

```env
VITE_API_KEY=your_google_gemini_api_key
VITE_API_URL=http://localhost:8000
```

Get your API key: https://makersuite.google.com/app/apikey

## Troubleshooting

### Port 3000 Already in Use?
Edit `vite.config.ts` and change the port:
```ts
server: {
  port: 3001,  // Use any available port
}
```

### Dependencies Won't Install?
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors?
```bash
npm run type-check
```

## Next Steps

1. ✅ **Explore the UI** - Navigate through the app
2. 📝 **Edit Components** - Modify files in `Pages/` folder
3. 🎨 **Customize Styles** - Edit `styles.css` or use Tailwind classes
4. 🔧 **Add Features** - Build new components and pages
5. 📚 **Read Documentation** - Check `INSTALLATION.md` and `DEPENDENCIES.md`

## Need More Help?

- 📖 [Full Installation Guide](./INSTALLATION.md)
- 📦 [Dependencies Reference](./DEPENDENCIES.md)
- 🐛 Having issues? Check the troubleshooting section in INSTALLATION.md

## Tech Stack at a Glance

- ⚛️ **React 18** - UI framework
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool
- 🎨 **Tailwind CSS** - Styling
- ✨ **Framer Motion** - Animations
- 🤖 **Google Gemini AI** - AI features

---

**Ready to build? Start coding!** 💻
