"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditPostModal } from "@/components/edit-post-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Post {
  _id: string
  title: string
  content: string
  tags: string[]
  author: {
    name: string
    email: string
    image: string
    username: string
  }
  createdAt: string
  updatedAt: string
}

export default function PostPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load post",
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
      router.push("/home")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
          className: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30",
        })
        router.push("/profile")
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Button asChild>
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isAuthor = session?.user?.email === post.author.email

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>
        </Button>

        {/* Post Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-4">
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">
                    {post.author.name}
                  </div>
                  <div className="text-sm text-muted-foreground">@{post.author.username}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModalOpen(true)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="text-3xl font-bold text-foreground leading-tight">{post.title}</h1>

            {/* Post Meta */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <span className="text-xs">• Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 hover:from-primary/20 hover:to-secondary/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {isAuthor && (
          <>
            <EditPostModal
              post={post}
              open={editModalOpen}
              onOpenChange={setEditModalOpen}
              onPostUpdated={(updatedPost) => {
                setPost(updatedPost)
                toast({
                  title: "Success",
                  description: "Post updated successfully",
                  className: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30",
                })
              }}
            />
            <DeleteConfirmModal
              open={deleteModalOpen}
              onOpenChange={setDeleteModalOpen}
              onConfirm={handleDelete}
              title="Delete Post"
              description="Are you sure you want to delete this post? This action cannot be undone."
            />
          </>
        )}
      </div>
    </div>
  )
}
