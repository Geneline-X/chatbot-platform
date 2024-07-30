"use client"
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

type AdvancedSettingsProps = {
  formData: any
  updateFormData: (key: string, value: any) => void
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ formData, updateFormData }) => {
  const [advanced, setAdvanced] = useState({
    customCSS: '',
    chatHistory: 'enabled',
    gdprCompliance: 'enabled'
  })

  useEffect(() => {
    if (formData.advanced) {
      setAdvanced(formData.advanced)
    }
  }, [formData.advanced])

  const handleInputChange = (field: keyof typeof advanced, value: string) => {
    const updatedAdvanced = {
      ...advanced,
      [field]: value,
    }
    setAdvanced(updatedAdvanced)
    updateFormData('advanced', updatedAdvanced)
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="customCSS">Custom CSS</Label>
          <Textarea
            id="customCSS"
            minRows={4}
            value={advanced.customCSS}
            onChange={(e) => handleInputChange('customCSS', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="chatHistory">Chat History</Label>
          <Select
            value={advanced.chatHistory}
            onValueChange={(value) => handleInputChange('chatHistory', value)}
          >
            <SelectTrigger id="chatHistory" className="mt-1">
              <SelectValue>{advanced.chatHistory}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gdprCompliance">GDPR Compliance</Label>
          <Select
            value={advanced.gdprCompliance}
            onValueChange={(value) => handleInputChange('gdprCompliance', value)}
          >
            <SelectTrigger id="gdprCompliance" className="mt-1">
              <SelectValue>{advanced.gdprCompliance}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSettings
