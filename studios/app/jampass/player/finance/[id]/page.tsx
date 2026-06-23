"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ReceiptText, RefreshCw } from "lucide-react"
import { fetchJson } from "@/lib/api"

interface PaymentTransaction {
  id?: number | string
  amount?: number | string
  currency?: string
  status?: string
  payment_reference?: string
  reference?: string
  description?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

function formatDate(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleString()
}

export default function PaymentTransactionDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ? decodeURIComponent(params.id) : ""
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("Invalid transaction id")
      setIsLoading(false)
      return
    }

    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await fetchJson<PaymentTransaction>(`/api/jampass/player/payments/transactions/${encodeURIComponent(id)}/`)
      setTransaction(data)
    } catch (err) {
      console.error("Failed to fetch payment transaction:", err)
      setError("Unable to load this payment transaction.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-8 text-sm text-slate-500">Loading payment transaction...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!transaction) return <div className="p-8 text-slate-600">Payment transaction not found</div>

  return (
    <main className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/jampass/player/finance" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
            <ArrowLeft className="h-4 w-4" />
            Payments
          </Link>
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <ReceiptText className="h-6 w-6 text-cyan-600" />
            Transaction {transaction.id ?? id}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">GET /api/v1/test/jampass/player/payments/transactions/{id}/</p>
        </div>
        <button
          type="button"
          onClick={fetchTransaction}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Amount</div>
          <div className="mt-1 text-2xl font-bold">
            {transaction.amount ?? "-"} {transaction.currency ?? ""}
          </div>
          <div className="mt-4 grid gap-3 text-sm">
            <div>
              <div className="text-slate-500">Status</div>
              <div className="font-semibold uppercase">{transaction.status || "pending"}</div>
            </div>
            <div>
              <div className="text-slate-500">Reference</div>
              <div className="break-all font-semibold">{transaction.payment_reference || transaction.reference || "-"}</div>
            </div>
            <div>
              <div className="text-slate-500">Created</div>
              <div>{formatDate(transaction.created_at)}</div>
            </div>
            <div>
              <div className="text-slate-500">Updated</div>
              <div>{formatDate(transaction.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 font-semibold">Raw transaction data</h3>
          <pre className="max-h-[560px] overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(transaction, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  )
}
