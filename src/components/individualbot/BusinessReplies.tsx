"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Building2 } from 'lucide-react';

interface BusinessRepliesProps {
  chatbotId: string;
  theme: any;
}

const dummyReplies = [
  { id: 1, text: "Thank you for your inquiry. Our team will get back to you shortly.", sender: "business", timestamp: new Date(2023, 5, 1, 10, 30) },
  { id: 2, text: "I have a question about your product pricing.", sender: "user", timestamp: new Date(2023, 5, 1, 11, 15) },
  { id: 3, text: "Certainly! Our pricing starts at $19.99 per month. Would you like more details?", sender: "business", timestamp: new Date(2023, 5, 1, 11, 45) },
  { id: 4, text: "Yes, please. Can you tell me about any discounts for annual subscriptions?", sender: "user", timestamp: new Date(2023, 5, 1, 12, 0) },
  { id: 5, text: "Of course! We offer a 20% discount for annual subscriptions. This brings the price down to $191.90 per year, saving you $47.98.", sender: "business", timestamp: new Date(2023, 5, 1, 12, 30) },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 6,
    text: `This is message ${i + 6} to demonstrate scrolling.`,
    sender: i % 2 === 0 ? "user" : "business",
    timestamp: new Date(2023, 5, 1, 13, i * 5)
  }))
];

const BusinessReplies: React.FC<BusinessRepliesProps> = ({ chatbotId, theme }) => {
  const [replies, setReplies] = useState(dummyReplies);
  const [newReply, setNewReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [replies]);

  const handleSendReply = () => {
    if (newReply.trim()) {
      const newReplyObj = {
        id: replies.length + 1,
        text: newReply,
        sender: "user",
        timestamp: new Date()
      };
      setReplies([...replies, newReplyObj]);
      setNewReply('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-inner p-4">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${reply.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3/4 p-3 rounded-lg shadow ${
              reply.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800'
            }`}>
              <div className="flex items-center mb-2">
                {reply.sender === 'user' 
                  ? <User className="w-4 h-4 mr-2" /> 
                  : <Building2 className="w-4 h-4 mr-2" />
                }
                <span className="font-semibold">{reply.sender === 'user' ? 'You' : 'Business'}</span>
              </div>
              <p>{reply.text}</p>
              <small className="text-xs opacity-75 mt-1 block">
                {reply.timestamp.toLocaleString()}
              </small>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-auto">
        <div className="flex items-center bg-white rounded-lg shadow-md">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Type your reply..."
            className="flex-grow p-3 rounded-l-lg focus:outline-none"
            style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
          />
          <button
            onClick={handleSendReply}
            className="p-3 rounded-r-lg transition-colors duration-200 ease-in-out focus:outline-none"
            style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessReplies;