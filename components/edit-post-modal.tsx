"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Plus } from "lucide-react"
import type { Post } from "@/lib/models/Post"

interface EditPostModalProps {
  post: (Post & { _id: string }) | null
  isOpen: boolean
  onClose: () => void
  onPostUpdated: (updatedPost: Post & { _id: string }) => void
}

export function EditPostModal({ post, isOpen, onClose, onPostUpdated }: EditPostModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags || [],
      })
    }
  }, [post])

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post || !formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      const updatedPost = {
        ...post,
        ...formData,
        updatedAt: new Date(),
      }

      onPostUpdated(updatedPost)
      onClose()

      toast({
        title: "Success",
        description: "Your post has been updated successfully!",
      })
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Edit Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="Enter your post title..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/100 characters</p>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium text-foreground">
              Content
            </Label>
            <Textarea
              id="edit-content"
              placeholder="Write your story here..."
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px] bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              maxLength={5000}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.content.length}/5000 characters</p>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="edit-tags" className="text-sm font-medium text-foreground">
              Tags (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="edit-tags"
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                maxLength={20}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || formData.tags.length >= 10}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none border-border hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
