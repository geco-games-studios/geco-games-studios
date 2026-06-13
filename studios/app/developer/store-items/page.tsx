"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchJson, postJson } from "@/lib/api"

export default function StoreItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [cost, setCost] = useState("")
  const [txns] = useState<any[]>([])

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const data = await fetchJson('developer/store-items/')
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('Failed to load')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    setError("")
    if (!name.trim() || value === "" || cost === "") {
      setError('Name, value and cost are required')
      return
    }

    const payload = {
      name: name.trim(),
      value: Number(value),
      cost: Number(cost),
    }

    try {
      await postJson('developer/store-items/', payload)
      setName('')
      setValue('')
      setCost('')
      await fetchItems()
    } catch (err) {
      console.error(err)
      setError('Create failed')
    }
  }

  if (isLoading) return <div className="p-6">Loading store…</div>

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Store 1</h1>
          <div className="mt-2">
            <h2 className="text-lg font-semibold">Kopala Market</h2>
            <p className="text-sm text-slate-500">Kopala Market</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-slate-100">Edit</button>
          <button className="px-3 py-2 rounded bg-red-50 text-red-600">Delete</button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="font-semibold mb-3">Items</h3>

        <div className="mb-4 flex gap-2 items-center">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className="px-3 py-2 border rounded" />
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" type="number" className="px-3 py-2 border rounded w-28" />
          <input value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" type="number" step="0.01" className="px-3 py-2 border rounded w-28" />
          <button onClick={handleCreate} className="px-3 py-2 bg-cyan-600 text-white rounded">Add Item</button>
        </div>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">No items</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="p-3 border rounded bg-white flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-slate-500">Value: {it.value} — Cost: {it.cost}</div>
                </div>
                <Link href={`/developer/store-items/${it.id}`} className="px-3 py-2 bg-slate-100 rounded">Manage</Link>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3">Transactions</h3>
        {txns.length === 0 ? (
          <div className="text-sm text-slate-500">No transactions</div>
        ) : (
          <div className="space-y-2">{txns.map((t) => <div key={t.id}>{t.id}</div>)}</div>
        )}
      </section>
    </main>
  )
}
