"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, Search } from "lucide-react"

type DomainResult = {
  domain: string
  available: boolean
  message: string
}

export default function DomainSearch() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<DomainResult | null>(null)
  const [error, setError] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    setError("")
    setIsSearching(true)

    try {
      const response = await fetch(`/api/domains/check?domain=${encodeURIComponent(domain)}`)
      const data = (await response.json()) as DomainResult

      if (!response.ok) {
        throw new Error(data.message || "We couldn't check that domain. Please try again.")
      }

      setResult(data)
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "We couldn't check that domain. Please try again.",
      )
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left sm:p-8">
      <form onSubmit={handleSubmit}>
        <label htmlFor="domain-search" className="block text-sm font-semibold text-white">
          Find a domain name
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="domain-search"
            type="text"
            autoComplete="url"
            required
            maxLength={253}
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="yourstudio.com"
            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#100d3d] px-4 py-3 text-white placeholder:text-violet-200/60 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3 font-bold text-white transition hover:bg-violet-400 disabled:cursor-wait disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {isSearching ? "Checking..." : "Search domain"}
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="mt-5 flex items-start gap-2 text-rose-200">
          <AlertCircle className="mt-1 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
      {result ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 rounded-2xl border border-white/10 bg-[#100d3d]/70 p-4"
        >
          <p className="flex items-start gap-2 font-semibold text-white">
            {result.available ? (
              <Search className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
            ) : (
              <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
            )}
            <span>
              {result.domain}: {result.available ? "No registration record found" : "Already registered"}
            </span>
          </p>
          <p className="mt-2 text-sm leading-6 text-violet-100">{result.message}</p>
          <p className="mt-3 text-sm text-violet-100">
            Need help registering a domain?{" "}
            <a
              href={`mailto:hello@gecogamesstudios.com?subject=${encodeURIComponent(`Domain registration: ${result.domain}`)}`}
              className="font-semibold text-cyan-200 underline underline-offset-4 hover:text-white"
            >
              Contact our team
            </a>
          </p>
        </div>
      ) : null}
    </div>
  )
}
