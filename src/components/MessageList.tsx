"use client"
import React from 'react'

const MessagesList = ({ chatbotMessages }:any) => {


  return (
    <div>
       {chatbotMessages.map((message: any) => (
        <div key={message.id} className="p-4 bg-white shadow rounded mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              ID: {message.id}
            </span>
            <span className={`text-sm ${message.isUserMessage === true ? 'text-blue-500' : 'text-green-500'}`}>
              {message.isUserMessage === true ? 'User Message' : 'Bot Message'}
            </span>
          </div>
          <div className="text-gray-600">
            <p>Chatbot ID: {message.chatbotId}</p>
          </div>
          {/* Add more metrics or information here as needed */}
        </div>
      ))}
    </div>
  )
}

export default MessagesList
