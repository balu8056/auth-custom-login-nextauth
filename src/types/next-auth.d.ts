import NextAuth, { DefaultSession } from 'next-auth'

interface UserAttributes {
  'cognito:username': string
  'custom:is_multi_admin': string
  'custom:org': string
  'custom:org_id': string
  'custom:role': string
  'custom:user_id': string
}

declare module 'next-auth' {
  interface Session {
    user: {
      attributes: UserAttributes
      access_token: string
    } & DefaultSession['user']
  }

  interface User {
    user: {
      attributes: UserAttributes
      access_token: string
    } & DefaultSession['user']
  }
}
