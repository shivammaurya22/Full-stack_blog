import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("blogapp")
    const posts = db.collection("posts")

    const userPosts = await posts.find({ authorUsername: params.username }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(userPosts)
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 })
  }
}
