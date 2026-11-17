"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Download, Mail, RefreshCw } from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"
import { formatInvoiceAmount } from "@/lib/invoice-types"
import type { Invoice, InvoicePayment } from "@/lib/invoice-types"

function todayValue() {
  const date = new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

function formatDate(value?: string) {
  if (!value) return "-"
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString()
}

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const invoiceId = String(params.id || "")
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [amount, setAmount] = useState("")
  const [paidAt, setPaidAt] = useState(todayValue)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [reference, setReference] = useState("")
  const [latestPayment, setLatestPayment] = useState<InvoicePayment | null>(null)
  const [emailingPaymentId, setEmailingPaymentId] = useState<number | null>(null)

  const loadInvoice = useCallback(async (): Promise<boolean> => {
    if (!invoiceId) {
      setError("Invalid invoice ID.")
      setIsLoading(false)
      return false
    }
    try {
      setIsLoading(true)
      setError("")
      const data = await fetchJson<Invoice>(`/api/invoices/${encodeURIComponent(invoiceId)}/`)
      setInvoice(data)
      return true
    } catch (requestError) {
      console.error("Failed to load invoice:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Unable to load this invoice.")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    void loadInvoice()
  }, [loadInvoice])

  const handleRecordPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!invoice) return

    setIsSubmitting(true)
    setError("")
    setNotice("")
    setLatestPayment(null)

    try {
      const payload: { amount: string; paid_at?: string; payment_method?: string; reference?: string } = { amount }
      if (paidAt) payload.paid_at = paidAt
      if (paymentMethod.trim()) payload.payment_method = paymentMethod.trim()
      if (reference.trim()) payload.reference = reference.trim()
      const payment = await postJson<InvoicePayment>(`/api/invoices/${encodeURIComponent(invoiceId)}/payments/`, {
        ...payload,
      })
      setLatestPayment(payment)
      setAmount("")
      setPaymentMethod("")
      setReference("")

      if (await loadInvoice()) {
        setNotice("Payment recorded. Invoice balances have been refreshed.")
      } else {
        setNotice("Payment was recorded, but the invoice could not be refreshed. Use Refresh to try again.")
      }
    } catch (requestError) {
      console.error("Failed to record invoice payment:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Unable to record this payment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailReceipt = async (payment: InvoicePayment) => {
    const clientEmail = invoice?.client_email?.trim()
    if (!clientEmail) {
      setError("Add a client email to this invoice before emailing a receipt.")
      setNotice("")
      return
    }

    const confirmed = window.confirm(`Email receipt ${payment.receipt_number} to ${clientEmail}?`)
    if (!confirmed) return

    setEmailingPaymentId(payment.id)
    setError("")
    setNotice("")
    try {
      const response = await postJson<{ detail?: string }>(
        `/api/invoices/${encodeURIComponent(invoiceId)}/payments/${encodeURIComponent(String(payment.id))}/email/`,
        {}
      )
      setNotice(response.detail || `Receipt emailed to ${clientEmail}.`)
    } catch (requestError) {
      console.error("Failed to email payment receipt:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Unable to email this receipt.")
    } finally {
      setEmailingPaymentId(null)
    }
  }

  if (isLoading) return <div className="container mx-auto p-6 text-sm text-slate-500">Loading invoice...</div>
  if (error && !invoice) return <div role="alert" className="container mx-auto p-6 text-sm text-red-700">{error}</div>
  if (!invoice) return <div className="container mx-auto p-6 text-sm text-slate-600">Invoice not found.</div>

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/developer/invoices" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-400">
            <ArrowLeft className="h-4 w-4" />
            Invoices
          </Link>
          <h1 className="text-2xl font-semibold">{invoice.invoice_number}</h1>
          <p className="mt-1 text-sm text-slate-500">Invoice ID: {invoice.id}</p>
        </div>
        <button type="button" onClick={() => void loadInvoice()} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {error && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">From</div>
                <div className="mt-1 font-semibold">{invoice.business_name}</div>
                {invoice.business_email && <div className="text-sm text-slate-500">{invoice.business_email}</div>}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Bill to</div>
                <div className="mt-1 font-semibold">{invoice.client_name}</div>
                {invoice.client_email && <div className="text-sm text-slate-500">{invoice.client_email}</div>}
                {invoice.client_phone && <div className="text-sm text-slate-500">{invoice.client_phone}</div>}
                {invoice.client_address && <div className="whitespace-pre-wrap text-sm text-slate-500">{invoice.client_address}</div>}
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Issued: </span>{formatDate(invoice.issue_date)}
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Due: </span>{formatDate(invoice.due_date)}
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
                  <tr><th className="py-2 pr-3">Item</th><th className="py-2 pr-3">Quantity</th><th className="py-2 pr-3">Unit price</th><th className="py-2 text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td className="py-3 pr-3"><div className="font-medium">{item.name}</div>{item.description && <div className="text-xs text-slate-500">{item.description}</div>}</td>
                      <td className="py-3 pr-3">{item.quantity}</td>
                      <td className="py-3 pr-3">{formatInvoiceAmount(item.unit_price, invoice.currency)}</td>
                      <td className="py-3 text-right">{formatInvoiceAmount(item.line_total ?? "—", invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 ml-auto max-w-xs space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatInvoiceAmount(invoice.totals.subtotal, invoice.currency)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>{formatInvoiceAmount(invoice.totals.discount_amount, invoice.currency)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatInvoiceAmount(invoice.totals.tax_amount, invoice.currency)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold dark:border-slate-800"><span>Total</span><span>{formatInvoiceAmount(invoice.totals.total, invoice.currency)}</span></div>
            </div>
            {(invoice.notes || invoice.payment_instructions || invoice.terms) && (
              <div className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-3 dark:border-slate-800">
                {invoice.notes && <div><div className="font-semibold">Notes</div><p className="mt-1 whitespace-pre-wrap text-slate-600 dark:text-slate-400">{invoice.notes}</p></div>}
                {invoice.payment_instructions && <div><div className="font-semibold">Payment instructions</div><p className="mt-1 whitespace-pre-wrap text-slate-600 dark:text-slate-400">{invoice.payment_instructions}</p></div>}
                {invoice.terms && <div><div className="font-semibold">Terms</div><p className="mt-1 whitespace-pre-wrap text-slate-600 dark:text-slate-400">{invoice.terms}</p></div>}
              </div>
            )}
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Payment history</h2>
              <Link href="/developer/receipts" className="text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-400">Receipts</Link>
            </div>
            {invoice.payments.length === 0 ? (
              <p className="text-sm text-slate-500">No payments have been recorded.</p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-semibold">{payment.receipt_number}</div>
                      <div className="text-xs text-slate-500">{formatDate(payment.paid_at)}{payment.payment_method ? ` · ${payment.payment_method}` : ""}{payment.reference ? ` · ${payment.reference}` : ""}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right text-sm">
                        <div className="font-semibold">{formatInvoiceAmount(payment.amount, invoice.currency)}</div>
                        <div className="text-xs text-slate-500">Balance after: {formatInvoiceAmount(payment.balance_after, invoice.currency)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/developer/receipts/${encodeURIComponent(String(invoice.id))}/${encodeURIComponent(String(payment.id))}`} aria-label={`Download receipt ${payment.receipt_number}`} className="rounded-md border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                          <Download className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleEmailReceipt(payment)}
                          disabled={emailingPaymentId !== null}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Mail className="h-4 w-4" />
                          {emailingPaymentId === payment.id ? "Sending..." : "Email receipt"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">Payment status</div>
            <div className="mt-1 text-lg font-semibold capitalize">{invoice.payment_status.replace("_", " ")}</div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Total</dt><dd className="font-semibold">{formatInvoiceAmount(invoice.totals.total, invoice.currency)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Amount paid</dt><dd>{formatInvoiceAmount(invoice.amount_paid, invoice.currency)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Balance due</dt><dd className="font-semibold">{formatInvoiceAmount(invoice.balance_due, invoice.currency)}</dd></div>
            </dl>
          </section>

          {invoice.payment_status !== "paid" && Number(invoice.balance_due) > 0 && (
            <form onSubmit={handleRecordPayment} className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold">Record payment</h2>
              <label className="block text-sm font-medium">
                Amount *
                <input type="number" min="0.01" max={invoice.balance_due} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
                <span className="mt-1 block text-xs text-slate-500">Outstanding: {formatInvoiceAmount(invoice.balance_due, invoice.currency)}</span>
              </label>
              <label className="block text-sm font-medium">
                Paid at
                <input type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <label className="block text-sm font-medium">
                Payment method
                <input value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <label className="block text-sm font-medium">
                Reference
                <input value={reference} onChange={(event) => setReference(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
                {isSubmitting ? "Recording..." : "Record payment"}
              </button>
            </form>
          )}
        </aside>
      </section>

      {latestPayment && (
        <section className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
          <div className="font-semibold">Payment recorded: {latestPayment.receipt_number}</div>
          <div className="mt-1">Balance after payment: {formatInvoiceAmount(latestPayment.balance_after, invoice.currency)}</div>
          <Link href={`/developer/receipts/${encodeURIComponent(String(invoice.id))}/${encodeURIComponent(String(latestPayment.id))}`} className="mt-3 inline-flex items-center gap-2 font-semibold underline">
            <Download className="h-4 w-4" />
            Download receipt
          </Link>
        </section>
      )}
    </div>
  )
}
