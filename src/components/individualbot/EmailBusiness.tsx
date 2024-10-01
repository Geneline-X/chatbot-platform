"use client"
import React, { useState } from 'react';
import { trpc } from '@/app/_trpc/client';

interface EmailBusinessProps {
  chatbotId: string;
  theme: any;
}

const EmailBusiness: React.FC<EmailBusinessProps> = ({ chatbotId, theme }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendEmailMutation = trpc.sendEmailToBusiness.useMutation();

  const handleSendEmail = async () => {
    if (subject.trim() && message.trim()) {
      await sendEmailMutation.mutateAsync({ chatbotId, subject, message, email: '' });
      setSubject('');
      setMessage('');
      alert('Email sent successfully!');
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="mb-4 p-2 border rounded"
        style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
        className="flex-grow mb-4 p-2 border rounded resize-none"
        style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
      />
      <button
        onClick={handleSendEmail}
        className="p-2 rounded"
        style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor }}
      >
        Send Email
      </button>
    </div>
  );
};

export default EmailBusiness;