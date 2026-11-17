"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"

function inputClassName() {
  return "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
}

export default function DeveloperReceiptsPage() {
  const router = useRouter()
  const [invoiceId, setInvoiceId] = useState("")
  const [paymentId, setPaymentId] = useState("")

  const handleOpenReceipt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/developer/receipts/${encodeURIComponent(invoiceId.trim())}/${encodeURIComponent(paymentId.trim())}`)
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Payment receipts</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Enter an invoice ID and payment ID to download its PDF receipt.</p>
      </header>

      <form onSubmit={handleOpenReceipt} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="block text-sm font-medium">
          Invoice ID
          <input value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)} required inputMode="numeric" className={inputClassName()} />
        </label>
        <label className="block text-sm font-medium">
          Payment ID
          <input value={paymentId} onChange={(event) => setPaymentId(event.target.value)} required inputMode="numeric" className={inputClassName()} />
        </label>
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
          <Download className="h-4 w-4" />
          Open receipt
        </button>
      </form>
    </div>
  )
}
