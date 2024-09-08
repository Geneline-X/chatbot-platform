"use client"

import React, { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableCaption } from '@/components/ui/table';
import { MyLoader } from '../MyLoader'; // Import MyLoader
import { useBusiness } from '../business/BusinessContext';
import { ChatbotProps } from '../business/types'
import { Input } from '../ui/input';

interface ChatbotUser {
  email: string;
  createAt: Date;
}

const DisplayUserDashboard = () => {
  const { currentBusiness } = useBusiness();
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  //@ts-ignore
  const { mutate: getAllChatbots, isLoading } = trpc.getAllChatbots.useMutation({ 
    onSuccess: (data) => {
      console.log(data);
      setChatbots(data);
    },
  });

  useEffect(() => {
    if (currentBusiness?.id) {
      const businessId: string = currentBusiness?.id;
      getAllChatbots({ businessId });
    }
  }, [currentBusiness?.id, getAllChatbots]);

  // Filter chatbots based on the search term
  const filteredChatbots = chatbots.filter(chatbot => 
    chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chatbot.chatbotUsers.some((user:any) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate the paginated data
  const totalItems = filteredChatbots.flatMap(chatbot => chatbot.chatbotUsers).length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredChatbots.flatMap(chatbot => chatbot.chatbotUsers).slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Determine if Previous and Next buttons should be disabled
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || totalItems === 0;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <MyLoader />
        </div>
      ) : (
        <>
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
              {paginatedUsers.map((user: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{chatbots.find(chatbot => chatbot.chatbotUsers.includes(user))?.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isPreviousDisabled}
              className={`px-4 py-2 rounded-md ${isPreviousDisabled ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isNextDisabled}
              className={`px-4 py-2 rounded-md ${isNextDisabled ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayUserDashboard;
