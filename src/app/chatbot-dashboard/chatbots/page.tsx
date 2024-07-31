import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import Main from "@/components/chatbots/Main"

interface Props {}

const Page = async() => {

  const { getUser } = getKindeServerSession()

  const user = await getUser()
  if(!user || !user.email) redirect("/auth-callback?origin=chatbot-dashboard/chatbots")

  const dbUser = await db.user.findFirst({
    where: {email : user.email}
  })
  
  if(!dbUser){
    redirect("/auth-callback?origin=chatbot-dashboard/chatbots")
  }

  return (
    <>
    <Main/>
    </>
  )
}

export default Page