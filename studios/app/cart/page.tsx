"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

interface CartItem {
  id: number
  title: string
  priceValue: number
  price: string
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "GECO T-Shirt",
      priceValue: 250,
      price: "ZMW 250",
      quantity: 2,
      image: "/GECO GAMES merchandise .png",
    },
    {
      id: 2,
      title: "GECO Hoodie",
      priceValue: 380,
      price: "ZMW 380",
      quantity: 1,
      image: "/GECO GAMES merchandise .png",
    },
    {
      id: 3,
      title: "GECO Backpack",
      priceValue: 450,
      price: "ZMW 450",
      quantity: 1,
      image: "/GECO GAMES merchandise .png",
    },
  ])

  const handleIncreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0
  )
  const total = subtotal

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-12 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight">Shopping Cart</h1>
          <p className="mt-2 text-cyan-100">Review your items before checkout</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800"
                    >
                      {/* Item Image */}
                      <div className="h-24 w-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          {item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="rounded-lg bg-white p-2 shadow-sm transition hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-center w-8 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="rounded-lg bg-white p-2 shadow-sm transition hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 transition hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <p className="text-right text-sm text-slate-600 dark:text-slate-400">
                          Subtotal: ZMW {item.priceValue * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                    <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                      Your cart is empty
                    </p>
                    <Link
                      href="/marketplace"
                      className="mt-6 inline-flex rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800 sticky top-24">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Order Summary
                </h3>

                <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>ZMW {subtotal}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                    <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white">
                      <span>Total</span>
                      <span>ZMW {total}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 block rounded-full bg-cyan-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 w-full"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/marketplace"
                  className="mt-4 block rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 w-full"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
