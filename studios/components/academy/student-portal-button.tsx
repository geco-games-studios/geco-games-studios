"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

// Sends signed-in academy users straight to their dashboard
// (admins to the admin panel); everyone else goes to the login page.
export default function StudentPortalButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const router = useRouter()

  function handleClick() {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login?type=student")
      return
    }
    try {
      const parsed = JSON.parse(userData)
      const isAdmin = parsed.type === "admin" || parsed.academy_sub_type === "admin" || parsed.is_staff === true
      router.push(isAdmin ? "/academy/admin/dashboard" : "/academy/dashboard")
    } catch {
      router.push("/login?type=student")
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
