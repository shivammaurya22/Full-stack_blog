"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Edit, Trash2, Heart } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/models/Post"

interface BlogCardProps {
  post: Post & { _id: string }
  currentUserId?: string
  onEdit?: (post: Post & { _id: string }) => void
  onDelete?: (postId: string) => void
}

export function BlogCard({ post, currentUserId, onEdit, onDelete }: BlogCardProps) {
  const isOwner = currentUserId === post.authorId
  const truncatedContent = post.content.length > 200 ? post.content.substring(0, 200) + "..." : post.content

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
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
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(post)} className="hover:bg-primary/10">
                <Edit className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(post._id)}
                className="hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{truncatedContent}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 hover:from-primary/20 hover:to-secondary/20"
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
            className="text-muted-foreground hover:text-secondary hover:bg-secondary/10"
          >
            <Heart className="h-4 w-4 mr-1 text-secondary" />
            Like
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 hover:bg-primary/10">
            <Link href={`/post/${post._id}`}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
