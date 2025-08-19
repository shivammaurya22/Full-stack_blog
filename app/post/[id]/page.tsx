"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { BlogCard } from "@/components/blog-card"
import { EditPostModal } from "@/components/edit-post-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/lib/models/Post"

export default function PostPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<(Post & { _id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<(Post & { _id: string }) | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (status === "unauthenticated") {
      router.push("/")
      return
    }
  }, [status, router])

  useEffect(() => {
    if (params.id && status === "authenticated") {
      fetchPost(params.id as string)
    }
  }, [params.id, status])

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        toast({
          title: "Error",
          description: "Post not found",
          variant: "destructive",
        })
        router.push("/home")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: Post & { _id: string }) => {
    setEditingPost(post)
  }

  const handleDelete = (postId: string) => {
    setDeletingPostId(postId)
  }

  const confirmDelete = async () => {
    if (!deletingPostId) return

    try {
      const response = await fetch(`/api/posts/${deletingPostId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
          className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20",
        })
        router.push("/profile")
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingPostId(null)
    }
  }

  const handlePostUpdate = (updatedPost: Post & { _id: string }) => {
    setPost(updatedPost)
    setEditingPost(null)
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
            <Button
              onClick={() => router.push("/home")}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-blue-100 dark:hover:bg-blue-900/20">
            <ArrowLeft className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Back
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <BlogCard
            key={post._id}
            post={post}
            currentUserId={session?.user?.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showFullContent={true}
          />
        </div>

        {editingPost && (
          <EditPostModal
            post={editingPost}
            isOpen={!!editingPost}
            onClose={() => setEditingPost(null)}
            onUpdate={handlePostUpdate}
          />
        )}

        <DeleteConfirmationModal
          isOpen={!!deletingPostId}
          onClose={() => setDeletingPostId(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  )
}
