import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from 'next/navigation'
import { db } from '@/db'
import Main from '@/components/dashboard/Main'
import Analytics from '@/components/dashboard/Analytics'

interface Props {}

const Page = async() => {

  const { getUser } = getKindeServerSession()

  const user = await getUser()
  if(!user || !user.email) redirect("/auth-callback?origin=chatbot-dashboard")

  const dbUser = await db.user.findFirst({
    where: {email : user.email}
  })
  
  if(!dbUser){
    redirect("/auth-callback?origin=chatbot-dashboard")
  }
// work on the analytics, create a basic form to get user details, who interacted with the created bot
  return (
    <MaxWidthWrapper>
      <p>Welcome {user.given_name}!</p>
      <Main/>
      <Analytics/>
  </MaxWidthWrapper>
  )
}

export default Page