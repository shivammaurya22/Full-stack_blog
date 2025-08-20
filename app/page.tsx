"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LandingPage } from "@/components/landing-page"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (session) {
    router.push("/home")
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingPage />
    </div>
  )
}
