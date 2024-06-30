"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, {useState} from 'react'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { toast } from '../ui/use-toast';
import { Business } from './types';

  export interface BusinessFromProps{
    id:string
    name: string,
    description: string,
    industry: string
  }
  export interface CreateBusinessFormProps {
    onSave: (business: Omit<BusinessFromProps, 'id'>) => void;
    onCancel: () => void;
  }
  
  export interface BusinessListProps {
    businesses: Business[];
    onEdit: (business: BusinessFromProps) => void;
    onDelete: (id: string) => void;
  }
const CreateBusinessForm: React.FC<CreateBusinessFormProps> = ({onCancel, onSave}) => {
  const router = useRouter()
    const [business, setBusiness] = useState<Omit<BusinessFromProps, "id">>({
        name: '',
        description: '',
        industry: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusiness((prevBusiness) => ({
        ...prevBusiness,
        [name]: value,
    }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(business);
    // createBusiness({
    //   name: business.name, 
    //   description: business.description,
    //   industry: business.industry
    // })
    };

    const { mutate: createBusiness, isLoading } = trpc.createBusiness.useMutation({
      onSuccess: (data) => {
        toast({
          title: `Business created Successfully with the name ${data.name}`,
          description: `we will redirect you to create your chatbot for your business`
        })
          router.push('/chatbot-dashboard/chatbots')
        }
    })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Create Business</h2>
      <div className='flex flex-col space-y-1'>
        <Label className="block text-sm font-medium">Business Name</Label>
        <Input
          type="text"
          name="name"
          value={business.name}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>
      <div className='flex flex-col space-y-1'>
        <Label className="block text-sm font-medium">Description</Label>
        <Textarea
          minRows={4}
          name="description"
          value={business.description}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>
      <div className='flex flex-col space-y-1'>
        <Label className="block text-sm font-medium">Industry</Label>
        <Input
          type="text"
          name="industry"
          value={business.industry}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div className="flex justify-between">
        <Button
          onClick={onCancel}
          variant={"destructive"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
        >
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin'/> : "Save"}
        </Button>
      </div>
    </form>
  )
}

export default CreateBusinessForm