"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Edit, Trash2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Post } from "@/lib/models/Post"

interface BlogCardProps {"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Edit, Trash2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Post } from "@/lib/models/Post"

interface BlogCardProps {
  post: Post & { _id: string }
  currentUserId?: string
  onEdit?: (post: Post & { _id: string }) => void
  onDelete?: (postId: string) => void
  onLike?: (updatedPost: Post & { _id: string }) => void
  showFullContent?: boolean
}

export function BlogCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
  showFullContent = false,
}: BlogCardProps) {
  const [likes, setLikes] = useState<string[]>(post.likes || [])
  const [isLiking, setIsLiking] = useState(false)
  const { toast } = useToast()

  const isOwner = currentUserId === post.authorId
  const isLiked = currentUserId ? likes.includes(currentUserId) : false
  const likesCount = likes.length

  const truncatedContent = showFullContent
    ? post.content
    : post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content

  const handleLike = async () => {
    if (!currentUserId || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
        // notify parent so BlogFeed can also update its state
        onLike?.({ ...post, likes: data.likes })
      } else {
        toast({
          title: "Error",
          description: "Failed to like post. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-200/25 dark:hover:shadow-blue-900/25">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                {post.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {post.authorName}
              </p>
              <p className="text-sm text-muted-foreground">
                @{post.authorUsername} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(post)}>
                <Edit className="h-4 w-4 text-primary hover:text-primary/80" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(post._id)}>
                <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">{truncatedContent}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`${isLiked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500`}
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            {likesCount > 0 ? likesCount : "Like"}
          </Button>

          {!showFullContent && (
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link href={`/post/${post._id}`}>Read More</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

  post: Post & { _id: string }
  currentUserId?: string
  onEdit?: (post: Post & { _id: string }) => void
  onDelete?: (postId: string) => void
  onLike?: (updatedPost: Post & { _id: string }) => void  // <-- added
  showFullContent?: boolean
}

export function BlogCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
  showFullContent = false,
}: BlogCardProps) {
  const [likes, setLikes] = useState(post.likes || [])
  const [isLiking, setIsLiking] = useState(false)
  const { toast } = useToast()
  const isOwner = currentUserId === post.authorId
  const isLiked = currentUserId ? likes.includes(currentUserId) : false
  const likesCount = likes.length

  const truncatedContent = showFullContent
    ? post.content
    : post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content

  const handleLike = async () => {
    if (!currentUserId || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
        onLike?.({ ...post, likes: data.likes })  // <-- notify parent
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-200/25 dark:hover:shadow-blue-900/25">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                {post.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {post.authorName}
              </p>
              <p className="text-sm text-muted-foreground">
                @{post.authorUsername} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(post)}>
                <Edit className="h-4 w-4 text-primary hover:text-primary/80" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(post._id)}>
                <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">{truncatedContent}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`${isLiked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500`}
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            {likesCount > 0 ? likesCount : "Like"}
          </Button>
          {!showFullContent && (
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link href={`/post/${post._id}`}>Read More</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
