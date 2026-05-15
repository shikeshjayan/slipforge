import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { ReceiptProvider } from "./context/ReceiptContext.jsx"
import ThemeProvider from "./context/ThemeProvider.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ReceiptProvider>
          <App />
        </ReceiptProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
