'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatbotUsersList from '@/components/chatbots/interactions/ChatbotUsersLists';
import UserInteractions from '@/components/chatbots/interactions/UserInteractions';
import DirectMessageForm from '@/components/chatbots/DirectMessageForm';
import { Button } from '@/components/ui/button';
import { Phone, Mail, BarChart2, Settings, Loader2, Search } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

const InteractionsPage = () => {
  const { chatbotId } = useParams();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const {
    data: usersData,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetchingNextPage: isFetchingNextUsers,
    isLoading: isLoadingUsers,
  } = trpc.getChatbotUsers.useInfiniteQuery(
    { chatbotId: chatbotId as string, limit: INFINITE_QUERY_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const {
    data: messagesData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasNextMessages,
    isFetchingNextPage: isFetchingNextMessages,
    isLoading: isLoadingMessages,
  } = trpc.getChatbotUserMessages.useInfiniteQuery(
    { chatbotUserId: selectedUser as string, limit: INFINITE_QUERY_LIMIT },
    {
      enabled: !!selectedUser,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const sendDirectMessageMutation = trpc.sendDirectMessage.useMutation();
  const updateInteractionMutation = trpc.updateInteraction.useMutation();

  const { data: analyticsData, isLoading: isLoadingAnalytics } = trpc.getChatbotAnalytics.useQuery({ chatbotId: chatbotId as string });

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return usersData?.pages.flatMap(page => page.users) || [];
    return (usersData?.pages.flatMap(page => page.users) || []).filter(user =>
      user?.email!.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersData, searchTerm]);

  const messages = useMemo(() => {
    return messagesData?.pages.flatMap(page => page.messages.map(message => ({
      ...message,
      createAt: new Date(message.createAt)
    }))) || [];
  }, [messagesData]);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleLikeMessage = (messageId: string, liked: boolean) => {
    console.log('Like message:', messageId, liked);
    // Implement the like functionality here
  };

  const handleSendDirectMessage = async (message: string) => {
    if (!selectedUser) return;
    await sendDirectMessageMutation.mutateAsync({
      chatbotUserId: selectedUser,
      message,
      chatbotId: chatbotId as string,
    });
    // Optionally, refetch interactions after sending a message
  };

  const handleCall = () => {
    toast({
      title: "Coming Soon",
      description: "We're currently working on this feature.",
      duration: 3000,
    });
  };

  const handleEmail = () => {
    if (selectedUser) {
      const user = usersData?.pages.flatMap(page => page.users).find(user => user.id === selectedUser);
    
      if (user && user.email) {
        const emailSubject = encodeURIComponent("Regarding your recent interaction");
        const emailBody = encodeURIComponent("Hello,\n\nI'm reaching out regarding your recent interaction with our chatbot...");
        
        const mailtoLink = `mailto:${user.email}?subject=${emailSubject}&body=${emailBody}`;
        
        window.location.href = mailtoLink;
      } else {
        toast({
          title: "User Email Not Found",
          description: "We couldn't find an email for the selected user.",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "No User Selected",
        description: "Please select a user before attempting to send an email.",
        duration: 3000,
      });
    }
  };

  const handleUpdateInteraction = async (interactionId: string, data: { resolved?: boolean, category?: string, sentiment?: string }) => {
    await updateInteractionMutation.mutateAsync({
      interactionId,
      ...data,
    });
    // Optionally, refetch interaction details after update
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chatbot Interactions</h1>
      <Tabs defaultValue="interactions" className="space-y-6">
        <TabsList className="w-full bg-white shadow-sm rounded-lg p-1">
          <TabsTrigger value="interactions" className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Interactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interactions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <ChatbotUsersList
                  users={filteredUsers.map(user => ({
                    ...user,
                    createAt: new Date(user.createAt),
                    updatedAt: new Date(user.updatedAt)
                  }))}
                  onSelectUser={handleSelectUser}
                  onLoadMore={fetchNextUsers}
                  hasMore={hasNextUsers ?? false}
                  isLoading={isFetchingNextUsers}
                />
              )}
            </div>
            <div className="md:col-span-2">
              {selectedUser ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{selectedUser}</h2>
                    <div className="flex space-x-4 mb-6">
                      <Button onClick={handleCall} className="flex items-center bg-green-500 hover:bg-green-600">
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </Button>
                      <Button onClick={handleEmail} className="flex items-center bg-blue-500 hover:bg-blue-600">
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </Button>
                    </div>
                    <DirectMessageForm
                      userEmail={selectedUser}
                      onSendMessage={handleSendDirectMessage}
                    />
                  </div>
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md h-[calc(100vh-300px)] overflow-hidden">
                      <UserInteractions
                      //@ts-ignore
                        messages={messages}
                        onLoadMore={fetchNextMessages}
                        hasMore={hasNextMessages ?? false}
                        isLoading={isFetchingNextMessages}
                        onClose={() => setSelectedUser(null)}
                        onLikeMessage={handleLikeMessage}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">Select a user to view their interactions</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-blue-500" /> Analytics
            </h2>
            {isLoadingAnalytics ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : analyticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-blue-800">Total Interactions</p>
                  <p className="text-3xl font-bold text-blue-600">{analyticsData.totalInteractions}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-green-800">Resolved Interactions</p>
                  <p className="text-3xl font-bold text-green-600">{analyticsData.resolvedInteractions}</p>
                </div>
                {/* Add more analytics data visualization here */}
              </div>
            ) : (
              <p className="text-gray-500">No analytics data available</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <Settings className="mr-2 h-6 w-6 text-gray-600" /> Settings
            </h2>
            {/* Add your settings content */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractionsPage;