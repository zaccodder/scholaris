import { navLinks } from "@/assets"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { GraduationCap, Sun, Moon, Menu } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const { setTheme, theme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 w-full px-4 shadow-2xl backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <Link to={"/"} className="flex items-center gap-2 font-bold">
          <GraduationCap />
          <span>Scholaris</span>
        </Link>

        {/* desktop view */}
        <div className="hidden items-center space-x-5 text-sm lg:flex">
          {navLinks.map(({ path, text }) => (
            <Link key={text} to={path}>
              {text}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {theme === "dark" ? (
            <Sun onClick={() => setTheme("light")} />
          ) : (
            <Moon onClick={() => setTheme("dark")} />
          )}
          <Button>
            <Link to={"/sign-up"}>Get Started</Link>
          </Button>
          <Button variant={"outline"} className="hidden lg:block">
            <Link to={"/sign-in"}>Sign In</Link>
          </Button>
          {/* displayed on mobile only */}
          <Menu className="lg:hidden" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
