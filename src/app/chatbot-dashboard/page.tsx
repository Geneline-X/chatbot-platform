import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from 'next/navigation'
import { db } from '@/db'
import Main from '@/components/dashboard/Main'
import Analytics from '@/components/dashboard/Analytics'
import PageContent from '@/components/dashboard/PageContent'

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

  return (
    <MaxWidthWrapper>
      <PageContent/>
  </MaxWidthWrapper>
  )
}

export default Page