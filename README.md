<div align="center">

# SlipForge — Universal Receipt Generator

**Beautiful, downloadable receipts — 100% in your browser, 100% private.**

Built for freelancers, small shop owners, and anyone who needs to generate a professional receipt fast — without signing up for yet another SaaS.

[![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)](package.json)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#license)

</div>

---

## Screenshots

| Home | Data Entry | Preview & PDF |
|------|-----------|---------------|
| ![Home](/slipforge.png) | ![Data Entry](/slipforge2.png) | ![Preview](/slipforge3.png) |

---

## Features

- **Create receipts** — business info, client details, line items
- **Auto-calculates** — subtotal, tax (configurable rate), total
- **Export** — Download as PDF, share via WhatsApp, or print
- **History** — last 50 receipts saved locally
- **Draft auto-save** — form persists if you navigate away
- **Global defaults** — set business name, tax rate, currency & logo once
- **Dark mode** & fully responsive (desktop + mobile)
- **100% offline** — no data leaves your device

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (ships with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/slipforge.git
cd slipforge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output goes to the `dist/` folder — deploy it anywhere (Vercel, Netlify, static host).

### Run Tests

```bash
npm test
```

---

## Project Architecture

```
slipforge/
├── public/            # Static assets (screenshots, icons)
├── src/
│   ├── components/    # Reusable UI (Navbar, ReceiptHistory, etc.)
│   ├── context/       # React Context (settings, receipts state)
│   ├── hooks/         # Custom hooks (localStorage, form validation)
│   ├── pages/         # Route pages (Home, DataEntry, Preview, Settings)
│   ├── templates/     # Receipt layout (ModernReceipt)
│   ├── utils/         # Business logic (calculations, formatting, storage)
│   ├── __tests__/     # Unit tests
│   ├── App.jsx        # Root component with routing
│   └── main.jsx       # Entry point
├── index.html
├── vite.config.js
└── package.json
```

**Data flow:** The user fills a form → state is persisted to localStorage → receipt is rendered as a React component → `html-to-image` captures it as a canvas → `jsPDF` writes it to a downloadable PDF. No server, no API, no cloud.

---

## Configuration

All global settings are managed from the **Settings** page (⚙️ icon in the top-right navbar). Changes auto-save to your browser's localStorage.

| Setting | How to Change |
|---------|--------------|
| **Business Name** | Settings → Business Details → Default Business Name |
| **Tax Rate (%)** | Settings → Defaults → Default Tax Rate |
| **Currency** | Settings → Defaults → Default Currency |
| **Logo** | Settings → Branding → click to upload (PNG, JPEG, WebP, max 2 MB) |
| **Address / Phone / Email / Tax ID** | Settings → Business Details |
| **Receipt Number Prefix** | Settings → Defaults → Receipt Number Prefix |

Values set in Settings automatically carry over to the Data Entry form.

---

## Contributing

Contributions are welcome! If you find a bug or have a feature idea:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit your changes (`git commit -am 'Add my change'`)
4. Push to the branch (`git push origin feature/my-change`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
