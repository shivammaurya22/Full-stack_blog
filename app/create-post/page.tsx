"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/components/providers/session-provider"
import { Navbar } from "@/components/navbar"
import { CreatePostForm } from "@/components/create-post-form"
import { PenTool } from "lucide-react"

function CreatePostPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
              <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Story</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a new blog post and share your thoughts with the community. Your voice matters.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <CreatePostForm />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <CreatePostPage />
    </AuthProvider>
  )
}
