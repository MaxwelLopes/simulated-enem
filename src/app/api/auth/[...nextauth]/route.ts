import { compare } from 'bcryptjs';
import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials"

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
            label: 'Email',
            type: 'email',
            placeholder: 'hello@example'
        },
        password: { label: 'Password', type: 'password'}
      },
      async authorize(credentials){
        
        if (!credentials?.email || !credentials.password){
            return null
        }

        const user = await prisma.user.findUnique({
            where: {
                email: credentials.email
            }
        })


        if(!user){
            return null
        }
        const isPasswordValid = await compare(
            credentials.password,
            user.password
        )
        if(!isPasswordValid){
            return null
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            randomKey: 'Hey cool'
        }
      }
    })
  ],
  pages: {
    signIn: 'login', // Definindo a página customizada de login
},
  callbacks: {
    session: ({ session, token }) => {
        console.log('Session Callback', {session, token})
        return {
            ...session,
            user: {
                ...session.user,
                id: token.id,
                randomKey: token.randomKey
            }
        }
    },
    jwt: ({ token, user }) => {
        console.log('JWT Callback', {token, user})
        if(user){
            const u = user as unknown as any
            return {
                ...token,
                id: u.id,
                randomKey: u.randomKey
            }
        }
        return token
    },


    async redirect({ url, baseUrl }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`
        return baseUrl
      }
}
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}