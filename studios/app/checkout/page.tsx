import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-12 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-cyan-100">Complete your purchase</p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              {/* Delivery Information */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800 mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="+260 ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Lusaka"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Province
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Lusaka"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center rounded-lg border border-slate-300 p-4 cursor-pointer hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <input type="radio" name="payment" value="mobile" defaultChecked className="h-4 w-4" />
                    <span className="ml-4 font-semibold text-slate-900 dark:text-white">
                      Mobile Money (MTN, Airtel, Zamtel)
                    </span>
                  </label>

                  <label className="flex items-center rounded-lg border border-slate-300 p-4 cursor-pointer hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <input type="radio" name="payment" value="bank" className="h-4 w-4" />
                    <span className="ml-4 font-semibold text-slate-900 dark:text-white">
                      Bank Transfer
                    </span>
                  </label>

                  <label className="flex items-center rounded-lg border border-slate-300 p-4 cursor-pointer hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <input type="radio" name="payment" value="card" className="h-4 w-4" />
                    <span className="ml-4 font-semibold text-slate-900 dark:text-white">
                      Credit/Debit Card
                    </span>
                  </label>

                  <label className="flex items-center rounded-lg border border-slate-300 p-4 cursor-pointer hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <input type="radio" name="payment" value="cod" className="h-4 w-4" />
                    <span className="ml-4 font-semibold text-slate-900 dark:text-white">
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="md:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800 sticky top-24">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">2x T-Shirt</span>
                    <span className="font-semibold">ZMW 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">1x Hoodie</span>
                    <span className="font-semibold">ZMW 380</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">1x Backpack</span>
                    <span className="font-semibold">ZMW 450</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white mb-8 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <span>Total</span>
                  <span>ZMW 1,330</span>
                </div>

                <Link
                  href="/summary"
                  className="block rounded-full bg-cyan-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 w-full"
                >
                  Place Order
                </Link>

                <Link
                  href="/cart"
                  className="mt-3 block rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 w-full"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
