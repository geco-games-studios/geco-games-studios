"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchJson, putJson, deleteJson, postJson } from "@/lib/api"

export default function StoreItemDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ? Number(params.id) : null
  const [item, setItem] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => { if (id) fetchItem() }, [id])

  const fetchItem = async () => {
    try { setIsLoading(true); const data = await fetchJson(`/api/developer/store-items/${id}/`); setItem(data); setName((data as any).name ?? ''); setPrice(((data as any).price ?? '') + ''); } catch (err) { console.error(err); setError('Failed to load') } finally { setIsLoading(false) }
  }

  const handleSave = async () => {
    if (!name.trim() || !price) { setError('Name and price required'); return }
    try { await putJson(`/api/developer/store-items/${id}/`, { name: name.trim(), price: Number(price) }); await fetchItem() } catch (err) { console.error(err); setError('Save failed') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete item?')) return
    try { await deleteJson(`/api/developer/store-items/${id}/`); window.location.href = '/developer/store-items' } catch (err) { console.error(err); setError('Delete failed') }
  }

  const handleBuy = async () => {
    try { await postJson(`/api/developer/store-items/${id}/buy/`, {}); alert('Buy request sent'); } catch (err) { console.error(err); setError('Buy failed') }
  }

  if (isLoading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!item) return <div className="p-6">Item not found</div>

  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Item {item.id}</h2>
      <div className="max-w-xl space-y-3">
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border rounded w-full" />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="px-3 py-2 border rounded w-40" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-2 bg-cyan-600 text-white rounded">Save</button>
          <button onClick={handleDelete} className="px-3 py-2 bg-red-100 text-red-700 rounded">Delete</button>
          <button onClick={handleBuy} className="px-3 py-2 bg-emerald-600 text-white rounded">Buy</button>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Transactions</h3>
          <StoreItemTransactions id={id} />
        </div>
      </div>
    </main>
  )
}

function StoreItemTransactions({ id }: { id: number | null }) {
  const [txs, setTxs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) fetchTxs() }, [id])

  const fetchTxs = async () => {
    try { setLoading(true); const data = await fetchJson(`/api/developer/store-items/${id}/transactions/`); setTxs(Array.isArray(data) ? data : []) } catch (err) { console.warn(err) } finally { setLoading(false) }
  }

  if (loading) return <div>Loading…</div>
  if (!txs.length) return <div className="text-sm text-slate-500">No transactions</div>

  return (
    <div className="space-y-2">
      {txs.map((t) => (
        <div key={t.id} className="p-2 border rounded bg-white">
          <div className="text-sm font-semibold">{t.type}</div>
          <div className="text-xs text-slate-500">{t.amount} — {t.created_at}</div>
        </div>
      ))}
    </div>
  )
}
