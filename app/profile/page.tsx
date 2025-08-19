"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/components/providers/session-provider"
import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile-header"
import { UserPosts } from "@/components/user-posts"
import { useToast } from "@/hooks/use-toast"

function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [postCount, setPostCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) return

      try {
        // In a real app, you'd have an API endpoint for this
        // For now, we'll use the session data and assume user creation date
        const profile = {
          name: session.user.name,
          username: session.user.username,
          email: session.user.email,
          image: session.user.image,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Mock: 30 days ago
        }
        setUserProfile(profile)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUserProfile()
    }
  }, [session, toast])

  if (status === "loading" || loading) {
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

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Profile not found</h2>
            <p className="text-muted-foreground">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <Navbar />

      {/* Profile Header */}
      <ProfileHeader user={userProfile} postCount={postCount} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <UserPosts username={session.user.username} onPostCountChange={setPostCount} />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <ProfilePage />
    </AuthProvider>
  )
}
