```graphql
my-app/
│
├── backend/                    # Node.js + Express + Prisma + MySQL
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema (models, db config)
│   │   └── migrations/         # Auto-generated migration files
│   ├── src/
│   │   ├── controllers/        # Business logic for each route
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # DB queries or other external logic
│   │   ├── middleware/         # Auth, error handling, etc.
│   │   ├── utils/              # Helpers, constants
│   │   ├── index.js            # Entry point: sets up Express server
│   │   └── app.js              # Express app definition
│   ├── .env                    # Environment variables (e.g. DB creds)
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React Native (with Expo or CLI)
│   ├── node_modules/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Shared UI components
│   ├── screens/                # Screen components
│   ├── navigation/             # React Navigation config
│   ├── context/                # Global state (auth, theme, etc.)
│   ├── services/               # API calls to backend
│   ├── utils/                  # Constants, formatters, etc.
│   ├── App.js
│   ├── app.json                # Expo config (if using Expo)
│   ├── tailwind.config.js      # Tailwind config (if using NativeWind)
│   ├── babel.config.js         # Babel config
│   └── package.json
│
├── README.md                   # Root-level readme
└── .gitignore
```
