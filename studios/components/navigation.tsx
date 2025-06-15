"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, Store, User } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()

  const navItems = [
    { name: "Studio", href: "/" },
    { name: "Gaming", href: "/gaming" },
    { name: "Products", href: "/products" },
    { name: "Newsletters", href: "/newsletters" },
    { name: "Entertainment", href: "/entertainment" },
    { name: "Engineering", href: "/engineering" },
    { name: "Education", href: "/education" },
    { name: "Esports", href: "/esports" },
    { name: "Support", href: "/support" },
  ]

  return (
    <nav className="bg-black dark:bg-gray-900 p-4 sticky top-0 z-50 shadow-lg border-b border-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <Image
              src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
              alt="Geco Games Studios"
              width={40}
              height={40}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-white hover:text-yellow-400 transition-all duration-300 relative group px-2 py-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Icons & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="text-white hover:bg-green-700 dark:hover:bg-green-600 p-2 rounded transition-all duration-300 hover:scale-110">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-white hover:bg-green-700 dark:hover:bg-green-600 p-2 rounded transition-all duration-300 hover:scale-110">
            <Store className="h-5 w-5" />
          </button>
          <button className="text-white hover:bg-green-700 dark:hover:bg-green-600 p-2 rounded transition-all duration-300 hover:scale-110">
            <User className="h-5 w-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none transition-transform duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black dark:bg-gray-800 text-white flex flex-col space-y-2 p-4 mt-4 rounded-lg border border-gray-700">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm hover:text-yellow-400 transition-colors duration-300 py-2 px-4 rounded hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
