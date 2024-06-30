"use client"
import React from 'react'

interface Props {}

const Main = () => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Total Interactions</h2>
          <p className="text-lg">12345</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Active Chatbots</h2>
          <p className="text-lg">12</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">User Engagement</h2>
          <p className="text-lg">75%</p>
        </div>
      </div>
    </div>
  )
}

export default Main