"use client"
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

type BehaviorSettingsProps = {
  setBehaviorProps: (behavior: any | null) => void
}
const BehaviorSettings: React.FC<BehaviorSettingsProps> = ({setBehaviorProps}) => {
  const [behavior, setBehavior] = useState({
    showTypingIndicator: true,
    messageDelay: 1000,
    autoRespondingHours: '9am-5pm',
    offlineMessage: 'We are currently offline. Please leave a message.'
  })

  useEffect(() => {
    if(behavior){
      setBehaviorProps(behavior)
    }
  }, [behavior, setBehaviorProps])
  const handleInputChange = (field: keyof typeof behavior, value: string) => {
    setBehavior((prevBehavior) => ({
      ...prevBehavior,
      [field]: value,
    }))
  }

  const handleSwitchChange = (field: keyof typeof behavior, value: boolean) => {
    setBehavior((prevBehavior) => ({
      ...prevBehavior,
      [field]: value,
    }))
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Behavior Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Label htmlFor="typingIndicator" className="mr-2">Show Typing Indicator</Label>
          <Switch
            id="typingIndicator"
            checked={behavior.showTypingIndicator}
            onCheckedChange={(checked) => handleSwitchChange('showTypingIndicator', checked)}
          />
        </div>
        <div>
          <Label htmlFor="messageDelay">Message Delay (ms)</Label>
          <Input
            id="messageDelay"
            type="number"
            value={behavior.messageDelay}
            onChange={(e) => handleInputChange('messageDelay', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="autoRespondingHours">Auto-responding Hours</Label>
          <Input
            id="autoRespondingHours"
            type="text"
            value={behavior.autoRespondingHours}
            onChange={(e) => handleInputChange('autoRespondingHours', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="offlineMessage">Offline Message</Label>
          <Input
            id="offlineMessage"
            type="text"
            value={behavior.offlineMessage}
            onChange={(e) => handleInputChange('offlineMessage', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

export default BehaviorSettings
