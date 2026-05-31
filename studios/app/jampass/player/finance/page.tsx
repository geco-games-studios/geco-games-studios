"use client"

import { useEffect, useState } from "react"
import { fetchJson, postJson } from "@/lib/api"

interface Account {
  id: number
  name?: string
  balance: number
  currency?: string
}

export default function PlayerFinancePage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [depositAmount, setDepositAmount] = useState<Record<number, string>>({})
  const [isDepositing, setIsDepositing] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchJson<Account[]>('/api/finance/accounts/')
      const list = Array.isArray(data) ? data : (data ? [data as any] : [])
      setAccounts(list)
    } catch (err) {
      console.error('Error fetching accounts:', err)
      setError('Failed to load accounts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async (accountId: number) => {
    const amountStr = depositAmount[accountId]
    const amount = Number(amountStr)
    if (!amount || amount <= 0) return

    setIsDepositing((s) => ({ ...s, [accountId]: true }))
    try {
      await postJson(`/api/finance/accounts/${accountId}/deposit/`, { amount })
      await fetchAccounts()
      setDepositAmount((s) => ({ ...s, [accountId]: "" }))
    } catch (err) {
      console.error('Deposit failed:', err)
      setError('Deposit failed')
    } finally {
      setIsDepositing((s) => ({ ...s, [accountId]: false }))
    }
  }

  if (isLoading) return <div className="p-8">Loading accounts…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Player Finance</h2>
      <p className="text-sm text-slate-600 mb-6">Your player accounts and balances. Ensure you're logged in as a player.</p>

      <div className="space-y-4">
        {accounts.length === 0 && <div className="text-sm text-slate-500">No accounts found.</div>}

        {accounts.map((acct) => (
          <div key={acct.id} className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{acct.name ?? `Account ${acct.id}`}</div>
                <div className="text-sm text-slate-500">ID: {acct.id}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{acct.balance?.toLocaleString?.() ?? acct.balance} {acct.currency ?? ''}</div>
                <div className="text-xs text-slate-500">balance</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={depositAmount[acct.id] ?? ''}
                onChange={(e) => setDepositAmount((s) => ({ ...s, [acct.id]: e.target.value }))}
                placeholder="Amount"
                className="px-3 py-2 rounded-md border w-40"
              />
              <button
                onClick={() => handleDeposit(acct.id)}
                disabled={isDepositing[acct.id]}
                className="px-4 py-2 rounded-md bg-cyan-600 text-white disabled:opacity-60"
              >
                {isDepositing[acct.id] ? 'Depositing…' : 'Deposit'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
