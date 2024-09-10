"use client"
import React from 'react'

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Create Chatbot',
    'Design',
    'Train',
    'Deploy'
  ]

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index < currentStep ? 'bg-blue-500 text-white' : 
              index === currentStep ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressTracker