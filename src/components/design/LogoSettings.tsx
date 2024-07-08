"use client"
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUploadThing } from '@/lib/uploadthing'

type LogoSettingsProps = {
  setLogoUrl: (url: string | undefined) => void
}
const LogoSettings: React.FC<LogoSettingsProps> = ({setLogoUrl}) => {
  const [logo, setLogo] = useState<File | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogo(e.target.files[0])
    }
  }

  const {startUpload} = useUploadThing(
     'freePlanUploader'
  )

  const handleLogoUpload = async(): Promise<void> => {
    if (logo) {
      // Handle logo upload logic
      console.log('Logo uploaded:', logo)
      const res = await startUpload([logo])
      const [responseFile] = res || []
      setLogoUrl(responseFile.url)
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
        <Button className="mt-2" onClick={handleLogoUpload}>Upload Logo</Button>
      </div>
    </div>
  )
}

export default LogoSettings
