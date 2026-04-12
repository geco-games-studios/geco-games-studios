"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, LogOut, LayoutDashboard, ShoppingBag, Mail } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useRouter, usePathname } from "next/navigation"

interface CurrentUser {
  email: string
  type: string
  name: string
  userId: string
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    setIsUserDropdownOpen(false)
    router.push("/login")
  }

  const getDashboardLink = () => {
    if (!user) return "/"
    switch (user.type) {
      case "student":
        return "/academy/dashboard"
      case "gamer":
        return "/gamer/dashboard"
      case "customer":
        return "/customer/dashboard"
      default:
        return "/"
    }
  }

  const navItems = [
    { name: "Studio", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Academy", href: "/academy" },
    { name: "Esports", href: "/esports" },
    { name: "Support", href: "/support" },
  ]

  return (
    <>
      <style>{`
        @keyframes moveLight {
          0% {
            box-shadow: -10px 0px 20px rgba(6, 182, 212, 0.4);
          }
          50% {
            box-shadow: 0px 0px 25px rgba(6, 182, 212, 0.6);
          }
          100% {
            box-shadow: 10px 0px 20px rgba(6, 182, 212, 0.4);
          }
        }
        
        .nav-link-hover:hover {
          animation: moveLight 1.5s ease-in-out infinite;
        }

        @keyframes moveLightIcon {
          0% {
            box-shadow: inset -10px 0px 15px rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: inset 0px 0px 20px rgba(6, 182, 212, 0.5);
          }
          100% {
            box-shadow: inset 10px 0px 15px rgba(6, 182, 212, 0.3);
          }
        }
        
        .icon-hover:hover {
          animation: moveLightIcon 1.5s ease-in-out infinite;
        }
      `}</style>
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-6">
          <Link href="/" className="flex flex-col items-center gap-1">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image src="/logo-dark.png" alt="Geco Games Studios logo" width={40} height={40} className="object-contain" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Creative Game Studio</p>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition rounded-lg px-2 py-1 ${
                    isActive
                      ? "text-slate-950 dark:text-white underline underline-offset-4 decoration-2"
                      : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white nav-link-hover"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          
          {/* Icons Section */}
          <div className="flex items-center gap-2">
            {/* Marketplace Icon */}
            <Link
              href="/marketplace"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                pathname === "/marketplace"
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-700 dark:text-slate-300 icon-hover"
              }`}
              title="Marketplace"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>

            {/* Contact Icon */}
            <Link
              href="#contact"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300 transition icon-hover"
              title="Contact"
            >
              <Mail className="h-5 w-5" />
            </Link>

            {/* User Menu */}
            {!isLoading && (
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                    title={user.name}
                  >
                    <User className="h-5 w-5" />
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300 transition icon-hover"
                      title="Login"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  </>
                )}

                {/* Dropdown Menu */}
                {user && isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-800 z-50">
                    <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {user.email}
                      </p>
                      <p className="mt-1 inline-flex rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 capitalize">
                        {user.type}
                      </p>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 border-t border-slate-200 dark:border-slate-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="inline-flex items-center rounded-full p-2 text-slate-900 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-300`}>
        <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}
          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link href="#contact" className="block rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Contact
          </Link>
        </div>
      </div>
    </nav>
    </>
  )
}
