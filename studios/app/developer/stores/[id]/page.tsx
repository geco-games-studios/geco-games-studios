"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchJson, putJson, patchJson, deleteJson, postJson } from "@/lib/api"

interface StoreDetail {
  id: number
  name: string
  description?: string
}

export default function StoreDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ? Number(params.id) : null
  const router = useRouter()

  const [store, setStore] = useState<StoreDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => { if (id) fetchStore() }, [id])

  const fetchStore = async () => {
    try {
      setIsLoading(true)
      const data = await fetchJson(`/api/developer/stores/${id}/`)
      setStore(data as StoreDetail)
      setName((data as any).name ?? "")
      setDescription((data as any).description ?? "")
    } catch (err) {
      console.error('Failed to load store:', err)
      setError('Unable to load store')
    } finally { setIsLoading(false) }
  }

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    try {
      await putJson(`/api/developer/stores/${id}/`, { name: name.trim(), description: description.trim() })
      setEditing(false)
      await fetchStore()
    } catch (err) {
      console.error('Save failed:', err)
      setError('Failed to save')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this store?')) return
    try {
      await deleteJson(`/api/developer/stores/${id}/`)
      router.push('/developer/stores')
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete')
    }
  }

  if (isLoading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!store) return <div className="p-6">Store not found</div>

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Store {store.id}</h2>
        <div className="flex gap-2">
          <button onClick={() => setEditing((s) => !s)} className="px-3 py-2 bg-slate-100 rounded">{editing ? 'Cancel' : 'Edit'}</button>
          <button onClick={handleDelete} className="px-3 py-2 bg-red-100 text-red-700 rounded">Delete</button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2 max-w-xl">
          <input placeholder="Store name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border rounded w-full" />
          <input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} className="px-3 py-2 border rounded w-full" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-3 py-2 bg-cyan-600 text-white rounded">Save</button>
          </div>
        </div>
      ) : (
        <div className="max-w-xl">
          <div className="font-semibold text-lg">{store.name}</div>
          {store.description && <div className="text-sm text-slate-500">{store.description}</div>}

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Items</h3>
            <StoreItemsList storeId={store.id} />
            <h3 className="font-semibold mt-6">Transactions</h3>
            <StoreTransactionsList storeId={store.id} />
          </div>
        </div>
      )}
    </main>
  )
}

function StoreItemsList({ storeId }: { storeId: number }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [cost, setCost] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchItems() }, [storeId])

  const fetchItems = async () => {
    try { setLoading(true); const data = await fetchJson(`/api/developer/stores/${storeId}/items/`); setItems(Array.isArray(data) ? data : []) } catch (err) { console.warn(err) } finally { setLoading(false) }
  }

  const handleCreate = async () => {
    if (!name.trim() || value === "" || cost === "") return
    try {
      setCreating(true)
      await postJson(`/api/developer/stores/${storeId}/items/`, { name: name.trim(), value: Number(value), cost: Number(cost) })
      setName('')
      setValue('')
      setCost('')
      await fetchItems()
    } catch (err) { console.error(err) } finally { setCreating(false) }
  }

  if (loading) return <div>Loading items…</div>

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border rounded" />
        <input placeholder="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="px-3 py-2 border rounded w-28" />
        <input placeholder="Cost" type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} className="px-3 py-2 border rounded w-28" />
        <button onClick={handleCreate} disabled={creating} className="px-3 py-2 bg-cyan-600 text-white rounded">{creating ? 'Adding…' : 'Add Item'}</button>
      </div>

      {items.length === 0 && <div className="text-sm text-slate-500">No items</div>}
      {items.map((it) => (
        <div key={it.id} className="p-2 border rounded flex items-center justify-between bg-white">
          <div>
            <div className="font-semibold">{it.name}</div>
            <div className="text-sm text-slate-500">Value: {it.value} — Cost: {it.cost}</div>
          </div>
          <a href={`/developer/store-items/${it.id}`} className="px-2 py-1 bg-slate-100 rounded">Manage</a>
        </div>
      ))}
    </div>
  )
}

function StoreTransactionsList({ storeId }: { storeId: number }) {
  const [txs, setTxs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTxs() }, [storeId])

  const fetchTxs = async () => {
    try {
      setLoading(true)
      // Updated endpoint to match backend
      const data = await fetchJson(`/api/developer/store-transactions/?store=${storeId}`)
      setTxs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading transactions…</div>
  if (!txs.length) return <div className="text-sm text-slate-500">No transactions</div>

  return (
    <div className="space-y-2">
      {txs.map((t) => (
        <div key={t.id} className="p-2 border rounded bg-white">
          <div className="text-sm font-semibold">{t.store_item_name} x{t.quantity} — {t.total_cost} {t.currency}</div>
          <div className="text-xs text-slate-500">Buyer: {t.buyer_name} ({t.buyer_email})</div>
          <div className="text-xs text-slate-500">{t.purchased_at ? new Date(t.purchased_at).toLocaleString() : ''}</div>
        </div>
      ))}
    </div>
  )
}
