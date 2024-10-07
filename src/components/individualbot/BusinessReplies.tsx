"use client"
import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChatContex } from './ChatContext';

interface BusinessRepliesProps {
  chatbotId: string;
  chatbotUserId: string;
  theme: any;
}

const BusinessReplies: React.FC<BusinessRepliesProps> = ({ chatbotId, chatbotUserId, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { email } = useContext(ChatContex);

  const fetchBusinessReplies = async ({ pageParam = undefined }) => {
    if (!email) {
      throw new Error('Email is required');
    }
    const res = await fetch(`/api/getbusinessreply?email=${email}&cursor=${pageParam || ''}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch business replies');
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['businessReplies', chatbotUserId, email],
    queryFn: fetchBusinessReplies,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!email, // Only run the query if email is available
  });

  const replies = useMemo(() => data?.pages.flatMap(page => page.replies) || [], [data]);

  useEffect(() => {
    scrollToBottom();
  }, [replies]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!email) return <div className="text-center text-gray-500">Email is required to fetch replies.</div>;
  if (status === 'loading') return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primaryColor }} /></div>;
  if (status === 'error') return <div className="text-center" style={{ color: theme.errorColor }}>Error fetching replies</div>;

  return (
    <div className="flex flex-col h-full rounded-lg shadow-inner p-4" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {replies.length === 0 ? (
          <p className="text-center" style={{ color: theme.secondaryTextColor }}>No business replies yet.</p>
        ) : (
          replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-center w-full"
            >
              <div className="w-full p-3 rounded-lg shadow" style={{ backgroundColor: theme.primaryColor, }}>
                <div className="flex items-center mb-2 justify-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Business</span>
                </div>
                <p className="text-center text-lg">{reply.text}</p>
                <small className="text-sm opacity-75 mt-2 block text-center">
                  {new Date(reply.timestamp).toLocaleString()}
                </small>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: isFetchingNextPage ? theme.disabledColor : theme.primaryColor, 
              color: theme.primaryTextColor,
              cursor: isFetchingNextPage ? 'not-allowed' : 'pointer'
            }}
          >
            {isFetchingNextPage ? <Loader2 className='w-4 h-4 animate-spin'/> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessReplies;