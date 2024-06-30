"use client"
import React from 'react'

const Analytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Chatbot Performance</h2>
          <p className="text-lg">Detailed performance metrics...</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Business Performance</h2>
          <p className="text-lg">Overall business metrics...</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
