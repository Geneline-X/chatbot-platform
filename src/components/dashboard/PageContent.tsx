"use client"

import React from "react"
import { useBusiness } from "../business/BusinessContext"
import { buttonVariants } from "../ui/button"
import { MyLoader } from "../MyLoader"
import Link from "next/link"
import { Plus, Briefcase } from "lucide-react"
import Main from '@/components/dashboard/Main'
import Analytics from '@/components/dashboard/Analytics'

const PageContent = () => {
  const { currentBusiness, isLoading } = useBusiness()

  if (isLoading) {
    return (
      <div className="mt-5">
        <MyLoader />
      </div>
    )
  }

  if (!currentBusiness) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-600">You don&apos;t have any businesses yet.</p>
        <Link
          className={buttonVariants({ size: "sm", className: "mt-4" })}
          href="/chatbot-dashboard/business"
        >
          <Plus className="mr-2" /> Create Business
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Briefcase className="text-blue-600 w-8 h-8" />
        <div>
          <h1 className="text-2xl font-bold">{currentBusiness.name}</h1>
          <p className="text-gray-500">{currentBusiness.description || "No description provided."}</p>
        </div>
      </div>
      <Main business={currentBusiness} />
      <Analytics business={currentBusiness} />
    </div>
  )
}

export default PageContent
