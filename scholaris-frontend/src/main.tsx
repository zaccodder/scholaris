import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import TooltipRootLayout from "./components/tooltip-provider.tsx"
import { BrowserRouter as Router } from "react-router-dom"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <TooltipRootLayout>
          <App />
        </TooltipRootLayout>
      </Router>
    </ThemeProvider>
  </StrictMode>
)
