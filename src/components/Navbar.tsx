// import React from 'react'
// import Link from 'next/link'
// import { buttonVariants } from './ui/button'
// import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// import UserAccountNav from './UserAccountNav'
// import BusinessToggle from './BusinessToggle'
// import { ArrowRight, Menu } from 'lucide-react'

import React from 'react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import UserAccountNav from './UserAccountNav'
import BusinessToggle from './BusinessToggle'
import { ArrowRight, Menu } from 'lucide-react'

const Navbar = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    return (
        <nav className='sticky h-16 inset-x-0 top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm'>
            <div className='h-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl flex items-center justify-between'>
                <div className='flex items-center'>
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            GeniStudio
                        </span>
                    </Link>
                    {/* Mobile menu button - only visible on small screens */}
                    <button className='sm:hidden ml-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'>
                        <Menu className='h-6 w-6' />
                    </button>
                </div>

                <div className='flex items-center space-x-4'>
                    {!user ? (
                        <>
                            <LoginLink className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                                className: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            })}>
                                Sign in
                            </LoginLink>
                            <RegisterLink className={buttonVariants({
                                size: "sm",
                                className: 'bg-blue-600 text-white hover:bg-blue-700'
                            })}>
                                Get Started <ArrowRight className='ml-1.5 h-5 w-5'/>
                            </RegisterLink>
                        </>
                    ) : (
                        <>
                            <BusinessToggle id={user.id} />
                            <Link href="/chatbot-dashboard" className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                                className: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            })}>
                                Dashboard
                            </Link>
                            <UserAccountNav 
                                name={!user.given_name || !user.family_name ? "Your Account" : `${user.given_name} ${user.family_name}`}
                                email={user.email ?? ""}
                                imageUrl={user.picture ?? ""}
                            />
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar

// export default Navbar
