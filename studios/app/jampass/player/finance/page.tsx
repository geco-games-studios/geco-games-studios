"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CreditCard, RefreshCw, Search, ShieldCheck, Store, Trophy } from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"

type PaymentMode = "store" | "tournament"

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
  type?: string
  [key: string]: unknown
}

interface PaymentForm {
  amount: string
  currency: string
  phone_number: string
  store_item: string
  quantity: string
  tournament: string
}

const initialPaymentForm: PaymentForm = {
  amount: "",
  currency: "ZMW",
  phone_number: "",
  store_item: "",
  quantity: "1",
  tournament: "",
}

function readTransactionList(data: unknown) {
  if (Array.isArray(data)) return data as PaymentTransaction[]
  if (data && typeof data === "object") {
    const candidate = data as { results?: unknown; transactions?: unknown; data?: unknown }
    if (Array.isArray(candidate.results)) return candidate.results as PaymentTransaction[]
    if (Array.isArray(candidate.transactions)) return candidate.transactions as PaymentTransaction[]
    if (Array.isArray(candidate.data)) return candidate.data as PaymentTransaction[]
  }
  return []
}

function getReference(transaction: PaymentTransaction) {
  return transaction.payment_reference || transaction.reference || ""
}

function formatDate(value?: string) {
  if (!value) return "Pending"
  return new Date(value).toLocaleString()
}

export default function PlayerFinancePage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<PaymentMode>("store")
  const [form, setForm] = useState<PaymentForm>(initialPaymentForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState<PaymentTransaction | null>(null)
  const [otpReference, setOtpReference] = useState("")
  const [otp, setOtp] = useState("")
  const [isConfirmingOtp, setIsConfirmingOtp] = useState(false)
  const [statusReference, setStatusReference] = useState("")
  const [statusResult, setStatusResult] = useState<PaymentTransaction | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const endpointLabel = useMemo(() => {
    return mode === "store"
      ? "POST /api/v1/test/jampass/player/payments/store/"
      : "POST /api/v1/test/jampass/player/payments/tournament/"
  }, [mode])

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await fetchJson<unknown>("/api/jampass/player/payments/transactions/")
      setTransactions(readTransactionList(data))
    } catch (err) {
      console.error("Error fetching payment transactions:", err)
      setError("Failed to load payment transactions.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateForm = (field: keyof PaymentForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      amount: Number(form.amount),
      currency: form.currency.trim(),
      phone_number: form.phone_number.trim(),
    }

    if (mode === "store") {
      payload.store_item = Number(form.store_item)
      payload.quantity = Number(form.quantity)
    } else {
      payload.tournament = Number(form.tournament)
    }

    return payload
  }

  const handleCreatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const endpoint = mode === "store" ? "/api/jampass/player/payments/store/" : "/api/jampass/player/payments/tournament/"
      const data = await postJson<PaymentTransaction>(endpoint, buildPayload())
      setPaymentResponse(data)
      const reference = getReference(data)
      if (reference) {
        setOtpReference(String(reference))
        setStatusReference(String(reference))
      }
      await fetchTransactions()
    } catch (err) {
      console.error("Payment request failed:", err)
      setError("Payment request failed. Check the details and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsConfirmingOtp(true)
    setError("")

    try {
      const data = await postJson<PaymentTransaction>("/api/jampass/player/payments/otp/", {
        payment_reference: otpReference.trim(),
        otp: otp.trim(),
      })
      setPaymentResponse(data)
      await fetchTransactions()
    } catch (err) {
      console.error("OTP confirmation failed:", err)
      setError("OTP confirmation failed.")
    } finally {
      setIsConfirmingOtp(false)
    }
  }

  const handleCheckStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCheckingStatus(true)
    setError("")

    try {
      const reference = encodeURIComponent(statusReference.trim())
      const data = await fetchJson<PaymentTransaction>(`/api/jampass/player/payments/${reference}/status/`)
      setStatusResult(data)
    } catch (err) {
      console.error("Payment status check failed:", err)
      setError("Payment status check failed.")
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <main className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Player Payments</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Create JamPass payments, confirm OTPs, and track transaction status.</p>
        </div>
        <button
          type="button"
          onClick={fetchTransactions}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex rounded-md border border-slate-200 p-1 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMode("store")}
              className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
                mode === "store" ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Store className="h-4 w-4" />
              Store
            </button>
            <button
              type="button"
              onClick={() => setMode("tournament")}
              className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
                mode === "tournament" ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Trophy className="h-4 w-4" />
              Tournament
            </button>
          </div>

          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Amount
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="text-sm font-medium">
                Currency
                <input
                  value={form.currency}
                  onChange={(event) => updateForm("currency", event.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="text-sm font-medium">
                Phone Number
                <input
                  value={form.phone_number}
                  onChange={(event) => updateForm("phone_number", event.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              {mode === "store" ? (
                <>
                  <label className="text-sm font-medium">
                    Store Item ID
                    <input
                      type="number"
                      min="1"
                      value={form.store_item}
                      onChange={(event) => updateForm("store_item", event.target.value)}
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(event) => updateForm("quantity", event.target.value)}
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm font-medium">
                  Tournament ID
                  <input
                    type="number"
                    min="1"
                    value={form.tournament}
                    onChange={(event) => updateForm("tournament", event.target.value)}
                    required
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">{endpointLabel}</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Create Payment"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleConfirmOtp} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-cyan-600" />
              Confirm OTP
            </h3>
            <div className="space-y-3">
              <input
                value={otpReference}
                onChange={(event) => setOtpReference(event.target.value)}
                placeholder="Payment reference"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="OTP"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                type="submit"
                disabled={isConfirmingOtp}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-950"
              >
                <ShieldCheck className="h-4 w-4" />
                {isConfirmingOtp ? "Confirming..." : "Confirm Payment"}
              </button>
            </div>
          </form>

          <form onSubmit={handleCheckStatus} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Search className="h-4 w-4 text-cyan-600" />
              Check Status
            </h3>
            <div className="space-y-3">
              <input
                value={statusReference}
                onChange={(event) => setStatusReference(event.target.value)}
                placeholder="Payment reference"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                type="submit"
                disabled={isCheckingStatus}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Search className="h-4 w-4" />
                {isCheckingStatus ? "Checking..." : "Check Status"}
              </button>
            </div>
            {statusResult && (
              <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                {JSON.stringify(statusResult, null, 2)}
              </pre>
            )}
          </form>
        </div>
      </section>

      {paymentResponse && (
        <section className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
          <div className="mb-2 font-semibold">Latest response</div>
          <pre className="max-h-52 overflow-auto whitespace-pre-wrap">{JSON.stringify(paymentResponse, null, 2)}</pre>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <h3 className="font-semibold">Transactions</h3>
          <span className="text-xs text-slate-500">GET /api/v1/test/jampass/player/payments/transactions/</span>
        </div>
        {isLoading ? (
          <div className="p-4 text-sm text-slate-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">No payment transactions found.</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {transactions.map((transaction, index) => {
              const id = transaction.id ?? getReference(transaction) ?? index
              return (
                <Link
                  key={String(id)}
                  href={`/jampass/player/finance/${encodeURIComponent(String(id))}`}
                  className="grid gap-2 p-4 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto] dark:hover:bg-slate-800"
                >
                  <div>
                    <div className="font-semibold">{transaction.description || getReference(transaction) || `Transaction ${id}`}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatDate(transaction.created_at)}</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="font-semibold">
                      {transaction.amount ?? "-"} {transaction.currency ?? ""}
                    </div>
                    <div className="text-xs uppercase text-slate-500">{transaction.status || transaction.type || "pending"}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
