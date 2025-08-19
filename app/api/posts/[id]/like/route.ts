import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const postId = params.id
    const userId = session.user.id

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const currentLikes = post.likes || []
    const isCurrentlyLiked = currentLikes.includes(userId)

    let updatedLikes: string[]

    if (isCurrentlyLiked) {
      // Unlike the post - remove user ID from likes array
      updatedLikes = currentLikes.filter((id: string) => id !== userId)
    } else {
      // Like the post - add user ID to likes array
      updatedLikes = [...currentLikes, userId]
    }

    // Update the post with new likes array
    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          likes: updatedLikes,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      likes: updatedLikes,
      isLiked: !isCurrentlyLiked,
    })
  } catch (error) {
    console.error("Error handling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
