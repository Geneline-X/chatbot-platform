"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Ghost, Home, Layout, MessageCircle, Pencil, User, Settings } from 'lucide-react'
import { useChatbot } from './business/BusinessContext'
import { cn } from '@/lib/utils'

const Sidebar = () => {
  const { currentChatbot } = useChatbot()
  const pathname = usePathname()
  
  return (
    <div className="w-64 bg-white shadow-sm h-full flex flex-col">
      <nav className="flex-1 overflow-y-auto py-4">
        <SidebarLink href="/chatbot-dashboard" icon={<Home />} label="Home" active={pathname === '/chatbot-dashboard'} />
        <SidebarLink href="/chatbot-dashboard/users" icon={<User />} label="Users" active={pathname === '/chatbot-dashboard/users'} />
        <SidebarLink href="/chatbot-dashboard/chatbots" icon={<Ghost />} label="Chatbots" active={pathname === '/chatbot-dashboard/chatbots'} />
        
        {currentChatbot && (
          <>
            <div className="px-6 py-3 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Current Chatbot
            </div>
            <SidebarLink href="/chatbot-dashboard/design" icon={<Pencil />} label="Design" active={pathname === '/chatbot-dashboard/design'} />
            <SidebarLink href="/chatbot-dashboard/train" icon={<MessageCircle />} label="Train Chatbot" active={pathname === '/chatbot-dashboard/train'} />
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <SidebarLink href="/chatbot-dashboard/settings" icon={<Settings />} label="Settings" active={pathname === '/chatbot-dashboard/settings'} />
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label, active }) => (
  <Link 
    href={href} 
    className={cn(
      "flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200",
      active 
        ? "text-blue-600 bg-blue-50" 
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    )}
  >
    <span className={cn("mr-3", active ? "text-blue-500" : "text-gray-400")}>{icon}</span>
    <span>{label}</span>
  </Link>
)

export default Sidebar
