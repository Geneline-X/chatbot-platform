"use client"
import React from 'react'

const FilesList = ({ chatbotId }:any) => {
  const files:any = [
    // Fetch files from API or state
  ]

  return (
    <div>
      {files.map((file:any) => (
        <div key={file.id} className="p-4 bg-white shadow rounded mb-4">
          <p>{file.name}</p>
        </div>
      ))}
    </div>
  )
}

export default FilesList
