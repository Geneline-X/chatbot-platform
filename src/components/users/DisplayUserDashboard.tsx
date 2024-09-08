"use client"

import React, { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableCaption } from '@/components/ui/table';
import { Loader2, Ghost } from 'lucide-react';
import { useBusiness } from '../business/BusinessContext';
import { ChatbotProps } from '../business/types'

interface ChatbotUser {
  email: string;
  createAt: Date;
}

interface Chatbot {
  id: string;
  name: string;
  chatbotUsers: ChatbotUser[];
}

const DisplayUserDashboard = () => {
    const { currentBusiness } = useBusiness()
    
    const [chatbots, setChatbots] = useState<any[]>([])
  //@ts-ignore
  const { mutate: getAllChatbots, isLoading } = trpc.getAllChatbots.useMutation({ 
    onSuccess: (data) => {
        console.log(data)
        setChatbots(data)
    },
  });
  

  useEffect(() => {
    if(currentBusiness?.id){
      const businessId:string = currentBusiness?.id
      getAllChatbots({businessId}) 
    } 
  }, [currentBusiness?.id, getAllChatbots])

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <Table>
          <TableCaption>Users and their associated chatbots</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Chatbot</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Date Interacted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chatbots.flatMap(chatbot =>
              chatbot.chatbotUsers.map((user:any) => (
                <TableRow key={`${chatbot.id}-${user.email}`}>
                  <TableCell>{chatbot.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DisplayUserDashboard;
