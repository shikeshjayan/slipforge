# SlipForge — Universal Receipt Generator

Create professional, customizable receipts instantly in your browser. No sign-ups, no data leaks — everything stays on your device.

## Features

- **Receipt Creation** — Business info, client details, line items with auto-calculated subtotal/tax/total
- **Live Preview** — Receipt preview with watermark, print styles, and print dialog support
- **PDF Export** — Download receipts as PDF files (canvas-rendered via html-to-image + jsPDF)
- **Global Settings** — Persistent defaults for business name, tax rate, currency, address, contact info, and receipt prefix
- **Receipt History** — Auto-saved receipt history with ability to re-open or delete past receipts
- **Form Validation** — Required fields validated before generating receipts
- **Fully Offline** — All data stored in browser localStorage; zero server dependencies

## Tech Stack

- **React 19** with React Router 7
- **Vite 8** for build tooling
- **Tailwind CSS 4** for styling
- **html-to-image** + **jsPDF** for PDF export
- **Vitest** for testing

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |

## Architecture

```
src/
├── components/      # Shared UI components (Navbar, ErrorBoundary, ReceiptHistory, LoadingSkeleton)
├── context/         # React Context for state management (ReceiptContext, ThemeProvider)
├── hooks/           # Custom React hooks (useLocalStorage, useFormValidation)
├── pages/           # Route pages (Home, DataEntry, Preview, Settings)
├── templates/       # Receipt template components (ModernReceipt)
├── utils/           # Pure utility functions (formatting, calculations, storage)
└── __tests__/       # Test files
```

Data flows through React Context (`ReceiptContext`) which syncs with localStorage for persistence. Routes share state via context rather than fragile `useLocation` state.
