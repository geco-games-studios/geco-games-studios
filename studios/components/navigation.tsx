"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useRouter } from "next/navigation"

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
    { name: "Portfolio", href: "/portfolio" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Academy", href: "/academy" },
    { name: "Esports", href: "/esports" },
    { name: "Support", href: "/support" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-lg">
            <Image src="/logo-dark.png" alt="Geco Games Studios logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Geco Games Studios</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Creative Game Studio</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
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
                <div className="hidden items-center gap-3 lg:flex">
                  <Link
                    href="/login"
                    className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    Sign Up
                  </Link>
                </div>
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

          <Link
            href="#contact"
            className="hidden rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 lg:inline-flex"
          >
            Contact
          </Link>
          <button
            className="inline-flex items-center rounded-full p-2 text-slate-900 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-300`}>
        <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
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
  )
}
