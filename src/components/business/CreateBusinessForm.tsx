"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';
import { Loader2, Building, FileText, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { Business } from './types';
import { useRouter } from 'next/navigation'

const steps = [
  { title: "Business Name", icon: Building },
  { title: "Description", icon: FileText },
  { title: "Industry", icon: Briefcase },
];

export interface BusinessFromProps{
    id:string
    name: string,
    description: string,
    industry: string
  }
export interface CreateBusinessFormProps {
    isLoading: boolean
    onSave: (business: Omit<BusinessFromProps, 'id'>) => void;
    onCancel: () => void;
  }
  
export interface BusinessListProps {
    businesses: Business[];
    onEdit: (business: BusinessFromProps) => void;
    onDelete: (id: string) => void;
  }

const CreateBusinessForm: React.FC<CreateBusinessFormProps> = ({onCancel, onSave, isLoading}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [business, setBusiness] = useState<Omit<BusinessFromProps, "id">>({
    name: '',
    description: '',
    industry: '',
  });

  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(business);
  };

  const renderStep = () => {
    const Step = steps[currentStep].icon;
    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Step className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
        </div>
        {currentStep === 0 && (
          <Input
            name="name"
            value={business.name}
            onChange={handleChange}
            placeholder="Enter business name"
            className="w-full"
            required
          />
        )}
        {currentStep === 1 && (
          <Textarea
            name="description"
            value={business.description}
            onChange={handleChange}
            placeholder="Describe your business"
            className="w-full"
            required
          />
        )}
        {currentStep === 2 && (
          <Input
            name="industry"
            value={business.industry}
            onChange={handleChange}
            placeholder="Enter industry"
            className="w-full"
            required
          />
        )}
      </motion.div>
    );
  };

  const { mutate: createBusiness } = trpc.createBusiness.useMutation({
    onSuccess: (data) => {
      toast({
        title: `Business created Successfully with the name ${data.name}`,
        description: `we will redirect you to create your chatbot for your business`
      })
        router.push('/chatbot-dashboard/chatbots')
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex items-center ${
              index <= currentStep ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-purple-600 flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={currentStep === 0 ? onCancel : handlePrev}
          variant="outline"
        >
          {currentStep === 0 ? 'Cancel' : <><ArrowLeft className="mr-2" /> Back</>}
        </Button>
        <Button
          type="button"
          onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isLoading}
        >
          {currentStep === steps.length - 1 ? (
            isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Business'
          ) : (
            <>Next <ArrowRight className="ml-2" /></>
          )}
        </Button>
      </div>
    </form>
  )
}

export default CreateBusinessForm