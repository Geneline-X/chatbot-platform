"use client"
import React from 'react'
import { Business } from '../business/types'

const Analytics = ({business} : {business: Business}) => {
  const totalMessages = business.chatbots.reduce((acc, chatbot) => acc + chatbot.message.length, 0)
  const totalBrands = business.chatbots.reduce((acc, chatbot) => acc + chatbot.brands.length, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total Messages Sent</h2>
          <p className="text-lg">{totalMessages}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Brands Associated</h2>
          <p className="text-lg">{totalBrands}</p>
        </div>
      </div>
    </div>
  )

}

export default Analytics
