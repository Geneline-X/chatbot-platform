"use client"
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface DirectMessageFormProps {
  userEmail: string;
  onSendMessage: (message: string) => Promise<void>;
}

const DirectMessageForm: React.FC<DirectMessageFormProps> = ({ userEmail, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setIsLoading(true);
      try {
        await onSendMessage(message);
        setMessage('');
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
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
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </div>
  );
};

export default DirectMessageForm;