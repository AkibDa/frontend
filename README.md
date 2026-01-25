# 🌱 GreenPlate

**Sustainable Food Waste Reduction Platform**

A React-based mobile application that connects students and staff with surplus cafeteria food, reducing waste and promoting sustainability.

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

# App will open automatically at http://localhost:5000
```

## 🛠️ Tech Stack

- **React 18** - UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Google Generative AI** - AI-powered food analysis
- **Firebase** - Authentication and database
- **Axios** - HTTP client for API requests

## 📂 Project Structure

```
frontend/
├── Pages/              # Page components
│   ├── Auth.tsx        # User authentication & login
│   ├── UserHome.tsx    # User dashboard & food deals
│   ├── StaffDashboard.tsx # Staff interface
│   ├── CreatePost.tsx  # Create new food deal post
│   ├── DealDetails.tsx # View deal information
│   ├── MyOrder.tsx     # User's reservations
│   ├── IncomingReservations.tsx # Staff incoming orders
│   ├── MapView.tsx     # Cafeteria location map
│   ├── QueueManager.tsx # Queue management
│   ├── Profile.tsx     # User profile
│   ├── Onboarding.tsx  # App onboarding flow
│   └── Splash.tsx      # Splash screen
├── Layouts/            # Layout wrappers
│   ├── UserLayout.tsx  # User layout
│   ├── StaffLayout.tsx # Staff layout
│   └── StudentLayout.tsx # Student layout
├── context/            # React context (state)
│   └── AppContext.tsx  # Global app state
```

## 🎯 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

### capacitor setup
Install capacitor dependencies---
    npm install @capacitor/core @capacitor/cli

Build the Vite project---
    npm run build

Initialize Capacitor---
    npx cap init
    
When prompted---
    App name: GreenPlate
    App ID: com.greenplate.app

Install Android platform---
    npm install @capacitor/android
    npx cap add android

Sync web assets with Android---
    npm run build
    npx cap sync

Open project in Android Studio---
    npx cap open android


### Find you IP Address Windows
Step 1: Open system shell
    On Windows
        Win + R
    Type:
        cmd
        Press Enter

Step 2: Find your local IP address
    Run:
        ipconfig
    Look for your active network adapter (Wi-Fi or Ethernet) and note:
        IPv4 Address . . . . . . . . . . : 192.168.x.x
    Example:
        192.168.1.7

Step 3: Update API base URL
    Open:
        src/services/api.ts
        
export const API_BASE_URL =
  Capacitor.isNativePlatform()
    ? 'http://x.x.x.x:8000'
    : import.meta.env.VITE_API_BASE_URL;

    replace the x with your ip address

    example: const BASE_URL = "http://192.168.1.7:5000";

Step 4: Rebuild and sync Capacitor
    npm run build
    npx cap sync

        

### Finding Local IP Address on macOS

Method 1: Using Terminal

Open Terminal
Press Cmd + Space
Search for: Terminal
Press Enter

Get Wi-Fi IP address
Run the following command:

ipconfig getifaddr en0

This will output something like:

192.168.1.7

This is your local IPv4 address.

If you are using Ethernet, run:

ipconfig getifaddr en1

Method 2: Using System Settings

Open System Settings

Go to Network → Wi-Fi

Click the connected network

Look for IP Address: 192.168.x.x

Updating the API Base URL

Open the following file:

src/api/api.ts

Update the base URL:

const BASE_URL = "http://192.168.1.7:5000
";

Replace 192.168.1.7 with your actual IP address.

Rebuild and Sync Capacitor

After updating the API URL, run:

npm run build
npx cap sync

Notes

Phone and laptop must be on the same Wi-Fi network
Backend server must be running
Firewall must allow the backend port
localhost will not work on physical Android devices
        


## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_google_gemini_api_key
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

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
- [DEPENDENCIES.md](./DEPENDENCIES.md) for dependency info
- Project issues on GitHub

---

**Built with 💚 for a sustainable future**
