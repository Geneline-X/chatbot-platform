import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import DisplayUserDashboard from '@/components/users/DisplayUserDashboard'
import React from 'react'

interface Props {}

const page = () => {
  return (
    <MaxWidthWrapper>
        <DisplayUserDashboard/>
    </MaxWidthWrapper>
  )
}

export default page