"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FilePlus2, RefreshCw, Search, Trash2 } from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"
import type { Invoice, InvoiceItem } from "@/lib/invoice-types"

interface InvoiceForm {
  business_name: string
  business_email: string
  client_name: string
  client_email: string
  issue_date: string
  due_date: string
  currency: string
  tax_rate: string
  discount_rate: string
  notes: string
  payment_instructions: string
  terms: string
}

type EditableInvoiceItemField = "name" | "description" | "quantity" | "unit_price"

function localDateValue() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function createInitialForm(): InvoiceForm {
  const today = localDateValue()
  return {
    business_name: "",
    business_email: "",
    client_name: "",
    client_email: "",
    issue_date: today,
    due_date: today,
    currency: "ZMW",
    tax_rate: "0.00",
    discount_rate: "0.00",
    notes: "",
    payment_instructions: "",
    terms: "",
  }
}

function inputClassName() {
  return "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
}

function readInvoiceList(data: unknown): Invoice[] {
  if (Array.isArray(data)) return data as Invoice[]
  if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
    return data.results as Invoice[]
  }
  throw new Error("The invoice list response was not in the expected format.")
}

export default function DeveloperInvoicesPage() {
  const router = useRouter()
  const [form, setForm] = useState<InvoiceForm>(createInitialForm)
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", description: "", quantity: "1", unit_price: "" },
  ])
  const [invoiceId, setInvoiceId] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true)
  const [invoiceListError, setInvoiceListError] = useState("")

  const loadInvoices = useCallback(async () => {
    setIsLoadingInvoices(true)
    setInvoiceListError("")
    try {
      const data = await fetchJson<unknown>("invoices/")
      setInvoices(readInvoiceList(data))
    } catch (requestError) {
      console.error("Failed to load invoices:", requestError)
      setInvoiceListError(requestError instanceof Error ? requestError.message : "Unable to load invoices.")
    } finally {
      setIsLoadingInvoices(false)
    }
  }, [])

  useEffect(() => {
    void loadInvoices()
  }, [loadInvoices])

  const updateForm = (field: keyof InvoiceForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateItem = (index: number, field: EditableInvoiceItemField, value: string) => {
    setItems((current) => current.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    ))
  }

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const invoice = await postJson<Invoice>("invoices/", {
        ...form,
        items: items.map(({ name, description, quantity, unit_price }) => ({
          name,
          description,
          quantity,
          unit_price,
        })),
      })
      router.push(`/developer/invoices/${encodeURIComponent(String(invoice.id))}`)
    } catch (requestError) {
      console.error("Invoice creation failed:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Invoice creation failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenInvoice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id = invoiceId.trim()
    if (id) router.push(`/developer/invoices/${encodeURIComponent(id)}`)
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          View your invoices, record payments, and download payment receipts.
        </p>
      </header>

      {error && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="font-semibold">Your invoices</h2>
          <button type="button" onClick={() => void loadInvoices()} disabled={isLoadingInvoices} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        {isLoadingInvoices ? (
          <p role="status" className="p-4 text-sm text-slate-500">Loading invoices...</p>
        ) : invoiceListError ? (
          <div className="p-4">
            <p role="alert" className="text-sm text-red-700">{invoiceListError}</p>
            <button type="button" onClick={() => void loadInvoices()} className="mt-2 text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-400">Try again</button>
          </div>
        ) : invoices.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No invoices yet. Create one below and it will appear here.</p>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/developer/invoices/${encodeURIComponent(String(invoice.id))}`}
                className="flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800"
              >
                <div>
                  <div className="font-semibold">{invoice.invoice_number}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{invoice.client_name} · Due {invoice.due_date}</div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <div className="font-semibold">{invoice.currency} {invoice.totals.total}</div>
                    <div className="text-xs text-slate-500">{invoice.currency} {invoice.balance_due} due</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {invoice.payment_status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <form onSubmit={handleOpenInvoice} className="mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-slate-800 dark:bg-slate-900">
        <label className="flex-1 text-sm font-medium">
          Open invoice by ID
          <input value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)} required inputMode="numeric" className={inputClassName()} />
        </label>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
          <Search className="h-4 w-4" />
          Open invoice
        </button>
      </form>

      <form onSubmit={handleCreateInvoice} className="space-y-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <FilePlus2 className="h-5 w-5 text-cyan-600" />
          Create invoice
        </h2>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Business and client</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Business name *
              <input value={form.business_name} onChange={(event) => updateForm("business_name", event.target.value)} required className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Business email
              <input type="email" value={form.business_email} onChange={(event) => updateForm("business_email", event.target.value)} className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Client name *
              <input value={form.client_name} onChange={(event) => updateForm("client_name", event.target.value)} required className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Client email
              <input type="email" value={form.client_email} onChange={(event) => updateForm("client_email", event.target.value)} className={inputClassName()} />
            </label>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Dates and rates</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium">
              Issue date *
              <input type="date" value={form.issue_date} onChange={(event) => updateForm("issue_date", event.target.value)} required className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Due date *
              <input type="date" value={form.due_date} onChange={(event) => updateForm("due_date", event.target.value)} required className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Currency
              <input value={form.currency} onChange={(event) => updateForm("currency", event.target.value)} required maxLength={3} className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Tax rate (%)
              <input type="number" min="0" step="0.01" value={form.tax_rate} onChange={(event) => updateForm("tax_rate", event.target.value)} className={inputClassName()} />
            </label>
            <label className="text-sm font-medium">
              Discount rate (%)
              <input type="number" min="0" step="0.01" value={form.discount_rate} onChange={(event) => updateForm("discount_rate", event.target.value)} className={inputClassName()} />
            </label>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Line items</h3>
            <button type="button" onClick={() => setItems((current) => [...current, { name: "", description: "", quantity: "1", unit_price: "" }])} className="text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-400">
              Add item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_0.7fr_0.8fr_auto] dark:border-slate-800">
                <label className="text-sm font-medium">
                  Name *
                  <input value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} required className={inputClassName()} />
                </label>
                <label className="text-sm font-medium">
                  Description
                  <input value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} className={inputClassName()} />
                </label>
                <label className="text-sm font-medium">
                  Quantity *
                  <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required className={inputClassName()} />
                </label>
                <label className="text-sm font-medium">
                  Unit price *
                  <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(event) => updateItem(index, "unit_price", event.target.value)} required className={inputClassName()} />
                </label>
                <button
                  type="button"
                  aria-label={`Remove item ${index + 1}`}
                  disabled={items.length === 1}
                  onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="self-end rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium">
            Notes
            <textarea rows={3} value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} className={inputClassName()} />
          </label>
          <label className="text-sm font-medium">
            Payment instructions
            <textarea rows={3} value={form.payment_instructions} onChange={(event) => updateForm("payment_instructions", event.target.value)} className={inputClassName()} />
          </label>
          <label className="text-sm font-medium">
            Terms
            <textarea rows={3} value={form.terms} onChange={(event) => updateForm("terms", event.target.value)} className={inputClassName()} />
          </label>
        </section>

        <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
            <FilePlus2 className="h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create invoice"}
          </button>
        </div>
      </form>
    </div>
  )
}
