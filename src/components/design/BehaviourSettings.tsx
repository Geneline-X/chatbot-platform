"use client"
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

type BehaviorSettingsProps = {
  formData: any
  updateFormData: (key: string, value: any) => void
}

const BehaviorSettings: React.FC<BehaviorSettingsProps> = ({ formData, updateFormData }) => {
  const [behavior, setBehavior] = useState({
    showTypingIndicator: true,
    messageDelay: 1000,
    autoRespondingHours: '9am-5pm'
  })

  useEffect(() => {
    if (formData.behavior) {
      setBehavior(formData.behavior)
    }
  }, [formData.behavior])

  const handleInputChange = (field: keyof typeof behavior, value: any) => {
    const updatedBehavior = {
      ...behavior,
      [field]: value,
    }
    setBehavior(updatedBehavior)
    updateFormData('behavior', updatedBehavior)
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Behavior Settings</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="showTypingIndicator">Show Typing Indicator</Label>
          <Switch
            id="showTypingIndicator"
            checked={behavior.showTypingIndicator}
            onCheckedChange={(value) => handleInputChange('showTypingIndicator', value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="messageDelay">Message Delay (ms)</Label>
          <Input
            id="messageDelay"
            type="number"
            value={behavior.messageDelay}
            onChange={(e) => handleInputChange('messageDelay', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="autoRespondingHours">Auto-Responding Hours</Label>
          <Input
            id="autoRespondingHours"
            value={behavior.autoRespondingHours}
            onChange={(e) => handleInputChange('autoRespondingHours', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

export default BehaviorSettings
