"use client";

import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedCode: string;
}

const ExportChatbotModal: React.FC<ExportModalProps> = ({ isOpen, onClose, embedCode }) => {

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Embed code copied to clipboard",
        description: "You can now paste it into your website's HTML.",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-4 rounded">
          <h2 className="text-xl mb-4">Public Link</h2>
          <p>Copy the following link and share it: </p>
          <Textarea
            readOnly
            value={embedCode}
            className="border p-2 mt-2 w-full h-48 bg-gray-800 text-green-500 font-mono text-sm"
          />
          <Button onClick={handleCopyToClipboard} className="bg-blue-500 text-white p-2 mt-4 w-full">
            Copy to Clipboard
          </Button>
          <Button onClick={onClose} className="bg-gray-500 text-white p-2 mt-4 w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExportChatbotModal;
