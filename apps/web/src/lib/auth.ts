import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/database"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          // Get user from database
          const user = await db.getUserByEmail(email)
          if (!user) {
            console.log("❌ User not found:", email)
            return null
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            console.log("❌ Invalid password for:", email)
            return null
          }

          console.log("✅ Authentication successful for:", email)
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        } catch (error) {
          console.error("❌ Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false, // Disable debug warnings in development
  trustHost: true,
}