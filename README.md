# 🌱 GreenPlate Frontend

**Sustainable Food Waste Reduction Platform**

A React-based web application that connects students and staff with surplus cafeteria food, reducing waste and promoting sustainability.

## ✨ Features

- 🍽️ Browse available surplus food deals from campus cafeterias
- 🎯 Reserve meals at discounted prices
- 📍 Interactive cafeteria map view
- 👨‍🍳 Staff interface for posting food deals
- 🤖 AI-powered food analysis using Google Gemini
- 📊 Track carbon footprint savings
- 🎨 Beautiful animations with Framer Motion
- 📱 Mobile-first responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

**For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)**

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 3 minutes
- **[INSTALLATION.md](./INSTALLATION.md)** - Complete installation guide
- **[DEPENDENCIES.md](./DEPENDENCIES.md)** - All dependencies explained

## 🛠️ Tech Stack

- **React 18** - UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Google Generative AI** - AI-powered features

## 📂 Project Structure

```
frontend/
├── Pages/              # Page components
│   ├── Auth.tsx        # Authentication
│   ├── UserHome.tsx    # User dashboard
│   ├── StaffDashboard.tsx
│   └── ...
├── Layouts/            # Layout wrappers
│   ├── UserLayout.tsx
│   └── StaffLayout.tsx
├── context/            # React context (state)
│   └── AppContext.tsx
├── services/           # API services
│   └── geminiService.ts
├── App.tsx             # Main app component
├── Index.tsx           # Entry point
├── types.ts            # TypeScript types
├── constants.tsx       # App constants
└── styles.css          # Global styles
```

## 🎯 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_google_gemini_api_key
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🆘 Support

Having issues? Check:
- [INSTALLATION.md](./INSTALLATION.md) troubleshooting section
- [DEPENDENCIES.md](./DEPENDENCIES.md) for dependency info
- Project issues on GitHub

---

**Built with 💚 for a sustainable future**
