import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { LoginLink, RegisterLink, getKindeServerSession, } from '@kinde-oss/kinde-auth-nextjs/server'
import UserAccountNav from './UserAccountNav'
import BusinessToggle from './BusinessToggle'
import { ArrowRight } from 'lucide-react'

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
                           <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-800 animate-gradient-move'>GeniStudio</span> 
                        </Link>
                    </div>
                    {!user ? (
                        <div className='flex items-center space-x-4'>
                            <BusinessToggle/>

                            <Link href="/dashboard" 
                               className={buttonVariants({ 
                                variant: "ghost", size: "sm", 
                                className:"text-xl" 
                                })}>
                                Docs
                            </Link>

                            <LoginLink className={buttonVariants({
                                variant: "ghost",
                                size: "sm"
                            })}>
                                Sign in
                            </LoginLink>
                            <RegisterLink className={buttonVariants({size: "sm"})}>
                                Get Started <ArrowRight className='ml-1.5 h-5 w-5'/>
                            </RegisterLink>
                            {/* <UserAccountNav 
                                name={!user?.given_name || !user.family_name ? "Your Account" : `${user.given_name} ${user.family_name}`}
                                email={user?.email ?? ""}
                                imageUrl={user?.picture ?? ""}
                            /> */}
                        </div>
                    ): (
                      <>
                        <Link href="/chatbot-dashboard" className={buttonVariants({
                            variant: "ghost",
                            size: "sm"
                        })}>
                            Dashboard
                        </Link>
                        <UserAccountNav 
                            name={!user.given_name || !user.family_name ? "Your Account" : `${user.given_name} ${user.family_name}`}
                            email={user.email ?? ""}
                            imageUrl={""} //user.picture ??
                        />
                     </>
                    )}
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
