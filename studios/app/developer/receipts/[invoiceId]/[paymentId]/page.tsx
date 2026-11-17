"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"
import { getAuthHeaders, getRequestUrl } from "@/lib/api"

function describeErrorBody(body: string) {
  if (!body) return ""
  try {
    const data: unknown = JSON.parse(body)
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>
      const message = record.detail ?? record.message ?? record.error
      if (typeof message === "string") return message
    }
  } catch {
    return body
  }
  return body
}

export default function PaymentReceiptPage() {
  const params = useParams<{ invoiceId: string; paymentId: string }>()
  const invoiceId = String(params.invoiceId || "")
  const paymentId = String(params.paymentId || "")
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState("")

  const handleDownload = async () => {
    setIsDownloading(true)
    setError("")

    try {
      const endpoint = `invoices/${encodeURIComponent(invoiceId)}/payments/${encodeURIComponent(paymentId)}/receipt/`
      const response = await fetch(getRequestUrl(endpoint), {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const detail = describeErrorBody(await response.text())
        throw new Error(detail || `Receipt download failed with status ${response.status}.`)
      }

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.toLowerCase().includes("pdf")) {
        throw new Error("The server did not return a PDF receipt.")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `invoice-${invoiceId}-payment-${paymentId}-receipt.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch (requestError) {
      console.error("Receipt download failed:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Unable to download this receipt.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6">
      <Link href={`/developer/invoices/${encodeURIComponent(invoiceId)}`} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-400">
        <ArrowLeft className="h-4 w-4" />
        Back to invoice
      </Link>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Payment receipt</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Invoice {invoiceId} · Payment {paymentId}</p>
        <button type="button" onClick={handleDownload} disabled={isDownloading} className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
          <Download className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download PDF receipt"}
        </button>
        {error && <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      </section>
    </div>
  )
}
