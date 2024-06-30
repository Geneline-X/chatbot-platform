import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import UserAccountNav from './UserAccountNav'
import BusinessToggle from './BusinessToggle'

const Navbar = async() => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    return (
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    {/* Logo */}
                    <div className='flex items-center space-x-2'>
                        <Link href="/" className='flex z-40 font-semibold text-3xl'>
                            {/* X<span className='text-xl mt-1'>-PLAIN-AI</span> */}
                            Chatbot Platform
                        </Link>
                    </div>
                    {true && (
                        <div className='flex items-center space-x-4'>
                            <BusinessToggle/>
                            <Link href="/dashboard" 
                            className={buttonVariants({ 
                                variant: "ghost", size: "sm", 
                                className:"text-xl" 
                                })}>
                                Docs
                            </Link>
                            {/* <UserAccountNav 
                                name={!user?.given_name || !user.family_name ? "Your Account" : `${user.given_name} ${user.family_name}`}
                                email={user?.email ?? ""}
                                imageUrl={user?.picture ?? ""}
                            /> */}
                        </div>
                    )}
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
