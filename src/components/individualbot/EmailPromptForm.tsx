"use client";
import { useContext, useState } from "react";
import { ChatContex } from "./ChatContext";
import { isValidEmail } from "@/lib/utils";
import { toast } from "../ui/use-toast";

 interface EmailPromptFormProps {
  onEmailSubmit: (email: string) => void;
  onSkip: () => void;
  welcomeMessage: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  };
}

const EmailPromptForm = ({ onEmailSubmit, onSkip, theme, welcomeMessage }: EmailPromptFormProps) => {
  const { email, setEmail } = useContext(ChatContex);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isValidEmail(email)){
      onEmailSubmit(email);
    }else{
      toast({
        title: "Invalid Email provided",
        variant: "destructive"
      })
    }
    
  };

 

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-4 text-center"
      style={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.font }}
    >
      <h2
        className="text-lg font-semibold"
        style={{ color: theme.fontColor, fontSize: theme.fontSize }}
      >
        {welcomeMessage}
      </h2>
      <p
        className="text-sm"
        style={{ color: theme.backgroundColor, fontSize: theme.fontSize }}
      >
        Enter your email to save your chat messages. If you skip, your messages will be lost after the session.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none"
          style={{
            borderColor: theme.secondaryColor,
            backgroundColor: theme.chatBubbleUserColor,
            color: theme.fontColor,
            fontFamily: theme.font,
          }}
        />
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: theme.chatBubbleUserColor,
              color: theme.fontColor,
              fontFamily: theme.font,
              fontSize: theme.fontSize,
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailPromptForm;
