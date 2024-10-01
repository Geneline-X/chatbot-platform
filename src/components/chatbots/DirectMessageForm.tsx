"use client"
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface DirectMessageFormProps {
  userEmail: string;
  onSendMessage: (message: string) => void;
}

const DirectMessageForm: React.FC<DirectMessageFormProps> = ({ userEmail, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Send Message to {userEmail}</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="mb-4"
          minRows={4}
        />
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
};

export default DirectMessageForm;