"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PenTool, Calendar, Hash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface ProfileHeaderProps {
  user: {
    name: string
    username: string
    email: string
    image?: string
    createdAt: Date
  }
  postCount: number
}

export function ProfileHeader({ user, postCount }: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <Card className="bg-background/95 backdrop-blur-sm border-border shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">@{user.username}</p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="text-sm">{postCount} posts</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/create-post">
                    <PenTool className="mr-2 h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
