"use client"

import React, { useState } from "react"
import { Building, ChevronDown, LogOut, Settings, Users } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useBusiness } from "./business/BusinessContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface BusinessToggleProps {
  id: string | undefined
}

const BusinessToggle: React.FC<BusinessToggleProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentBusiness } = useBusiness()

  if (!id) return null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[280px] rounded-lg bg-white shadow-md"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              
              <AvatarFallback>{currentBusiness?.name?.charAt(0) || 'B'}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{currentBusiness?.name || 'Create Business'}</p>
              <p className="text-sm text-gray-500">{currentBusiness?.industry || 'Get Started'}</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent
            forceMount
            asChild
          >
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2">
                
                
                <Link href="/chatbot-dashboard/business" passHref>
                  <Button variant="ghost" className="w-full justify-start text-blue-600">
                    <Building className="mr-2 h-4 w-4" />
                    Switch Business
                  </Button>
                </Link>
              
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}

export default BusinessToggle
