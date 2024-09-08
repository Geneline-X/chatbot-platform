"use client"

import React from 'react'
import Link from 'next/link'
import { Ghost, FileDown, Layout, MessageCircle, Pencil, User, Settings } from 'lucide-react'
import { useChatbot } from './business/BusinessContext'

const Sidebar = () => {
  const { currentChatbot } = useChatbot()
  
  return (
    <div className="h-full bg-gray-100 w-64 p-6 shadow-lg fixed top-0 left-0 flex flex-col space-y-4">
      <Link href="/chatbot-dashboard" className="sidebar-link">
        <HomeIcon />
        <span>Home</span>
      </Link>
      
      <Link href="/chatbot-dashboard/users" className="sidebar-link">
        <User />
        <span>Users</span>
      </Link>
      
      <Link href="/chatbot-dashboard/chatbots" className="sidebar-link">
        <Ghost />
        <span>Chatbots</span>
      </Link>
      
      {currentChatbot && (
        <Link href="/chatbot-dashboard/design" className="sidebar-link">
          <Pencil />
          <span>Design</span>
        </Link>
      )}
      
      {currentChatbot && (
        <Link href="/chatbot-dashboard/train" className="sidebar-link">
          <MessageCircle />
          <span>Train Chatbot</span>
        </Link>
      )}
      
      <Link href="/chatbot-dashboard/settings" className="sidebar-link">
        <Settings />
        <span>Settings</span>
      </Link>
    </div>
  )
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9m0 0l9 9m-9-9v18" />
  </svg>
)

export default Sidebar
