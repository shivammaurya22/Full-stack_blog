"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BlogCard } from "@/components/blog-card"
import { EditPostModal } from "@/components/edit-post-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, RefreshCw, FileText } from "lucide-react"
import type { Post } from "@/lib/models/Post"

interface UserPostsProps {
  username: string
  onPostCountChange?: (count: number) => void
}

export function UserPosts({ username, onPostCountChange }: UserPostsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [posts, setPosts] = useState<(Post & { _id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<(Post & { _id: string }) | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${username}/posts`)

      if (!response.ok) {
        throw new Error("Failed to fetch user posts")
      }

      const data = await response.json()
      setPosts(data)
      onPostCountChange?.(data.length)
    } catch (error) {
      console.error("Error fetching user posts:", error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserPosts()
  }, [username])

  const handleDelete = async (postId: string) => {
    setPostToDelete(postId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/posts/${postToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      const updatedPosts = posts.filter((post) => post._id !== postToDelete)
      setPosts(updatedPosts)
      onPostCountChange?.(updatedPosts.length)

      toast({
        title: "Success",
        description: "Post deleted successfully.",
        className: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPostToDelete(null)
      setDeleteModalOpen(false)
    }
  }

  const handleEdit = (post: Post & { _id: string }) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  const handlePostUpdated = (updatedPost: Post & { _id: string }) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)))
    toast({
      title: "Success",
      description: "Post updated successfully.",
      className: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30",
    })
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPost(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Posts</h2>
          <p className="text-muted-foreground">
            {posts.length === 0 ? "No posts yet" : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchUserPosts}
          disabled={loading}
          className="flex items-center gap-2 bg-transparent hover:bg-primary/10 border-primary/20"
        >
          <RefreshCw className={`h-4 w-4 text-primary ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Posts Grid */}
      {!loading && (
        <>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  currentUserId={session?.user?.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing your stories with the community!</p>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                <a href="/create-post">Create Your First Post</a>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit Post Modal */}
      <EditPostModal
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onPostUpdated={handlePostUpdated}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  )
}
