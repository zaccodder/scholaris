import { type ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

const TooltipRootLayout = ({ children }: { children: ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>
}

export default TooltipRootLayout
