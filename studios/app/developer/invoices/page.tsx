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
