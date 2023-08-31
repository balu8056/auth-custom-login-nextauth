import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import Credentials from 'next-auth/providers/credentials'
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CookieStorage,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'

const userPoolData = {
  UserPoolId: String(process.env.COGNITO_USER_POOL),
  ClientId: String(process.env.COGNITO_WEB_CLIENT_ID),
}

const userPool = new CognitoUserPool(userPoolData)

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const authenticationDetails = new AuthenticationDetails({
          Username: String(credentials?.username),
          Password: String(credentials?.password),
        })

        const userData = {
          Username: String(credentials?.username),
          Pool: userPool,
          Storage: new CookieStorage({ domain: 'localhost', secure: true }),
        }

        const cognitoUser = new CognitoUser(userData)

        function asyncAuthenticateUser(cognitoUser: CognitoUser, cognitoAuthenticationDetails: AuthenticationDetails) {
          return new Promise(function (resolve, reject) {
            cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
              onSuccess: resolve,
              onFailure: reject,
            })
          })
        }

        try {
          let result = (await asyncAuthenticateUser(cognitoUser, authenticationDetails)) as CognitoUserSession

          if ('idToken' in result) {
            return {
              id: result.getIdToken().payload.sub,
              name: result.getIdToken().payload.name,
              email: result.getIdToken().payload.email,
              image: result.getIdToken().payload.image,
              user: {
                access_token: result.getAccessToken().getJwtToken(),
                attributes: {
                  'cognito:username': result.getIdToken().payload['custom:username'],
                  'custom:is_multi_admin': result.getIdToken().payload['custom:is_multi_admin'],
                  'custom:org': result.getIdToken().payload['custom:org'],
                  'custom:org_id': result.getIdToken().payload['custom:org_id'],
                  'custom:role': result.getIdToken().payload['custom:role'],
                  'custom:user_id': result.getIdToken().payload['custom:user_id'],
                },
              },
            }
          } else {
            return null
          }
        } catch (err) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt(params: {
      token: JWT
      user: User | AdapterUser
      account: Account | null
      profile?: Profile | undefined
    }) {
      if (params.user && params.user.user) {
        params.token.access_token = params.user.user.access_token
        params.token.user_attributes = params.user.user.attributes
      }

      return params.token
    },
    async session(params: { session: Session; token: JWT; user: AdapterUser }) {
      // @ts-ignore
      params.session.access_token = params.token.access_token
      // @ts-ignore
      params.session.user.attributes = params.token.user_attributes

      return params.session
    },
  },
}

export default NextAuth(authOptions)
