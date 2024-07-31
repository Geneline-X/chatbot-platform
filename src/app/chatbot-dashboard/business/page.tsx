
import React from 'react';
import Main from '@/components/business/Main';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
interface Props {}

const Page = async() => {

  const { getUser } = getKindeServerSession()

  const user = await getUser()
  
  if(!user || !user.email) redirect("/auth-callback?origin=chatbot-dashboard")

  const dbUser = await db.user.findFirst({
    where: {email : user?.email}
  })

  if(!dbUser){
    redirect("/auth-callback?origin=chatbot-dashboard")
  }
  
  // const subscriptionPlan = await getUserSubscriptionPlan()
  
   return (
    <>
      <Main/>
    </>
   )
}

export default Page