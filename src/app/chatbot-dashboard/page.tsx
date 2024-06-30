import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from 'next/navigation'
import { db } from '@/db'
import Main from '@/components/dashboard/Main'
import Analytics from '@/components/dashboard/Analytics'

interface Props {}

const Page = async() => {

  // const { getUser } = getKindeServerSession()

  // const user = await getUser()
  // if(!user || !user.id) redirect("/auth-callback?origin=dashboard")

  // const dbUser = await db.user.findFirst({
  //   where: {id : user.id}
  // })
  
  // if(!dbUser){
  //   redirect("/auth-callback?origin=dashboard")
  // }

  return (
    <MaxWidthWrapper>
      <p>Welcome Dennis!</p>
      <Main/>
      <Analytics/>
  </MaxWidthWrapper>
  )
}

export default Page