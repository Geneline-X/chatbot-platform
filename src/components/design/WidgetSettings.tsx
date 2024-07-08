"use client"
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
 } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

type WidgetSettingsProps = {
  setWidgetProps: (widget: any) => void
}
const WidgetSettings: React.FC<WidgetSettingsProps> = ({setWidgetProps}) => {
  const [widget, setWidget] = useState({
    position: 'bottom-right',
    size: 'medium',
    welcomeMessage: 'Hi! How can I help you today?',
    botAvatar: ''
  })

  useEffect(() => {
    if(widget){
      setWidgetProps(widget)
    }
  }, [widget, setWidgetProps])
  
  const handleInputChange = (field: keyof typeof widget, value: string) => {
    setWidget((prevWidget) => ({
      ...prevWidget,
      [field]: value,
    }))
   
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWidget((prevWidget) => ({
        ...prevWidget,
        //@ts-ignore
        botAvatar: URL.createObjectURL(e.target.files[0])
      }))
    }
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Widget Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Widget Position</Label>
          <Select
            value={widget.position}
            onValueChange={(value) => handleInputChange('position', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="size">Widget Size</Label>
          <Select
            value={widget.size}
            onValueChange={(value) => handleInputChange('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Input
            id="welcomeMessage"
            type="text"
            value={widget.welcomeMessage}
            onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="botAvatar">Bot Avatar</Label>
          <Input
            id="botAvatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-1"
          />
          {widget.botAvatar && 
            <div className="mt-2">
              <Image
                src={widget.botAvatar} 
                alt="Bot Avatar" 
                className="w-16 h-16 rounded-full" 
                width={64}
                height={64}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default WidgetSettings
