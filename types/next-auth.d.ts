declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      username: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    username: string
  }
}
