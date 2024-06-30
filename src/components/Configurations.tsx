"use client"
import React from 'react'

const Configurations = ({ configurations }:any) => {
  return (
    <div>
      <pre>{JSON.stringify(configurations, null, 2)}</pre>
    </div>
  )
}

export default Configurations
