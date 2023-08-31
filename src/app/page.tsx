'use client'

import { Menu, Transition } from '@headlessui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface UserTokens {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: string
  token_type: string
}

interface CurrentUserDetails {
  name: string
  email: string
  username: string
  is_multi_admin: string
  org: string
  org_id: string
  role: string
  user_id: string
  tokens?: UserTokens | undefined
}

export default function Component() {
  const { data: session } = useSession()
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<CurrentUserDetails | undefined>(undefined)

  const getRoleImage = (role: string) => {
    if (role === 'Super Admin')
      return 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
    else if (role === 'Org Admin')
      return 'https://images.unsplash.com/photo-1590431257462-ae5c0e1baf1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=695&q=80'
    else
      return 'https://plus.unsplash.com/premium_photo-1661414561433-cfeffc4430da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
  }

  useEffect(() => {
    if (session) {
      const UserDetails: CurrentUserDetails = {
        name: String(session.user.name),
        email: String(session.user.email),
        username: String(session.user.attributes['cognito:username']),
        is_multi_admin: String(session.user.attributes['custom:is_multi_admin']),
        org: String(session.user.attributes['custom:org']),
        org_id: String(session.user.attributes['custom:org_id']),
        role: String(session.user.attributes['custom:role']),
        user_id: String(session.user.attributes['custom:user_id']),
      }
      setCurrentUser(UserDetails)
    }
  }, [session])

  const handleSignIn = () => {
    router.push('auth/signIn')
  }

  const handleNavigateAppAdmin = () => {
    window.open(String(process.env.NEXT_PUBLIC_APPADMIN_URL), '_blank')
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center">
            <Image src="/lightcast_logo.png" className="h-8 mr-3" width={30} height={25} alt="Analyst logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Analyst</span>
          </div>

          <div className="flex items-center md:order-2 space-x-4">
            <div className="flex items-center space-x-2">
              {currentUser && (
                <>
                  <p className="text-2xl font-semibold whitespace-nowrap text-white">Hi {currentUser.name}!</p>
                  <p className="text-lg font-semibold whitespace-nowrap text-gray-500">({currentUser.role})</p>
                </>
              )}
            </div>
            {!currentUser ? (
              <button
                className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
                onClick={handleSignIn}
              >
                <p>Sign in</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </button>
            ) : (
              <div className="space-x-2 inline-block">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="justify-center bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={getRoleImage(currentUser.role)}
                        alt="Bonnie image"
                        width={40}
                        height={40}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-900 text-white' : 'text-gray-900'
                              } flex justify-between w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={handleNavigateAppAdmin}
                            >
                              <p>App Admin</p>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-red-500 text-white' : 'text-gray-900'
                              } group flex justify-between w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={() => signOut()}
                            >
                              <p>Sign out</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                />
                              </svg>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
