"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, User } from "lucide-react"
import { clearAuthSession, getDashboardPathForUser } from "@/lib/auth-session"

type PortalUser = {
  name?: string
  email?: string
  type?: string
  sub_user_type?: string
  jampass_sub_type?: string
}

export default function PortalAccountMenu() {
  const [user, setUser] = useState<PortalUser | null>(null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { setUser(null) }
    }

    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  if (!user) return null

  const accountType = user.type === "jampass"
    ? `JamPass${user.jampass_sub_type || user.sub_user_type ? ` · ${user.jampass_sub_type || user.sub_user_type}` : ""}`
    : user.type || "Member"

  const handleLogout = () => {
    clearAuthSession()
    router.push("/login")
  }

  return (
    <div ref={menuRef} className="portal-account fixed z-[80]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#201a40]/95 p-3 text-left shadow-2xl backdrop-blur-xl transition hover:border-violet-400/30"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
          <User className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-white">{user.name || user.email || "My account"}</span>
          <span className="block truncate text-[11px] capitalize text-violet-200">{accountType}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="portal-account-panel absolute bottom-[calc(100%+10px)] left-0 w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#17132f] shadow-[0_24px_70px_rgba(0,0,0,.5)]">
          <div className="border-b border-white/10 p-4">
            <p className="break-all text-sm font-semibold text-white">{user.email || "No email available"}</p>
            <span className="mt-2 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-violet-200">
              {accountType}
            </span>
          </div>
          <Link href={getDashboardPathForUser(user)} onClick={() => setOpen(false)} className="flex px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5">Dashboard</Link>
          <Link href="/select-service" onClick={() => setOpen(false)} className="flex px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5">Switch service</Link>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
