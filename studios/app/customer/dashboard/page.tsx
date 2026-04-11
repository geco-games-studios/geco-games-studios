"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  ShoppingBag,
  Package,
  User,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react"

interface CustomerUser {
  email: string
  type: string
  name: string
  userId: string
}

interface Order {
  id: string
  date: string
  items: number
  total: string
  status: "Delivered" | "Processing" | "Shipped"
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "customer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const orders: Order[] = [
    {
      id: "GEC-2026-001",
      date: "Apr 10, 2026",
      items: 3,
      total: "ZMW 1,330",
      status: "Delivered",
    },
    {
      id: "GEC-2026-002",
      date: "Apr 5, 2026",
      items: 2,
      total: "ZMW 430",
      status: "Shipped",
    },
    {
      id: "GEC-2026-003",
      date: "Mar 28, 2026",
      items: 1,
      total: "ZMW 250",
      status: "Delivered",
    },
  ]

  const cartItems = [
    {
      id: 1,
      name: "GECO T-Shirt",
      price: "ZMW 250",
      quantity: 2,
    },
    {
      id: 2,
      name: "GECO Hoodie",
      price: "ZMW 380",
      quantity: 1,
    },
  ]

  const cartTotal = (250 * 2) + (380 * 1)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Account
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, {user.name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900">
                <User className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">
                  User ID
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  {user.userId}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">
                  Account Type
                </p>
                <p className="mt-1 capitalize text-sm font-semibold text-slate-900 dark:text-white">
                  Customer
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">
                  Member Since
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  March 2026
                </p>
              </div>
            </div>

            <Link
              href="/marketplace"
              className="mt-8 block rounded-lg bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shopping Cart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                  <ShoppingBag className="h-6 w-6 text-cyan-600" />
                  My Cart
                </h2>
                <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {cartItems.length} items
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-700 mb-6">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Cart Total
                  </span>
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    ZMW {cartTotal}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block rounded-lg bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>

            {/* Order History */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-6">
                <Package className="h-6 w-6 text-cyan-600" />
                Order History
              </h2>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {order.id}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {order.date}
                          </div>
                          <div>{order.items} items</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {order.total}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "Delivered" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            ""
                          )}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-6">
                <MapPin className="h-6 w-6 text-cyan-600" />
                Default Shipping Address
              </h2>

              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p className="font-semibold">{user.name}</p>
                <p>123 Main Street</p>
                <p>Lusaka, Lusaka 10000</p>
                <p>Zambia</p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  {user.email}<br />
                  +260 976 123456
                </p>
              </div>

              <button className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700">
                Edit Address
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
