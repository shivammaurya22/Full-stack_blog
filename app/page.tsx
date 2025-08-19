"use client"

import { useSession } from "next-auth/react"
import { AuthProvider } from "@/components/providers/session-provider"
import { Navbar } from "@/components/navbar"
import { LandingPage } from "@/components/landing-page"
import { redirect } from "next/navigation"

function HomePage() {
  const { data: session, status } = useSession()

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
    redirect("/home")
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingPage />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
