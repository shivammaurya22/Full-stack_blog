"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/components/providers/session-provider"
import { Navbar } from "@/components/navbar"
import { BlogFeed } from "@/components/blog-feed"
import { Button } from "@/components/ui/button"
import { PenTool, TrendingUp } from "lucide-react"
import Link from "next/link"

function HomePage() {
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {session.user.name}!</h1>
              <p className="text-lg text-muted-foreground">
                Discover amazing stories from the community or share your own.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Link href="/create-post">
                  <PenTool className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 bg-transparent"
              >
                <Link href="/profile">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Latest Stories</h2>
          <p className="text-muted-foreground">Explore the latest posts from our community of writers.</p>
        </div>

        <BlogFeed />
      </main>
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
