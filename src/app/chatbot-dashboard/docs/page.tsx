import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'

interface Props {}

const Page = () => {
  return (
    <MaxWidthWrapper>
      <h1 className="text-2xl font-bold mb-4">Docs</h1>
      <p>Welcome to the docs page!</p>
  </MaxWidthWrapper>
  )
}

export default Page