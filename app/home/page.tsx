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
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {session.user.name}!</h1>
              <p className="text-lg text-muted-foreground">
                Discover amazing stories from the community or share your own.
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/create-post">
                  <PenTool className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
              <Button asChild variant="outline">
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
