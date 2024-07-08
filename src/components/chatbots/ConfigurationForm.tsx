"use client"
import React, { useState } from 'react'
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '../ui/use-toast';

// Configurable parameters type
export interface ConfigurableParameters {
  topP: number;
  topK: number;
  temperature: number;
  stopSequence: string;
  maxOutputLength: number;
  responseCandidates: number;
}

// ConfigurableParameters passed as props
interface ConfigurationProps {
  configParams: ConfigurableParameters;
  onConfigChange: (param: keyof ConfigurableParameters, value: any) => void;
  onSave?: (configParams: ConfigurableParameters) => void;
  onCancel?: () => void;
}

const ConfigurationForm: React.FC<ConfigurationProps> = ({ onCancel, onSave, configParams, onConfigChange }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(configParams);
    }
    console.log("this is the config params: ", configParams)
    toast({
      title: "Chatbot configuration updated successfully",
    })
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-4 w-full">
      <div className='space-x-8 space-y-4'>
        <div className='flex flex-col space-y-1'>     
          <h2 className='text-xl text-center font-bold'>Configuration Settings</h2>
          <div>
            <Label className="block text-sm font-medium">Top P</Label>
            <Slider
              value={[configParams.topP]}
              onValueChange={(e) => onConfigChange('topP', +e)}
              className="w-full"
              step={0.01}
              min={0}
              max={1}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Top K</Label>
            <Slider
              value={[configParams.topK]}
              onValueChange={(e) => onConfigChange('topK', +e)}
              className="w-full"
              step={1}
              min={0}
            />
          </div>
          <div>
            <Label>Temperature</Label>
            <Slider
              value={[configParams.temperature]}
              onValueChange={(e) => onConfigChange('temperature', +e)}
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
              onChange={(e) => onConfigChange('stopSequence', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Max Output Length</Label>
            <Input
              type="number"
              value={configParams.maxOutputLength}
              onChange={(e) => onConfigChange('maxOutputLength', +e.target.value)}
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
              onChange={(e) => onConfigChange('responseCandidates', +e.target.value)}
              className="w-full"
              step="1"
              min="1"
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button
          type="submit"
          size="lg"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default ConfigurationForm;
