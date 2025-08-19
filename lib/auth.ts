import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "./mongodb"
import type { CreateUserData } from "./models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise
          const db = client.db("blogapp")
          const users = db.collection("users")

          const existingUser = await users.findOne({ email: user.email })

          if (!existingUser) {
            // Generate username from email
            const username = user.email?.split("@")[0] || "user"

            const userData: CreateUserData = {
              email: user.email!,
              name: user.name!,
              image: user.image,
              username: username,
            }

            await users.insertOne({
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }

          return true
        } catch (error) {
          console.error("Error saving user:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const client = await clientPromise
          const db = client.db("blogapp")
          const users = db.collection("users")

          const dbUser = await users.findOne({ email: session.user.email })

          if (dbUser) {
            session.user.id = dbUser._id.toString()
            session.user.username = dbUser.username
          }
        } catch (error) {
          console.error("Error fetching user session:", error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
