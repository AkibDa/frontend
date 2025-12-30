# GreenPlate Frontend - Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js

To check if you have them installed:

```bash
node --version
npm --version
```

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

Simply run the setup script:

```bash
# On macOS/Linux
chmod +x setup.sh
./setup.sh

# On Windows
setup.bat
```

This will:
- Check system requirements
- Install all dependencies
- Set up configuration files
- Display next steps

### Option 2: Manual Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Environment Setup** (Optional)

If using Google Gemini AI features, create a `.env` file:

```bash
echo "VITE_API_KEY=your_google_api_key_here" > .env
```

3. **Verify Installation**

```bash
npm run type-check
```

## 📦 What Gets Installed

### Core Dependencies

- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM rendering
- **framer-motion** (^11.0.0) - Animation library
- **lucide-react** (^0.300.0) - Icon library
- **@google/genai** (^0.1.0) - Google Generative AI SDK

### Development Dependencies

- **vite** (^5.0.8) - Build tool and dev server
- **typescript** (^5.2.2) - TypeScript compiler
- **tailwindcss** (^3.4.0) - CSS framework
- **@vitejs/plugin-react** (^4.2.1) - Vite React plugin
- **eslint** - Code linting
- TypeScript types and ESLint plugins

## 🛠️ Available Scripts

After installation, you can run:

### Development Server

```bash
npm run dev
```

Starts the development server at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` folder

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally

### Type Checking

```bash
npm run type-check
```

Run TypeScript type checking without emitting files

### Linting

```bash
npm run lint
```

Check code quality and style issues

## 📁 Project Structure

```
frontend/
├── Pages/              # Page components
├── Layouts/            # Layout components
├── context/            # React context (state management)
├── services/           # API and external services
├── App.tsx             # Main app component
├── Index.tsx           # App entry point
├── Index.html          # HTML template
├── types.ts            # TypeScript type definitions
├── constants.tsx       # App constants and data
├── styles.css          # Global styles with Tailwind
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## 🔧 Configuration Files

All necessary configuration files have been created:

- ✅ `package.json` - Project dependencies
- ✅ `vite.config.ts` - Vite build configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `tailwind.config.js` - Tailwind CSS setup
- ✅ `postcss.config.js` - PostCSS plugins
- ✅ `styles.css` - Global styles with Tailwind directives

## 🐛 Troubleshooting

### Issue: "command not found: npm"

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Dependencies installation fails

**Solution:** Try clearing npm cache and reinstalling:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:** Either:
1. Stop the process using port 3000
2. Change the port in `vite.config.ts`

### Issue: TypeScript errors

**Solution:** Ensure all dependencies are installed:

```bash
npm install
npm run type-check
```

## 🌐 Environment Variables

If you need to use environment variables:

1. Create a `.env` file in the frontend directory
2. Add variables prefixed with `VITE_`:

```env
VITE_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:8000
```

3. Access in code using `import.meta.env.VITE_API_KEY`

## 📝 Next Steps

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Open Browser:**
   Navigate to `http://localhost:3000`

3. **Start Building:**
   Edit files in `Pages/` and `Layouts/` to customize the app

## 🆘 Need Help?

- Check the [README.md](./README.md) for project overview
- Review error messages carefully
- Ensure all prerequisites are met
- Try the troubleshooting steps above

## 📄 License

See the [LICENSE](./LICENSE) file for details.
