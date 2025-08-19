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

    // Check if user already liked the post
    const existingLike = await db.collection("likes").findOne({
      postId: new ObjectId(postId),
      userId: userId,
    })

    let isLiked: boolean
    let likesCount: number

    if (existingLike) {
      // Unlike the post
      await db.collection("likes").deleteOne({
        postId: new ObjectId(postId),
        userId: userId,
      })
      isLiked = false
    } else {
      // Like the post
      await db.collection("likes").insertOne({
        postId: new ObjectId(postId),
        userId: userId,
        createdAt: new Date(),
      })
      isLiked = true
    }

    // Get updated likes count
    likesCount = await db.collection("likes").countDocuments({
      postId: new ObjectId(postId),
    })

    return NextResponse.json({
      likes: likesCount,
      isLiked: isLiked,
    })
  } catch (error) {
    console.error("Error handling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
