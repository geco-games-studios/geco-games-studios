"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FilePlus2, Search, Trash2 } from "lucide-react"
import { postJson } from "@/lib/api"
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

export default function DeveloperInvoicesPage() {
  const router = useRouter()
  const [form, setForm] = useState<InvoiceForm>(createInitialForm)
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", description: "", quantity: "1", unit_price: "" },
  ])
  const [invoiceId, setInvoiceId] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          Create an invoice, or open an existing invoice using its ID.
        </p>
      </header>

      {error && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleOpenInvoice} className="mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-slate-800 dark:bg-slate-900">
        <label className="flex-1 text-sm font-medium">
          Existing invoice ID
          <input
            value={invoiceId}
            onChange={(event) => setInvoiceId(event.target.value)}
            required
            inputMode="numeric"
            className={inputClassName()}
          />
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

"use client"

import { FormEvent, useEffect, useState } from "react"
import { fetchBlob, fetchJson, postJson } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Invoice = { id: number; invoice_number?: string; client_name: string; client_email?: string; currency: string; total?: string; grand_total?: string }
type Item = { name: string; description: string; quantity: string; unit_price: string }
const blankItem = (): Item => ({ name: "", description: "", quantity: "1", unit_price: "" })
function localDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
function initialForm() {
  return { business_name: "Geco Games", business_address: "Lusaka, Zambia", business_phone: "", business_email: "hello@gecogames.com", client_name: "", client_address: "", client_phone: "", client_email: "", issue_date: localDate(), due_date: localDate(14), currency: "ZMW", tax_rate: "0", discount_rate: "0", notes: "Thank you for your business.", payment_instructions: "", terms: "Payment is due within 14 days." }
}
function errorMessage(error: unknown): string {
  const data = (error as { responseData?: unknown })?.responseData
  if (data && typeof data === "object") {
    return Object.entries(data).map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`).join("; ")
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again."
}

export default function InvoicesPage() {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState<Item[]>([blankItem()])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      setError("Please sign in to generate and view invoices.")
      setLoading(false)
      return
    }
    setSignedIn(true)
    fetchJson<Invoice[] | { results: Invoice[] }>("/api/invoices/")
      .then(data => setInvoices(Array.isArray(data) ? data : data.results || []))
      .catch(error => setError(errorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError("")
    setNotice("")
    if (form.due_date < form.issue_date) { setError("Due date must be on or after the issue date."); return }
    setBusy("create")
    try {
      const invoice = await postJson<Invoice>("/api/invoices/", { ...form, items })
      setInvoices(previous => [invoice, ...previous])
      setShowForm(false)
      setForm(initialForm())
      setItems([blankItem()])
      setNotice(`Invoice ${invoice.invoice_number || invoice.id} generated. You can now download or email its PDF.`)
    } catch (error) { setError(errorMessage(error)) }
    finally { setBusy("") }
  }

  async function invoiceAction(invoice: Invoice, action: "pdf" | "email") {
    if (busy) return
    setBusy(`${action}-${invoice.id}`)
    setError("")
    setNotice("")
    try {
      if (action === "email") {
        await postJson(`/api/invoices/${invoice.id}/email/`, {})
        setNotice(`Invoice emailed to ${invoice.client_email}.`)
      } else {
        const blob = await fetchBlob(`/api/invoices/${invoice.id}/pdf/`)
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `invoice-${String(invoice.invoice_number || invoice.id).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (error) { setError(errorMessage(error)) }
    finally { setBusy("") }
  }

  function field(key: keyof typeof form, label: string, type = "text", required = false) {
    return <label key={key} className="grid gap-2 text-sm font-medium">{label}
      <Input type={type} value={form[key]} required={required} min={type === "number" ? "0" : undefined} max={type === "number" ? "100" : undefined} step={type === "number" ? "0.01" : undefined} minLength={key === "currency" ? 3 : undefined} maxLength={key === "currency" ? 3 : undefined}
        onChange={event => setForm(previous => ({ ...previous, [key]: key === "currency" ? event.target.value.toUpperCase() : event.target.value }))} />
    </label>
  }

  return <div className="invoice-page container mx-auto max-w-5xl space-y-6 p-4 md:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Invoices</h1><p className="mt-2 text-sm text-slate-500">Create invoices for your clients, download PDFs, and send them by email.</p></div>
      <Button disabled={!signedIn || Boolean(busy)} onClick={() => setShowForm(true)}>Generate invoice</Button>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">{notice}</p>}
    {showForm && <form onSubmit={createInvoice} className="space-y-6 rounded-xl border bg-background p-4 md:p-6">
      <h2 className="text-xl font-semibold">New invoice</h2>
      <fieldset disabled={Boolean(busy)} className="space-y-6">
        <fieldset><legend className="mb-3 font-semibold">Business details</legend><div className="grid gap-4 sm:grid-cols-2">
          {field("business_name", "Business name", "text", true)}{field("business_email", "Business email", "email", true)}{field("business_address", "Business address")}{field("business_phone", "Business phone", "tel")}
        </div></fieldset>
        <fieldset><legend className="mb-3 font-semibold">Client details</legend><div className="grid gap-4 sm:grid-cols-2">
          {field("client_name", "Client name", "text", true)}{field("client_email", "Client email", "email", true)}{field("client_address", "Client address")}{field("client_phone", "Client phone", "tel")}
        </div></fieldset>
        <div className="grid gap-4 sm:grid-cols-3">{field("issue_date", "Issue date", "date", true)}{field("due_date", "Due date", "date", true)}{field("currency", "Currency code", "text", true)}{field("tax_rate", "Tax (%)", "number", true)}{field("discount_rate", "Discount (%)", "number", true)}</div>
        <fieldset className="space-y-3"><legend className="mb-3 font-semibold">Line items</legend>
          {items.map((item, index) => <div key={index} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            {([ ["name", "Item name"], ["description", "Description"], ["quantity", "Quantity"], ["unit_price", "Unit price"] ] as const).map(([key, label]) => <label key={key} className="grid gap-2 text-sm">{label}
              <Input value={item[key]} required={key !== "description"} type={key === "quantity" || key === "unit_price" ? "number" : "text"} min={key === "quantity" ? "0.01" : "0"} step="0.01" onChange={event => setItems(previous => previous.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: event.target.value } : row))} />
            </label>)}
            <Button type="button" variant="outline" disabled={items.length === 1} onClick={() => setItems(previous => previous.filter((_, rowIndex) => rowIndex !== index))}>Remove item {index + 1}</Button>
          </div>)}
          <Button type="button" variant="outline" onClick={() => setItems(previous => [...previous, blankItem()])}>Add line item</Button>
        </fieldset>
        <p className="text-sm text-slate-500">The invoice number, tax, discount, and final totals are calculated when you generate the invoice.</p>
        <div className="grid gap-4 sm:grid-cols-2">{([ ["payment_instructions", "Payment instructions"], ["notes", "Notes"], ["terms", "Terms"] ] as const).map(([key, label]) => <label key={key} className="grid gap-2 text-sm font-medium">{label}<Textarea value={form[key]} onChange={event => setForm(previous => ({ ...previous, [key]: event.target.value }))} /></label>)}</div>
        <div className="flex gap-3"><Button type="submit">{busy === "create" ? "Generating…" : "Generate invoice"}</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
      </fieldset>
    </form>}
    <section className="space-y-3" aria-label="Your invoices">
      {loading ? <p role="status">Loading invoices…</p> : invoices.length === 0 && <p className="rounded-xl border p-6 text-slate-500">No invoices to display. Generate an invoice to get started.</p>}
      {invoices.map(invoice => <article key={invoice.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-5">
        <div><h2 className="font-semibold">{invoice.invoice_number || `Invoice ${invoice.id}`}</h2><p className="text-sm text-slate-500">{invoice.client_name}</p>{(invoice.total ?? invoice.grand_total) != null && <p className="mt-2 font-medium">{invoice.currency} {invoice.total ?? invoice.grand_total}</p>}</div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={Boolean(busy)} onClick={() => invoiceAction(invoice, "pdf")}>{busy === `pdf-${invoice.id}` ? "Downloading…" : "Download PDF"}</Button><Button disabled={Boolean(busy) || !invoice.client_email} onClick={() => invoiceAction(invoice, "email")}>{busy === `email-${invoice.id}` ? "Sending…" : "Email PDF"}</Button></div>
      </article>)}
    </section>
  </div>
}
