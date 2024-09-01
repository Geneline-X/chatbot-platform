"use client"
import React from 'react'
import { Business } from '../business/types'
interface Props {}

const Main = ({business} : {business: Business}) => {
  const totalChatbots = business.chatbots.length
  const totalInteractions = business.chatbots.reduce((acc, chatbot) => acc + chatbot.message.length, 0)
  const totalFiles = business.chatbots.reduce((acc, chatbot) => acc + chatbot.file.length, 0)
  
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold">Total Interactions</h2>
        <p className="text-lg">{totalInteractions}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold">Total Chatbots</h2>
        <p className="text-lg">{totalChatbots}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold">Total Files Uploaded</h2>
        <p className="text-lg">{totalFiles}</p>
      </div>
    </div>
  )
}

export default Main