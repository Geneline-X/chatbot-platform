"use client"

import React from 'react'
import Link from 'next/link'
import { Briefcase, FileDown, Layout, MessageCircle, Pencil, User } from 'lucide-react'
import { useChatbot } from './business/BusinessContext'

const Sidebar = () => {
  const { currentChatbot } = useChatbot()
  return (
    <div className="h-full bg-gray-100 w-64 flex flex-col space-y-1 p-6 shadow-lg">
      <Link href="/chatbot-dashboard" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
         Home
      </Link>
      <Link href="/chatbot-dashboard/users" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
        Users
      </Link>
      <Link href="/chatbot-dashboard/chatbots" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
         Chatbots
      </Link>
      { currentChatbot && (
        <Link href="/chatbot-dashboard/design" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
         Design
      </Link>
      )}
      <Link href="/chatbot-dashboard/train" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
         Train Chatbot
      </Link>
      <Link href="/chatbot-dashboard/settings" className="hover:bg-blue-300 p-3 font-semibold text-lg rounded transition-colors duration-200 flex items-center space-x-3">
        Settings
      </Link>
      {/* Add more links as needed */}
    </div>
  )
}

export default Sidebar
