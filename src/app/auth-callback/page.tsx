"use client"
import AuthCallback from '@/components/AuthCallback'
import React from 'react'

import { Suspense } from 'react'
interface Props {}

const Page = () => {


  return (
    <Suspense>
     <AuthCallback/>
    </Suspense>
  )
}

export default Page