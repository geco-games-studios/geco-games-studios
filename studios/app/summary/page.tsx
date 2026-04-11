import Link from "next/link"
import { CheckCircle, Package, MapPin, CreditCard, Download } from "lucide-react"

export default function SummaryPage() {
  const orderId = "GEC-2026-004521"
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-12 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight">Order Confirmation</h1>
          <p className="mt-2 text-cyan-100">Thank you for your purchase!</p>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-12 px-6 lg:px-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full bg-green-100 p-4 dark:bg-green-900 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Order Placed Successfully!
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Your order has been received and is being processed.
          </p>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-20 px-6 lg:px-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            {/* Order Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Order Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order Number</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order Date</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {orderDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    3-5 Business Days
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-600" />
                Shipping Address
              </h3>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p className="font-semibold">John Doe</p>
                <p>123 Main Street</p>
                <p>Lusaka, Lusaka 10000</p>
                <p>Zambia</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  john@example.com<br />
                  +260 976 123456
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-800 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Order Items
            </h3>
            <div className="space-y-4">
              {[
                { name: "GECO T-Shirt (x2)", price: "ZMW 500" },
                { name: "GECO Hoodie (x1)", price: "ZMW 380" },
                { name: "GECO Backpack (x1)", price: "ZMW 450" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                >
                  <span className="text-slate-900 dark:text-white font-medium">
                    {item.name}
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>ZMW 1,330</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-800 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-cyan-600" />
              Payment Method
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Mobile Money (MTN)
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Payment instructions have been sent to your email.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 rounded-full bg-cyan-600 px-8 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download Invoice
            </button>
            <Link
              href="/marketplace"
              className="flex-1 rounded-full border border-slate-300 px-8 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-12">
            What Happens Next
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 mb-4">
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Payment Confirmation
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                We'll confirm your payment and process your order within 24 hours.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 mb-4">
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Prepare & Pack
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your items will be carefully packed and prepared for shipment.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 mb-4">
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Delivery
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your order will be delivered within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
