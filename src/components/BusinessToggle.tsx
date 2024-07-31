"use client"

import React, { useState } from "react"
import { ArrowBigRight, ArrowRight, ChevronsUpDown } from "lucide-react"
import { buttonVariants } from './ui/button'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useBusiness } from "./business/BusinessContext"

interface BusinessToggleProps{
  id: string | undefined
}
const BusinessToggle: React.FC<BusinessToggleProps> = ({id}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentBusiness } = useBusiness()
  return (
    <>
    {id ? (
      <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[250px] space-y-2"
    >
      <div className="flex items-center px-4">
        <h4 className="text-lg font-semibold">
          {currentBusiness?.name 
          ? currentBusiness?.name : 
          <>
           create business <ArrowRight className="h-4 w-4 m-1"/>
          </>}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0" onClick={() => setIsOpen(!isOpen)}>
            <ChevronsUpDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 bg-white shadow-md rounded-md p-4 mt-5 z-10">
        <Link href="/chatbot-dashboard/business" className={buttonVariants({ 
          variant: "ghost", size: "sm", 
          className: "text-xl" 
        })}>
          Switch Business
        </Link>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0" onClick={() => setIsOpen(!isOpen)}>
            <ChevronsUpDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </CollapsibleContent>
      </Collapsible>
    )
    :null}
    </>
  )
}

export default BusinessToggle
