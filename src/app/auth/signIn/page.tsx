'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const [authError, setAuthError] = useState<string>('')
  const [usernameError, setUserNameError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [calledPush, setCalledPush] = useState(false)

  useEffect(() => {
    if (session && session.user) {
      setCalledPush(true)
      if (calledPush) {
        return
      }
      router.push('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, session?.user])

  const handleAuthSignIn = () => {
    if (username == null || username == '') {
      setUserNameError('Username is required')
      return
    } else {
      setUserNameError('')
      setAuthError('')
    }

    if (password == null || password == '') {
      setPasswordError('Password is required')
      return
    } else {
      setPasswordError('')
      setAuthError('')
    }

    signIn('credentials', { username, password, callbackUrl: String(process.env.NEXT_PUBLIC_BASE_URL), redirect: false }).then((res) => {
      if (res?.ok) {
        router.push('/')
      } else {
        setAuthError('Invalid Credentials!')
      }
    })
  }

  const handleSignUpRedirect = () => {
    router.push('/auth/signUp')
  }

  return (
    <>
      <section id="login-section" className="bg-gray-100">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold">
            <img className=" w-48 h-12 mr-2" src="../../Lighcast_RGB_Lockup_Color.png" alt="logo" />
          </a>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">Sign in to your account</h1>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@emsibg.com"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <p className="text-red-500 text-sm mt-1" id="email-error">
                  {usernameError}
                </p>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium ">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-red-500 text-sm mt-1" id="password-error">
                  {passwordError}
                </p>
              </div>
              <p className="text-red-500 text-sm mt-2" id="auth-error">
                {authError}
              </p>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleAuthSignIn}
              >
                Sign in
              </button>
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?
                <button className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1" onClick={handleSignUpRedirect}>
                  Sign up
                </button>
              </p> */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
