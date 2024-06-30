"use client"
import React from 'react'

const MessagesList = ({ chatbotId }:any) => {
  const messages:any = [
    // Fetch messages from API or state
  ]

  return (
    <div>
      {messages.map((message:any) => (
        <div key={message.id} className="p-4 bg-white shadow rounded mb-4">
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}

export default MessagesList
