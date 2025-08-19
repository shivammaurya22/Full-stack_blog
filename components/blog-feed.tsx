"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BlogCard } from "@/components/blog-card"
import { EditPostModal } from "@/components/edit-post-modal"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, RefreshCw, Search } from "lucide-react"
import type { Post } from "@/lib/models/Post"

export function BlogFeed() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [posts, setPosts] = useState<(Post & { _id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingPost, setEditingPost] = useState<(Post & { _id: string }) | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchPosts = async (query = "") => {
    try {
      setLoading(true)
      const url = query ? `/api/posts?search=${encodeURIComponent(query)}` : "/api/posts"
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
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
    fetchPosts()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchPosts(query)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      setPosts(posts.filter((post) => post._id !== postId))
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (post: Post & { _id: string }) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  const handlePostUpdated = (updatedPost: Post & { _id: string }) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)))
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPost(null)
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <Button
          variant="outline"
          onClick={() => fetchPosts(searchQuery)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? `No posts match "${searchQuery}". Try a different search term.`
                  : "Be the first to share your story with the community!"}
              </p>
              {!searchQuery && (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <a href="/create-post">Create Your First Post</a>
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <EditPostModal
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  )
}
