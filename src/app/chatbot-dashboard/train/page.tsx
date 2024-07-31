import Main from '@/components/train/Main'
import React from 'react'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
interface Props {}

const Page = async() => {

  const { getUser } = getKindeServerSession()

  const user = await getUser()
  if(!user || !user.email) redirect("/auth-callback?origin=chatbot-dashboard/design")

  const dbUser = await db.user.findFirst({
    where: {id : user.email}
  })
  
  if(!dbUser){
    redirect("/auth-callback?origin=chatbot-dashboard/design")
  }
  
  return (
    <>
     <Main/>
    </>
  )
}

export default Page