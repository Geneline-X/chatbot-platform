"use client"
import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type ThemeSettingsProps = {
  formData: any
  updateFormData: (key: string, value: any) => void
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ formData, updateFormData }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    chatBubbleUserColor: '#E0E0E0',
    chatBubbleBotColor: '#007BFF',
    backgroundColor: '#F0F0F0',
    font: 'Arial',
    fontSize: '14px'
  })

  useEffect(() => {
    if (formData.theme) {
      setTheme(formData.theme)
    }
  }, [formData.theme])

  const handleInputChange = (field: keyof typeof theme, value: string) => {
    const updatedTheme = {
      ...theme,
      [field]: value,
    }
    setTheme(updatedTheme)
    updateFormData('theme', updatedTheme)
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <Input
            id="primaryColor"
            type="color"
            value={theme.primaryColor}
            onChange={(e) => handleInputChange('primaryColor', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <Input
            id="secondaryColor"
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="chatBubbleUserColor">User Chat Bubble Color</Label>
          <Input
            id="chatBubbleUserColor"
            type="color"
            value={theme.chatBubbleUserColor}
            onChange={(e) => handleInputChange('chatBubbleUserColor', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="chatBubbleBotColor">Bot Chat Bubble Color</Label>
          <Input
            id="chatBubbleBotColor"
            type="color"
            value={theme.chatBubbleBotColor}
            onChange={(e) => handleInputChange('chatBubbleBotColor', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="font">Font</Label>
          <Input
            id="font"
            type="text"
            value={theme.font}
            onChange={(e) => handleInputChange('font', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="fontSize">Font Size</Label>
          <Input
            id="fontSize"
            type="text"
            value={theme.fontSize}
            onChange={(e) => handleInputChange('fontSize', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings
