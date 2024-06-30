"use client"
import React, {useState} from 'react'
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface Props {}

// Safety settings type
export interface SafetySettings {
    harassment: number;
    hateSpeech: number;
    sexuallyExplicit: number;
    dangerousContent: number;
  }
  
  // Configurable parameters type
  export interface ConfigurableParameters {
    topP: number;
    topK: number;
    temperature: number;
    stopSequence: string;
    maxOutputLength: number;
    responseCandidates: number;
  }

  //safetySettings: SafetySettings, configParams: ConfigurableParameters
  interface ConfigurationProps {
    onSave?: (safetySettings:any, configParams:any) => void;
    onCancel?: () => void;
  }
const ConfigurationForm: React.FC<ConfigurationProps> = ({onCancel, onSave}) => {

    const [safetySettings, setSafetySettings] = useState<SafetySettings>({
        harassment: 50,
        hateSpeech: 50,
        sexuallyExplicit: 50,
        dangerousContent: 50,
      });
    
      const [configParams, setConfigParams] = useState<ConfigurableParameters>({
        topP: 0.9,
        topK: 40,
        temperature: 0.7,
        stopSequence: '',
        maxOutputLength: 200,
        responseCandidates: 1,
      });
    
      const handleSafetyChange = (category: keyof SafetySettings, value: number) => {
        setSafetySettings((prevSettings) => ({
          ...prevSettings,
          [category]: value,
        }));
      };

    const handleConfigChange = (param: keyof ConfigurableParameters, value: any) => {
        setConfigParams((prevParams) => ({
          ...prevParams,
          [param]: value,
        }));
      };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(onSave){
            onSave(safetySettings, configParams);
        }
        
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-4 w-full">
      <div className='space-x-8 space-y-4'>
         <div className=' space-y-1'>
         <h2 className="text-xl text-center mb-2 font-bold">Safety Settings</h2>
         <div className='flex justify-between'>
        <Label className="block w-full text-sm font-medium">Harassment</Label>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          value={[safetySettings.harassment]}
          onValueChange={(e) => handleSafetyChange('harassment', +e)}
          className="w-full h-4"
        />
         </div>
        <div className='flex justify-between'>
            <Label className="block w-full text-sm font-medium">Hate Speech</Label>
            <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={[safetySettings.hateSpeech]}
            onValueChange={(e) => handleSafetyChange('hateSpeech', +e)}
            className="w-full"
            />
        </div>
        <div className='flex justify-between'>
            <Label className="block w-full text-sm font-medium">Sexually Explicit</Label>
            <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={[safetySettings.sexuallyExplicit]}
            onValueChange={(e) => handleSafetyChange('sexuallyExplicit', +e)}
            className="w-full"
            />
        </div>
        <div className='flex justify-between'>
            <Label className="block w-full text-sm font-medium">Dangerous Content</Label>
            <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={[safetySettings.dangerousContent]}
            onValueChange={(e) => handleSafetyChange('dangerousContent', +e)}
            className="w-full"
            />
        </div>
        </div>
      <div className='flex flex-col space-y-1'>     
      <h2 className='text-xl text-center font-bold'>Configuration Settings</h2>
        <div>
            <Label className="block text-sm font-medium">Top K</Label>
            <Slider
            value={[configParams.topK]}
            onValueChange={(e) => handleConfigChange('topK', +e)}
            className="w-full"
            step={1}
            min={0}
            />
        </div>
        <div>
            <Label>Temperature</Label>
            <Slider
            defaultValue={[0.5]}
            value={[configParams.temperature]}
            onValueChange={(e) => handleConfigChange('temperature', +e)}
            className="w-full"
            step={0.01}
            min={0}
            max={1}
            />
        </div>
        <div>
            <Label className="block text-sm font-medium">Stop Sequence</Label>
            <Input
            type="text"
            value={configParams.stopSequence}
            onChange={(e) => handleConfigChange('stopSequence', e.target.value)}
            className="w-full"
            />
        </div>
        <div>
            <Label className="block text-sm font-medium">Max Output Length</Label>
            <Input
            type="number"
            value={configParams.maxOutputLength}
            onChange={(e) => handleConfigChange('maxOutputLength', +e.target.value)}
            className="w-full"
            step="1"
            min="1"
            />
        </div>
        <div>
        <Label>Number of Response Candidates</Label>
        <Input
          type="number"
          value={configParams.responseCandidates}
          onChange={(e) => handleConfigChange('responseCandidates', +e.target.value)}
          className="w-full"
          step="1"
          min="1"
        />
        </div>
    </div>
      </div>
      <div className="flex ml-8 space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </Button>
      </div>
    </form>
  )
}

export default ConfigurationForm