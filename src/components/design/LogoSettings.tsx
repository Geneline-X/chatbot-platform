"use client"
import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface LogoSettingsProps {
  formData: any
  updateFormData: (key: string, value: any) => void
}

const LogoSettings: React.FC<LogoSettingsProps> = ({ formData, updateFormData }) => {
  const [logo, setLogo] = useState<File | null>(null)
  const { startUpload, isUploading } = useUploadThing('freePlanUploader')

  useEffect(() => {
    if (formData.logo) {
      setLogo(null) // Initialize logo if needed
    }
  }, [formData.logo])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setLogo(file)
    }
  }

  const handleLogoUpload = async (): Promise<void> => {
    if (logo) {
      const res = await startUpload([logo])
      const [responseFile] = res || []
      updateFormData('logo', responseFile.url)
    }
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Logo Settings</h3>
      <div className="flex flex-col items-start">
        <Label htmlFor="logo" className="mb-2">Logo</Label>
        <Input 
          id="logo" 
          type="file" 
          accept="image/*" 
          onChange={handleLogoChange} 
          className="mb-2"
        />
        {formData.logo && (
          <div className="mt-2">
            <Image
              src={formData.logo} 
              alt="Logo preview" 
              className="w-16 h-16 object-cover" 
              width={64}
              height={64}
            />
          </div>
        )}
        <Button onClick={handleLogoUpload} className='mt-2' disabled={isUploading}>
          Upload {isUploading && <Loader2 className='h-4 w-4 animate-spin'/> }
        </Button>
      </div>
    </div>
  )
}

export default LogoSettings
