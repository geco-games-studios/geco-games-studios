"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchJson, postJson } from "@/lib/api"

interface Store {
  id: number
  name: string
  description?: string
  game?: number
}

interface Game {
  id: number
  title?: string
}

export default function DeveloperStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newGameId, setNewGameId] = useState<number | "">("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => { fetchStores(); fetchGames() }, [])

  const fetchStores = async () => {
    try {
      setIsLoading(true)
      const data = await fetchJson<Store[]>('/api/developer/stores/')
      const list = Array.isArray(data) ? data : (data ? [data as any] : [])
      setStores(list)
    } catch (err) {
      console.error('Error fetching stores:', err)
      setError('Unable to load stores')
    } finally { setIsLoading(false) }
  }

  const fetchGames = async () => {
    try {
      const data = await fetchJson<Game[]>('/api/developer/games/')
      setGames(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn('Failed to load games', err)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) {
      setError('Name is required')
      return
    }
    if (!newGameId) {
      setError('Please select a game for this store')
      return
    }
    setIsCreating(true)
    setError("")
    try {
      await postJson('/api/developer/stores/', { name: newName.trim(), description: newDescription.trim(), game: Number(newGameId) })
      setNewName("")
      setNewDescription("")
      setNewGameId("")
      await fetchStores()
    } catch (err) {
      console.error('Create store failed:', err)
      setError('Failed to create store')
    } finally { setIsCreating(false) }
  }

  if (isLoading) return <div className="p-6">Loading stores…</div>
  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Stores</h2>
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      <div className="mb-6">
        <h3 className="font-semibold">Create New Store</h3>
        <div className="mt-2 flex gap-2 items-center">
          <input aria-label="Store name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Store name" className="px-3 py-2 border rounded" />
          <input aria-label="Short description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Short description" className="px-3 py-2 border rounded" />
          <select aria-label="Attach to game" value={newGameId} onChange={(e) => setNewGameId(e.target.value ? Number(e.target.value) : "")} className="px-3 py-2 border rounded">
            <option value="">Select game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.title ?? `Game ${g.id}`}</option>
            ))}
          </select>
          <button onClick={handleCreate} disabled={isCreating} className="px-3 py-2 bg-cyan-600 text-white rounded">{isCreating ? 'Creating…' : 'Create'}</button>
        </div>
      </div>

      <div className="space-y-3">
        {stores.length === 0 && <div className="text-sm text-slate-500">No stores yet.</div>}
        {stores.map((s) => (
          <div key={s.id} className="p-4 border rounded flex items-center justify-between bg-white">
            <div>
              <div className="font-semibold">{s.name}</div>
              {s.description && <div className="text-sm text-slate-500">{s.description}</div>}
              {s.game && <div className="text-xs text-slate-400">Attached to game: {s.game}</div>}
            </div>
            <div className="flex gap-2">
              <Link href={`/developer/stores/${s.id}`} className="px-3 py-2 bg-slate-100 rounded">View</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
