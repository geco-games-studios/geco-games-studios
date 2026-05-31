"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { fetchJson } from "@/lib/api"

interface AccountDetail {
  id: number
  name?: string
  balance: number
  currency?: string
  created_at?: string
}

export default function AccountDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ? Number(params.id) : null
  const [account, setAccount] = useState<AccountDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!id) {
      setError("Invalid account id")
      setIsLoading(false)
      return
    }
    fetchAccount()
  }, [id])

  const fetchAccount = async () => {
    try {
      setIsLoading(true)
      const data = await fetchJson(`/api/finance/accounts/${id}/`)
      setAccount(data as AccountDetail)
    } catch (err) {
      console.error("Failed to fetch account:", err)
      setError("Unable to load account. Please check your session and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-8">Loading account…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!account) return <div className="p-8 text-slate-600">Account not found</div>

  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Account {account.id}</h2>
      <div className="rounded-lg border p-4 bg-white shadow-sm max-w-xl">
        <div className="mb-2 font-semibold">{account.name ?? `Account ${account.id}`}</div>
        <div className="text-xl font-bold mb-1">{account.balance?.toLocaleString?.() ?? account.balance} {account.currency ?? ''}</div>
        <div className="text-sm text-slate-500">Balance</div>
        {account.created_at && (
          <div className="mt-3 text-xs text-slate-500">Created: {new Date(account.created_at).toLocaleString()}</div>
        )}
      </div>
    </main>
  )
}
