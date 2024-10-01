import InteractionsPage from '@/components/chatbots/interactions/InteractionsPage'
import React from 'react'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';

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
    <div>
      <InteractionsPage/>
    </div>
  )
}

export default Page