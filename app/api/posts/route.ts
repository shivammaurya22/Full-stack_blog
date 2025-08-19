import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import type { CreatePostData } from "@/lib/models/Post"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    const client = await clientPromise
    const db = client.db("blogapp")
    const posts = db.collection("posts")

    let query = {}

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
          { authorUsername: { $regex: search.replace("@", ""), $options: "i" } },
        ],
      }
    }

    const allPosts = await posts.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(allPosts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("blogapp")
    const posts = db.collection("posts")

    const postData: CreatePostData = {
      title,
      content,
      tags: tags || [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorUsername: session.user.username,
      authorImage: session.user.image,
    }

    const result = await posts.insertOne({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
